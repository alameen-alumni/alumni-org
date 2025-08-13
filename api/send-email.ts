// Vercel serverless function to send transactional emails via Resend
// Set RESEND_API_KEY in your Vercel project environment variables

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Support both parsed and raw bodies
    let parsedBody: any = req.body;
    if (!parsedBody) {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve());
        req.on('error', (err: any) => reject(err));
      });
      const raw = Buffer.concat(chunks).toString('utf8');
      parsedBody = raw ? JSON.parse(raw) : {};
    }

    const { to, subject, html, from } = parsedBody || {};
    console.log('[send-email] Incoming request', {
      to,
      subject,
      hasHtml: Boolean(html && String(html).length > 0),
    });

    if (!to || !subject || !html) {
      res.status(400).json({ error: 'Missing required fields: to, subject, html' });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('[send-email] RESEND_API_KEY not configured');
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
        from: from || process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn('[send-email] Resend API non-OK', {
        status: response.status,
        data,
      });
      res.status(response.status).json({ error: data?.message || 'Failed to send email' });
      return;
    }

    console.log('[send-email] Resend API success', {
      status: response.status,
      id: data?.id,
    });
    res.status(200).json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('[send-email] Email send failed:', err);
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}


