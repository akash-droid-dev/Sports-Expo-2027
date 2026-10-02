// R-4X answers for questions the built-in topics don't cover.
// The browser calls this through window.claude.complete (see src/components/ClientInit.tsx).
// Set ANTHROPIC_API_KEY on the server to enable it; without credentials it returns 503
// and the guide falls back to its built-in reply.
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const MAX_PROMPT_CHARS = 12000;
const SYSTEM =
  'You are R-4X, the expo guide for India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. ' +
  'Only answer questions about the Expo, its venue, exhibitors, programme and travel. ' +
  'Reply in at most 3 short sentences of plain text, no markdown.';

let client: Anthropic | null = null;

export async function POST(req: Request) {
  let prompt: unknown;
  try {
    ({ prompt } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return Response.json({ error: 'prompt is too long' }, { status: 413 });
  }
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json({ error: 'AI answers are not configured' }, { status: 503 });
  }

  client ??= new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 2000,
      output_config: { effort: 'low' },
      // If the model declines, the API retries on a fallback model in the same call.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });
    if (response.stop_reason === 'refusal') {
      return Response.json({ error: 'No answer available' }, { status: 422 });
    }
    const text = response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('')
      .trim();
    if (!text) return Response.json({ error: 'Empty answer' }, { status: 502 });
    return Response.json({ text });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'Busy, try again shortly' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error('[r4x] Claude API error', error.status, error.message);
      return Response.json({ error: 'AI answer failed' }, { status: 502 });
    }
    console.error('[r4x] unexpected error', error);
    return Response.json({ error: 'AI answer failed' }, { status: 500 });
  }
}
