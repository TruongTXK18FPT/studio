export const runtime = 'edge';

// WebSocket handler using WebSocketPair (Edge Runtime)
export async function GET() {
  const GlobalWP = (globalThis as any).WebSocketPair;
  if (!GlobalWP) {
    return new Response('WebSocket not supported in this environment', { status: 400 });
  }

  const pair = new GlobalWP();
  const client: WebSocket = pair[0];
  const server: WebSocket = pair[1];

  (server as any).accept();

  server.addEventListener('message', (event: MessageEvent) => {
    try {
      const data = typeof event.data === 'string' ? event.data : '';
      const parsed = data ? JSON.parse(data) : null;
      server.send(JSON.stringify({ type: 'ACK', payload: parsed }));
    } catch {
      server.send(JSON.stringify({ type: 'ERROR', payload: { message: 'Invalid message' } }));
    }
  });

  server.addEventListener('close', () => {
    // no-op
  });

  return new Response(null, { status: 101, webSocket: client } as any);
}



