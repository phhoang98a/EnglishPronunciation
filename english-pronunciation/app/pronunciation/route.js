export async function POST(req) {
  const { sentence } = await req.json()
  const res = await fetch('http://127.0.0.1:5000/ipa', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sentence })
  });
  const data = await res.json();
  return Response.json(data)
}