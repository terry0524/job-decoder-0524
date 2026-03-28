import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTRACTION_PROMPT = `You extract job posting information from content. The content may include:
- Text from a webpage
- A PDF document
- Images embedded in a job posting page (these often contain the MAIN job description details like responsibilities, requirements, qualifications)

IMPORTANT: Many Korean job posting sites put the actual job description content inside images, not in text. You MUST carefully read and extract text from ALL provided images, as they likely contain the core job information.

Return ONLY valid JSON with this exact structure:
{
  "companyName": "company name (keep original language)",
  "positionName": "job title/position name (keep original language)",
  "rawContent": "the COMPLETE job description content combining text AND image content. Include ALL details: responsibilities, requirements, qualifications, benefits, etc. Keep the original language. Be thorough - do not skip any information visible in the images."
}

If the content does not appear to be a job posting, return:
{"error": "이 페이지는 채용공고가 아닌 것 같습니다."}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences.`;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImageUrls(html: string, baseUrl: string): string[] {
  const urls: string[] = [];

  // Extract from <img> tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  // Extract from CSS background-image
  const bgRegex = /background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  // Extract from <source> tags (picture elements)
  const sourceRegex = /<source[^>]+srcset=["']([^"'\s]+)/gi;
  while ((match = sourceRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  // Normalize and filter URLs
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (let src of urls) {
    if (src.startsWith("data:")) continue;
    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) {
      try {
        const u = new URL(baseUrl);
        src = u.origin + src;
      } catch { continue; }
    } else if (!src.startsWith("http")) {
      try {
        src = new URL(src, baseUrl).toString();
      } catch { continue; }
    }

    // Only skip very obvious non-content images
    const lower = src.toLowerCase();
    if (lower.includes("favicon") || lower.includes("pixel") || lower.includes("tracking") ||
        lower.includes("analytics") || lower.includes("1x1") || lower.includes("spacer") ||
        lower.endsWith(".gif") && lower.includes("blank")) continue;

    if (!seen.has(src)) {
      seen.add(src);
      normalized.push(src);
    }
  }

  return normalized.slice(0, 10); // Up to 10 images
}

async function fetchAsBase64(url: string, refererUrl: string, maxSizeMb = 10): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": refererUrl,
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });
    if (!resp.ok) {
      console.log(`Image fetch failed: ${resp.status} for ${url.substring(0, 100)}`);
      return null;
    }
    const contentType = resp.headers.get("content-type") || "application/octet-stream";
    const mime = contentType.split(";")[0].trim();
    // Accept images, PDFs, and octet-stream (some servers don't set correct content-type)
    if (!mime.startsWith("image/") && mime !== "application/pdf" && mime !== "application/octet-stream") {
      console.log(`Skipped non-image content-type: ${mime} for ${url.substring(0, 100)}`);
      return null;
    }
    const buf = await resp.arrayBuffer();
    if (buf.byteLength > maxSizeMb * 1024 * 1024) return null;
    if (buf.byteLength < 500) return null; // Skip very tiny images
    // For octet-stream, try to detect image by magic bytes
    if (mime === "application/octet-stream") {
      const header = new Uint8Array(buf.slice(0, 4));
      const isImage = (header[0] === 0xFF && header[1] === 0xD8) || // JPEG
                      (header[0] === 0x89 && header[1] === 0x50) || // PNG
                      (header[0] === 0x52 && header[1] === 0x49) || // WEBP (RIFF)
                      (header[0] === 0x47 && header[1] === 0x49);   // GIF
      if (!isImage) return null;
    }
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const detectedMime = mime === "application/octet-stream" ? "image/jpeg" : mime;
    return { base64: btoa(binary), mimeType: detectedMime };
  } catch (e) {
    console.log(`Image fetch error: ${e} for ${url.substring(0, 100)}`);
    return null;
  }
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function callAI(apiKey: string, messages: any[]) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
    if (status === 402) throw new Error("AI 크레딧이 부족합니다.");
    throw new Error(`AI 처리 중 오류가 발생했습니다 (${status})`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI 응답을 받지 못했습니다.");
  content = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(content);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL이 필요합니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return new Response(
        JSON.stringify({ error: "유효하지 않은 URL입니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pageResponse = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,image/*;q=0.8,*/*;q=0.7",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!pageResponse.ok) {
      return new Response(
        JSON.stringify({ error: `페이지를 가져올 수 없습니다 (${pageResponse.status})` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contentType = (pageResponse.headers.get("content-type") || "").toLowerCase();

    // === Case 1: PDF ===
    if (contentType.includes("pdf") || parsedUrl.pathname.toLowerCase().endsWith(".pdf")) {
      const buf = await pageResponse.arrayBuffer();
      if (buf.byteLength > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "PDF 파일이 너무 큽니다 (최대 10MB)." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const parsed = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: EXTRACTION_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `URL: ${parsedUrl.toString()}\n\nPDF 문서에서 채용공고 정보를 추출하세요.` },
            { type: "image_url", image_url: { url: `data:application/pdf;base64,${arrayBufferToBase64(buf)}` } },
          ],
        },
      ]);

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Case 2: Direct image ===
    if (contentType.includes("image/")) {
      const buf = await pageResponse.arrayBuffer();
      if (buf.byteLength > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "이미지 파일이 너무 큽니다 (최대 10MB)." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const mime = contentType.split(";")[0].trim();
      const parsed = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: EXTRACTION_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `이미지에서 채용공고 정보를 추출하세요.` },
            { type: "image_url", image_url: { url: `data:${mime};base64,${arrayBufferToBase64(buf)}` } },
          ],
        },
      ]);

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Case 3: HTML page — ALWAYS analyze both text AND images ===
    const html = await pageResponse.text();
    const textContent = stripHtml(html).slice(0, 12000);
    const imageUrls = extractImageUrls(html, parsedUrl.toString());

    console.log(`Extracted ${textContent.length} chars of text and found ${imageUrls.length} images`);

    // Build multimodal content: text + all fetchable images
    const userContent: any[] = [
      {
        type: "text",
        text: `URL: ${parsedUrl.toString()}\n\n아래는 이 채용공고 페이지의 텍스트와 이미지입니다. 많은 한국 채용사이트에서 실제 채용 상세 내용은 이미지 안에 들어있습니다. 텍스트와 이미지를 모두 분석하여 채용공고 정보를 완전하게 추출하세요.\n\n=== 페이지 텍스트 ===\n${textContent || "(텍스트 없음)"}`,
      },
    ];

    // Fetch all images in parallel
    if (imageUrls.length > 0) {
      console.log(`Fetching ${imageUrls.length} images...`);
      const imageResults = await Promise.allSettled(
        imageUrls.map((imgUrl) => fetchAsBase64(imgUrl, parsedUrl.toString(), 5))
      );

      let addedImages = 0;
      for (const result of imageResults) {
        if (result.status === "fulfilled" && result.value) {
          userContent.push({
            type: "image_url",
            image_url: { url: `data:${result.value.mimeType};base64,${result.value.base64}` },
          });
          addedImages++;
        }
      }
      console.log(`Added ${addedImages} images to AI request`);
    }

    if (textContent.length < 50 && userContent.length === 1) {
      return new Response(
        JSON.stringify({ error: "페이지에서 텍스트나 이미지를 추출할 수 없습니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsed = await callAI(LOVABLE_API_KEY, [
      { role: "system", content: EXTRACTION_PROMPT },
      { role: "user", content: userContent },
    ]);

    if (parsed.error) {
      return new Response(
        JSON.stringify({ error: parsed.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scrape-job-url error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
