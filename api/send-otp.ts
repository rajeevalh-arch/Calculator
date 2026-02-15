
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { email, otp, name } = await req.json();
    const apiKey = process.env.SENDGRID_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!apiKey || !senderEmail) {
      return new Response(JSON.stringify({ error: 'Server configuration missing' }), { status: 500 });
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: 'Your Access Code - Execution Gap Calculator'
        }],
        from: { email: senderEmail, name: 'Traits4XL Analysis' },
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
              <h2 style="color: #4285F4; text-align: center;">Verification Code</h2>
              <p>Hello ${name},</p>
              <p>Your access code for the <strong>Hidden Cost of Execution Gaps Calculator</strong> is:</p>
              <div style="font-size: 32px; font-weight: bold; color: #202124; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f8f9fa; padding: 20px; border-radius: 12px;">${otp}</div>
              <p style="font-size: 12px; color: #666; text-align: center;">If you did not request this code, please ignore this email.</p>
            </div>
          `
        }]
      })
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: 'SendGrid failed', details: errText }), { status: 500 });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
