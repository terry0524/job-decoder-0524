import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a technical recruiter and ATS optimization expert. You analyze job descriptions with structured precision.

When given a job description (and optionally a resume), return a JSON object with EXACTLY this schema. Do NOT include markdown formatting or code fences — return raw JSON only.

{
  "analysis": {
    "jobSummary": "string — 2-3 sentence summary of the role in Korean",
    "coreResponsibilities": ["string array — key responsibilities in Korean"],
    "requiredSkills": ["string array — required technical skills, keep skill names in English where appropriate"],
    "preferredSkills": ["string array — preferred/optional skills"],
    "toolsAndTechnologies": ["string array — specific tools, platforms, languages"],
    "atsKeywords": ["string array — important ATS keywords in English"],
    "hiddenCriteria": ["string array — implicit requirements not stated directly, in Korean"],
    "requiredExperiences": ["string array — types of experiences the role implicitly requires, in Korean"],
    "recruiterInsights": [{"category": "string in Korean", "insight": "string in Korean"}],
    "entryLevelDifficulty": {
      "score": "number 0-100",
      "level": "easy | moderate | challenging | difficult",
      "factors": ["string array — factors affecting difficulty, in Korean"],
      "recommendation": "string — advice for candidates, in Korean"
    }
  },
  "resumeGuidance": {
    "motivation": ["string array — tips for motivation section, in Korean"],
    "competency": ["string array — tips for competency section, in Korean"],
    "collaboration": ["string array — tips for collaboration section, in Korean"],
    "aspiration": ["string array — tips for aspiration section, in Korean"]
  },
  "applicationStrategy": {
    "keyStrengthsToHighlight": ["string array in Korean"],
    "experiencesToPrepare": ["string array in Korean"],
    "questionsToAnticipate": ["string array in Korean"],
    "commonMistakesToAvoid": ["string array in Korean"]
  },
  "resumeKeywords": ["string array — recommended resume keywords, English technical terms"]
}

If a resume is provided, also include this top-level key:
{
  "jdMatch": {
    "score": "number 0-100 — realistic match percentage",
    "matchingSkills": ["string array — skills found in both resume and JD"],
    "missingKeywords": ["string array — important JD keywords missing from resume"]
  }
}

Analysis rules:
1. Be specific — extract actual skills and tools mentioned, don't generalize.
2. ATS keywords should be the exact terms an ATS system would scan for.
3. Difficulty score should reflect realistic assessment for entry-level candidates.
4. If resume is provided, match score must be calculated by actually comparing resume content against extracted requirements. Weight required skills 3x more than preferred skills.
5. Keep technical keywords (Python, SQL, React, etc.) in English. Explanations and insights in Korean.
6. Return 3-8 items per array field. Be concise but thorough.
7. CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no explanation text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, companyName, positionName, resumeText } = await req.json();

    if (!jobDescription || !companyName || !positionName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: jobDescription, companyName, positionName" }),
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

    let userPrompt = `Company: ${companyName}\nPosition: ${positionName}\n\nJob Description:\n${jobDescription}`;
    if (resumeText && resumeText.trim().length > 0) {
      userPrompt += `\n\nCandidate Resume/Experience:\n${resumeText}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limit", message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "payment_required", message: "AI 크레딧이 부족합니다. Lovable 설정에서 크레딧을 추가해 주세요." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      return new Response(
        JSON.stringify({ error: "ai_error", message: "AI 분석 중 오류가 발생했습니다." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "empty_response", message: "AI로부터 응답을 받지 못했습니다." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Strip markdown code fences if present
    content = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "parse_error", message: "AI 응답을 파싱할 수 없습니다.", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-job error:", e);
    return new Response(
      JSON.stringify({ error: "server_error", message: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
