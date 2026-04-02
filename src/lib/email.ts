import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryEmail(name: string, phone: string, message: string) {
  try {
    const data = await resend.emails.send({
      from: 'Green Seeds Agro <inquiry@greenseedsagro.in>',
      to: [process.env.ADMIN_EMAIL || 'admin@example.com'],
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Contact Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
          ${message}
        </div>
        <hr />
        <p>This inquiry has been logged in the dashboard.</p>
      `,
    });
    return data;
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
}
