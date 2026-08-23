const BRAND_COLOR = '#3b82f6';
const DARK_BG = '#0f172a';
const CARD_BG = '#1e293b';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const BORDER_COLOR = '#334155';

const statusConfig: Record<string, { emoji: string; title: string; color: string; message: string }> = {
  CREATED: {
    emoji: '📦',
    title: 'Order Placed Successfully!',
    color: '#3b82f6',
    message: 'Your order has been received and is being processed. We\'ll notify you as soon as a driver is assigned.',
  },
  ASSIGNED: {
    emoji: '🚀',
    title: 'Driver Assigned!',
    color: '#8b5cf6',
    message: 'Great news! A delivery driver has been assigned to your order and will pick it up shortly.',
  },
  IN_TRANSIT: {
    emoji: '🚚',
    title: 'Your Package is On Its Way!',
    color: '#f59e0b',
    message: 'Your package has been picked up and is now in transit to the delivery address.',
  },
  OUT_FOR_DELIVERY: {
    emoji: '📍',
    title: 'Out for Delivery Today!',
    color: '#f97316',
    message: 'Your package is out for delivery and will arrive at your doorstep today. Please be available to receive it!',
  },
  DELIVERED: {
    emoji: '✅',
    title: 'Package Delivered!',
    color: '#10b981',
    message: 'Your package has been successfully delivered. Thank you for choosing LastMile! We hope to serve you again.',
  },
  FAILED: {
    emoji: '⚠️',
    title: 'Delivery Unsuccessful',
    color: '#ef4444',
    message: 'We were unable to complete your delivery. You can reschedule your delivery from your dashboard.',
  },
  RESCHEDULED: {
    emoji: '📅',
    title: 'Delivery Rescheduled',
    color: '#06b6d4',
    message: 'Your delivery has been rescheduled. We\'ll attempt delivery on your new selected date.',
  },
};

export function buildEmailHtml(opts: {
  customerName: string;
  orderNumber: string;
  orderId: string;
  eventType: string;
  frontendUrl: string;
}): { subject: string; html: string; text: string } {
  const config = statusConfig[opts.eventType] ?? {
    emoji: '🔔',
    title: `Order Update: ${opts.eventType}`,
    color: BRAND_COLOR,
    message: `Your order ${opts.orderNumber} has been updated to status: ${opts.eventType}.`,
  };

  const trackingUrl = `${opts.frontendUrl}/orders/${opts.orderId}`;

  const subject = `${config.emoji} ${config.title} — ${opts.orderNumber}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${DARK_BG};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${DARK_BG};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header / Brand -->
          <tr>
            <td style="padding:0 0 28px 0;text-align:center;">
              <span style="font-size:26px;font-weight:800;color:${BRAND_COLOR};letter-spacing:-0.5px;">🚚 LastMile</span>
              <p style="margin:4px 0 0;font-size:13px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:1px;">Delivery Command Center</p>
            </td>
          </tr>

          <!-- Status Card -->
          <tr>
            <td style="background-color:${CARD_BG};border-radius:16px;border:1px solid ${BORDER_COLOR};overflow:hidden;">
              
              <!-- Coloured Top Bar -->
              <div style="background:linear-gradient(90deg,${config.color}33,${config.color}11);border-bottom:2px solid ${config.color};padding:28px 36px;text-align:center;">
                <div style="font-size:52px;margin-bottom:12px;">${config.emoji}</div>
                <h1 style="margin:0;font-size:24px;font-weight:700;color:${TEXT_PRIMARY};">${config.title}</h1>
              </div>

              <!-- Body -->
              <div style="padding:32px 36px;">
                <p style="margin:0 0 8px;font-size:15px;color:${TEXT_SECONDARY};">Hello, <strong style="color:${TEXT_PRIMARY};">${opts.customerName}</strong></p>
                <p style="margin:0 0 28px;font-size:15px;color:${TEXT_SECONDARY};line-height:1.7;">${config.message}</p>

                <!-- Order Details Badge -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK_BG};border:1px solid ${BORDER_COLOR};border-radius:10px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:16px 20px;border-right:1px solid ${BORDER_COLOR};">
                      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${TEXT_SECONDARY};font-weight:600;">Order Number</p>
                      <p style="margin:6px 0 0;font-size:18px;font-weight:800;color:${BRAND_COLOR};">${opts.orderNumber}</p>
                    </td>
                    <td style="padding:16px 20px;">
                      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${TEXT_SECONDARY};font-weight:600;">Status</p>
                      <p style="margin:6px 0 0;font-size:18px;font-weight:800;color:${config.color};">${opts.eventType.replace(/_/g, ' ')}</p>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${trackingUrl}" target="_blank"
                        style="display:inline-block;padding:14px 36px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                        Track Your Order →
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:${TEXT_SECONDARY};line-height:1.6;">
                You received this email because you placed an order with LastMile.<br/>
                Questions? Reply to this email or visit <a href="${opts.frontendUrl}" style="color:${BRAND_COLOR};text-decoration:none;">${opts.frontendUrl}</a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#475569;">© ${new Date().getFullYear()} LastMile Delivery. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${config.title}\n\nHello ${opts.customerName},\n\n${config.message}\n\nOrder Number: ${opts.orderNumber}\nStatus: ${opts.eventType}\n\nTrack your order: ${trackingUrl}\n\n— LastMile Delivery Team`;

  return { subject, html, text };
}
