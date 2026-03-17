import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set - emails will not be sent");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@example.com";
const fromName = process.env.RESEND_FROM_NAME || "Vynate Market";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, replyTo, cc, bcc, attachments } = options;

  try {
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
      cc,
      bcc,
      attachments,
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  to: string,
  data: {
    customerName: string;
    orderNumber: string;
    orderDate: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: string;
  }
) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Vynate Market</h1>
      </div>
      
      <h2 style="color: #333;">Order Confirmed! 🎉</h2>
      
      <p>Hi ${data.customerName},</p>
      
      <p>Thank you for your order! We're excited to let you know that we've received your order and it's being processed.</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p style="margin: 8px 0 0;"><strong>Order Date:</strong> ${data.orderDate}</p>
      </div>
      
      <h3>Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 12px; text-align: left;">Item</th>
            <th style="padding: 12px; text-align: center;">Qty</th>
            <th style="padding: 12px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right;">Subtotal:</td>
            <td style="padding: 12px; text-align: right;">$${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right;">Shipping:</td>
            <td style="padding: 12px; text-align: right;">$${data.shipping.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right;">Tax:</td>
            <td style="padding: 12px; text-align: right;">$${data.tax.toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 1.1em;">
            <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #333;">Total:</td>
            <td style="padding: 12px; text-align: right; border-top: 2px solid #333;">$${data.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <h3>Shipping Address</h3>
      <p style="background: #f8fafc; padding: 15px; border-radius: 8px;">${data.shippingAddress}</p>
      
      <p>You'll receive another email when your order ships with tracking information.</p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">View Order</a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        If you have any questions, reply to this email or contact us at support@vynate.com
      </p>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmed - ${data.orderNumber}`,
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  data: {
    name: string;
    resetLink: string;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Vynate Market</h1>
      </div>
      
      <h2>Reset Your Password</h2>
      
      <p>Hi ${data.name},</p>
      
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.resetLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Reset Password</a>
      </div>
      
      <p>This link will expire in 1 hour for security reasons.</p>
      
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
        <a href="${data.resetLink}" style="color: #2563eb; word-break: break-all;">${data.resetLink}</a>
      </p>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Reset Your Password - Vynate Market",
    html,
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerification(
  to: string,
  data: {
    name: string;
    verifyLink: string;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Vynate Market</h1>
      </div>
      
      <h2>Welcome to Vynate Market! 🎉</h2>
      
      <p>Hi ${data.name},</p>
      
      <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.verifyLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Verify Email</a>
      </div>
      
      <p>This link will expire in 24 hours.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        If you didn't create an account with us, please ignore this email.
      </p>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Verify Your Email - Vynate Market",
    html,
  });
}

/**
 * Send vendor approval email
 */
export async function sendVendorApprovalEmail(
  to: string,
  data: {
    vendorName: string;
    storeName: string;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Vynate Market</h1>
      </div>
      
      <h2>Congratulations! Your Store is Approved! 🎉</h2>
      
      <p>Hi ${data.vendorName},</p>
      
      <p>Great news! Your vendor application for <strong>${data.storeName}</strong> has been approved.</p>
      
      <p>You can now:</p>
      <ul>
        <li>Add products from our catalog to your store</li>
        <li>Set your own prices and manage inventory</li>
        <li>Start receiving orders from customers</li>
        <li>Track your earnings and request payouts</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/vendor" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Go to Vendor Dashboard</a>
      </div>
      
      <p>If you have any questions, our support team is here to help.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        Welcome to the Vynate Market vendor community!
      </p>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Your Vendor Store is Approved! - Vynate Market",
    html,
  });
}

/**
 * Send vendor new order notification
 */
export async function sendVendorNewOrderEmail(
  to: string,
  data: {
    vendorName: string;
    orderNumber: string;
    itemsCount: number;
    total: number;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Vynate Market</h1>
      </div>
      
      <h2>New Order Received! 🛒</h2>
      
      <p>Hi ${data.vendorName},</p>
      
      <p>You have a new order to fulfill!</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p style="margin: 8px 0 0;"><strong>Items:</strong> ${data.itemsCount} item(s)</p>
        <p style="margin: 8px 0 0;"><strong>Your Earnings:</strong> $${data.total.toFixed(2)}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/vendor/orders" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">View Order Details</a>
      </div>
      
      <p>Please process and ship this order as soon as possible to maintain your seller rating.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="color: #666; font-size: 14px; text-align: center;">
        Happy selling!
      </p>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `New Order #${data.orderNumber} - Action Required`,
    html,
  });
}
