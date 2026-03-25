import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTRACTION_PROMPT = `You extract job posting information from content. The content may be text from a webpage, a PDF document, or an image of a job posting.

Return ONLY valid JSON with this exact structure:
{
  "companyName": "company name (keep original language)",
  "positionName": "job title/position name (keep original language)",
  "rawContent": "the full job description content, cleaned up and formatted nicely. Include responsibilities, requirements, qualifications, benefits etc. Keep the original language. Remove navigation, footer, cookie notices, and other non-JD content."
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
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const urls: string[] = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith("//")) src = "https:" + src;
    else if (src.startsWith("/")) {
      try {
        const u = new URL(baseUrl);
        src = u.origin + src;
      } catch { continue; }
    } else if (!src.startsWith("http")) continue;
    // Skip tiny icons, tracking pixels, etc.
    if (src.includes("logo") || src.includes("favicon") || src.includes("icon") || src.includes("pixel") || src.includes("tracking")) continue;
    urls.push(src);
  }
  return urls.slice(0, 5); // Max 5 images
}

async function fetchAsBase64(url: string, maxSizeMb = 10): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JobDecoder/1.0)" },
    });
    if (!resp.ok) return null;
    const contentType = resp.headers.get("content-type") || "application/octet-stream";
    const buf = await resp.arrayBuffer();
    if (buf.byteLength > maxSizeMb * 1024 * 1024) return null;
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return { base64: btoa(binary), mimeType: contentType.split(";")[0].trim() };
  } catch {
    return null;
  }
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
    throw new Error(`AI gateway error: ${status}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
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

    // Fetch the page
    const pageResponse = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobDecoder/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
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
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);

      const parsed = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: EXTRACTION_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `URL: ${parsedUrl.toString()}\n\nPDF 문서에서 채용공고 정보를 추출하세요.` },
            { type: "image_url", image_url: { url: `data:application/pdf;base64,${base64}` } },
          ],
        },
      ]);

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Case 2: Image file directly ===
    if (contentType.includes("image/")) {
      const buf = await pageResponse.arrayBuffer();
      if (buf.byteLength > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "이미지 파일이 너무 큽니다 (최대 10MB)." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);
      const mime = contentType.split(";")[0].trim();

      const parsed = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: EXTRACTION_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `이미지에서 채용공고 정보를 추출하세요.` },
            { type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } },
          ],
        },
      ]);

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Case 3: HTML page ===
    const html = await pageResponse.text();
    const textContent = stripHtml(html).slice(0, 15000);

    // If text is too short, the JD might be in images
    if (textContent.length < 200) {
      const imageUrls = extractImageUrls(html, parsedUrl.toString());
      if (imageUrls.length > 0) {
        // Fetch images and send to vision AI
        const imageContents: any[] = [
          { type: "text", text: `이 웹페이지의 이미지에서 채용공고 정보를 추출하세요. URL: ${parsedUrl.toString()}` },
        ];
        for (const imgUrl of imageUrls) {
          const imgData = await fetchAsBase64(imgUrl);
          if (imgData) {
            imageContents.push({
              type: "image_url",
              image_url: { url: `data:${imgData.mimeType};base64,${imgData.base64}` },
            });
          }
        }
        if (imageContents.length > 1) {
          const parsed = await callAI(LOVABLE_API_KEY, [
            { role: "system", content: EXTRACTION_PROMPT },
            { role: "user", content: imageContents },
          ]);
          return new Response(JSON.stringify(parsed), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      return new Response(
        JSON.stringify({ error: "페이지에서 충분한 텍스트를 추출할 수 없습니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normal text-based page — also check for large images that might contain JD info
    const imageUrls = extractImageUrls(html, parsedUrl.toString());
    const userContent: any[] = [
      { type: "text", text: `URL: ${parsedUrl.toString()}\n\nPage content:\n${textContent}` },
    ];

    // If there are significant images, include up to 3 for supplementary info
    if (imageUrls.length > 0) {
      const imagesToInclude = imageUrls.slice(0, 3);
      for (const imgUrl of imagesToInclude) {
        const imgData = await fetchAsBase64(imgUrl, 5);
        if (imgData && imgData.mimeType.startsWith("image/")) {
          userContent.push({
            type: "image_url",
            image_url: { url: `data:${imgData.mimeType};base64,${imgData.base64}` },
          });
        }
      }
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
