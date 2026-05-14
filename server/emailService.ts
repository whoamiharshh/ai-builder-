import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface OrderData {
  plan: string;
  amount: number;
  period: string;
  startDate: Date;
  endDate: Date;
}

interface PaymentFailedData {
  reason: string;
  retryDate?: Date;
}

export async function sendOrderConfirmation(email: string, orderData: OrderData) {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@syntheticai.com',
      subject: `🎉 Welcome to SyntheticAI - ${orderData.plan} Plan`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #000d24 0%, #1a2a4a 100%); color: #fff; padding: 30px; border-radius: 8px; }
              .plan-box { background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0; }
              .button { background: #00d9ff; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 10px 0; }
              .footer { color: #666; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to SyntheticAI!</h1>
                <p>Your subscription is now active and ready to use.</p>
              </div>

              <h2>Order Details</h2>
              <div class="plan-box">
                <p><strong>Plan:</strong> ${orderData.plan}</p>
                <p><strong>Amount:</strong> $${(orderData.amount / 100).toFixed(2)}</p>
                <p><strong>Billing Cycle:</strong> ${orderData.period}</p>
                <p><strong>Period Start:</strong> ${orderData.startDate.toLocaleDateString()}</p>
                <p><strong>Period End:</strong> ${orderData.endDate.toLocaleDateString()}</p>
              </div>

              <h2>What's Next?</h2>
              <p>You can now:</p>
              <ul>
                <li>✨ Generate AI product concepts</li>
                <li>🎨 Create stunning product renders</li>
                <li>📄 Export as PDF or DOCX</li>
                <li>👥 Invite team members</li>
              </ul>

              <a href="https://syntheticai.com/dashboard" class="button">Go to Dashboard</a>

              <div class="footer">
                <p>Questions? Contact us at support@syntheticai.com</p>
                <p>&copy; 2026 SyntheticAI. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Order confirmation sent to ${email}`);
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
  }
}

export async function sendPaymentFailed(email: string, data: PaymentFailedData) {
  try {
    const retryText = data.retryDate
      ? `We'll automatically retry on ${data.retryDate.toLocaleDateString()}.`
      : 'Please update your payment method to avoid service interruption.';

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@syntheticai.com',
      subject: '⚠️ Payment Failed - Action Required',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; }
              .button { background: #ff6b6b; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 10px 0; }
              .footer { color: #666; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>⚠️ Payment Issue</h1>

              <div class="alert">
                <p><strong>Reason:</strong> ${data.reason}</p>
              </div>

              <p>We had trouble processing your payment. ${retryText}</p>

              <p>To update your payment method:</p>
              <a href="https://syntheticai.com/account/billing" class="button">Update Payment Method</a>

              <p>If you have questions, please contact us at support@syntheticai.com</p>

              <div class="footer">
                <p>&copy; 2026 SyntheticAI. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`⚠️ Payment failed notification sent to ${email}`);
  } catch (error) {
    console.error('Failed to send payment failed notification:', error);
  }
}

export async function sendSubscriptionCanceled(email: string) {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@syntheticai.com',
      subject: '📭 Your SyntheticAI Subscription Has Been Canceled',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { background: #00d9ff; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 10px 0; }
              .footer { color: #666; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📭 Subscription Canceled</h1>
              <p>We're sorry to see you go. Your SyntheticAI subscription has been canceled.</p>

              <p>You still have access to your account and past projects. If you change your mind:</p>
              <a href="https://syntheticai.com/pricing" class="button">Reactivate Subscription</a>

              <p>We'd love to hear feedback on how we can improve:</p>
              <p><a href="mailto:feedback@syntheticai.com">Send Feedback</a></p>

              <div class="footer">
                <p>&copy; 2026 SyntheticAI. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`📭 Subscription canceled notification sent to ${email}`);
  } catch (error) {
    console.error('Failed to send subscription canceled notification:', error);
  }
}

export async function sendInvoice(email: string, invoiceUrl: string, amount: number) {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@syntheticai.com',
      subject: '📄 Your SyntheticAI Invoice',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { background: #00d9ff; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 10px 0; }
              .footer { color: #666; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📄 Invoice</h1>
              <p>Thank you for your payment!</p>

              <p><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

              <a href="${invoiceUrl}" class="button">Download Invoice</a>

              <div class="footer">
                <p>&copy; 2026 SyntheticAI. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`📄 Invoice sent to ${email}`);
  } catch (error) {
    console.error('Failed to send invoice:', error);
  }
}
