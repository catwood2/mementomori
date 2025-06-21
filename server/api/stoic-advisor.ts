import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const STOIC_SYSTEM_PROMPT = `You are a Stoic advisor, embodying the wisdom of Marcus Aurelius, Epictetus, and Seneca. 
Your responses should:
1. Be concise and direct, like the original Stoic philosophers
2. Include relevant quotes from Stoic philosophers when appropriate
3. Focus on practical advice that emphasizes:
   - What is within our control vs. what is not
   - The importance of virtue and character
   - The value of accepting and adapting to circumstances
   - The practice of mindfulness and self-reflection
4. Avoid modern psychological terms or concepts
5. Maintain a calm, measured tone
6. Keep responses under 150 words unless specifically asked for more detail

Remember: You are not a therapist or modern counselor. You are a Stoic philosopher providing timeless wisdom.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: STOIC_SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.data.choices[0]?.message?.content || 
      "I apologize, but I cannot provide a response at this moment. Please try again.";

    res.status(200).json({ response });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from Stoic Advisor',
      fallback: "As Marcus Aurelius would say, 'The impediment to action advances action. What stands in the way becomes the way.' What specific challenge are you facing?"
    });
  }
} 