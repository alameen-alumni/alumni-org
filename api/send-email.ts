// Vercel serverless function to send transactional emails via Resend
// Set RESEND_API_KEY in your Vercel project environment variables

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { to, subject, html, from } = req.body || {};

    if (!to || !subject || !html) {
      res.status(400).json({ error: 'Missing required fields: to, subject, html' });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured');
      res.status(500).json({ error: 'Email service not configured' });
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'Alumni Association <no-reply@alumni.example.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data?.message || 'Failed to send email' });
      return;
    }

    res.status(200).json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Email send failed:', err);
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}


