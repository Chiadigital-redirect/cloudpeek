import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are CloudPeek's friendly cloud expert AI for kids! 
Analyze the sky photo and identify the cloud type.

Always respond with ONLY valid JSON in this exact format:
{
  "cloudType": "Cumulus",
  "cloudId": "cumulus",
  "emoji": "⛅",
  "description": "2-3 kid-friendly sentences about this cloud",
  "funFacts": ["fact 1", "fact 2", "fact 3"],
  "rarity": "common",
  "mood": "fluffy",
  "found": true
}

cloudId must be one of: cumulus, cumulonimbus, stratus, stratocumulus, altocumulus, altostratus, cirrus, cirrocumulus, cirrostratus, nimbostratus, fog, contrails

rarity must be one of: common, uncommon, rare
- common: cumulus, stratus, stratocumulus, fog, contrails
- uncommon: altocumulus, altostratus, cirrus, nimbostratus  
- rare: cumulonimbus, cirrocumulus, cirrostratus

mood can be: fluffy, dramatic, stormy, wispy, mysterious, sleepy, angry, cheerful, magical, adventurous

If there are NO clouds visible, respond with:
{"found": false, "message": "I couldn't spot any clouds up there! Try pointing at a part of the sky with clouds ☁️"}

Keep descriptions fun, exciting, and easy for kids aged 5-18 to understand!`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64 } = body as { imageBase64: string };

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Strip data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: SYSTEM_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Data}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Identify error:', err);
    return NextResponse.json(
      { error: 'Something went wrong — try again!', found: false },
      { status: 500 },
    );
  }
}
