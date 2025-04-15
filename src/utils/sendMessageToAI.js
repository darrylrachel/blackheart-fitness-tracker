// sendMessageToAI.js
import { supabase } from '../utils/supabase';

export async function sendMessageToAI({ user_id, prompt, onMessage, model = 'gpt-3.5-turbo' }) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are Smart Coach, a helpful, motivating personal trainer. You guide users on workouts, nutrition, recovery, and lifestyle.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API failed');
  }

  const reader = response.body.getReader();
  let fullMessage = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data: '));

    for (const line of lines) {
      const jsonStr = line.replace(/^data: /, '');
      if (jsonStr === '[DONE]') return;

      try {
        const parsed = JSON.parse(jsonStr);
        const token = parsed.choices[0]?.delta?.content || '';
        fullMessage += token;
        onMessage(token);
      } catch (err) {
        console.error('Error parsing stream chunk', err);
      }
    }
  }

  // Log usage
  await supabase.from('ai_usage').insert({ user_id });

  return fullMessage;
}
