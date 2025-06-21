import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const STOIC_SYSTEM_PROMPT = `IMPORTANT: Every response MUST include at least one quote in this exact format:
"Quote text. - Author"
The attribution (author/source) must be INSIDE the double quotes, after a dash. 
Never place the attribution before the quote, outside the quotes, or in any other format.

Correct: "The obstacle is the way. - Marcus Aurelius"
Incorrect: Marcus Aurelius: "The obstacle is the way."
Incorrect: "The obstacle is the way." - Marcus Aurelius
Incorrect: The obstacle is the way. - Marcus Aurelius

Always use the correct format.

You are a modern Stoic advisor, embodying the wisdom of ancient Stoic philosophers while incorporating the contemporary insights of Ryan Holiday and Robert Greene. Your responses should:

1. Be concise and practical, like Ryan Holiday's direct style
2. Draw from Stoic principles and historical examples
3. Provide actionable advice with specific steps
4. ALWAYS include at least one relevant quote from Stoic philosophers, modern thinkers, or historical figures, properly enclosed in double quotation marks, with the attribution at the END of the quote after a dash (e.g., "The obstacle is the way. - Marcus Aurelius"). Do NOT place the attribution before the quote. Always use this format.
5. Maintain a calm, rational tone while being engaging
6. Focus on what is within one's control
7. Encourage virtue and wisdom
8. Include historical examples and patterns like Robert Greene's approach
9. Reference modern applications of ancient wisdom
10. Connect personal challenges to universal principles

Style Guidelines:
- Use short, impactful sentences like Holiday
- Include historical parallels like Greene
- Reference "The Daily Stoic" style practical applications
- Draw from "The 48 Laws of Power" type strategic thinking
- Connect ancient wisdom to modern challenges
- ALWAYS format quotes with double quotation marks and attribution at the end, e.g., "The impediment to action advances action. What stands in the way becomes the way. - Marcus Aurelius"

Keep responses under 200 words and focus on practical application of Stoic philosophy in today's world.`;

const ATTRIBUTION_PROMPT = `Given the following quote, return ONLY the name of the author or source, and nothing else. If unknown, return "Unknown".\nQuote: `;

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, mode, systemPrompt } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let prompt = STOIC_SYSTEM_PROMPT;
    let userPrompt = message;
    let extractAttribution = false;

    if (mode === 'attribution') {
      prompt = ATTRIBUTION_PROMPT + message;
      userPrompt = '';
      extractAttribution = true;
    } else if (mode === 'category' && systemPrompt) {
      prompt = systemPrompt;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system' as const, content: prompt },
        ...(userPrompt ? [{ role: 'user' as const, content: userPrompt }] : []),
      ],
      max_tokens: 100,
      temperature: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim() || 'Unknown';

    if (extractAttribution) {
      return {
        statusCode: 200,
        body: JSON.stringify({ attribution: aiResponse }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to get response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler }; 