
export async function sendOTPEmail(toEmail: string, otp: string, userName: string) {
  try {
    // Vercel routes files in /api/ to /api/filename
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: toEmail, otp, name: userName })
    });
    
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to send email');
    }
    
    return { success: true };
  } catch (error) {
    console.warn('Email service unreachable or failed. Falling back to log.');
    console.log(`[VERCEL FALLBACK] OTP for ${toEmail}: ${otp}`);
    throw error;
  }
}
