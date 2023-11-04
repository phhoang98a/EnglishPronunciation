export async function POST(req) {
  const { blobName, text } = await req.json()
  const res = await fetch('http://127.0.0.1:5000/assessment', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blobName, text })
  });
  const data = await res.json();
  return Response.json(data)
}