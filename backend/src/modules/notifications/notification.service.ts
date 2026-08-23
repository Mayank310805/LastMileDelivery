import prisma from '../../config/database';
import { env } from '../../config/env';
import { emailProvider } from './providers/email.provider';
import { mockSmsProvider } from './providers/mock-sms.provider';
import { buildEmailHtml } from './email-templates';

interface NotificationTask {
  notificationId: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  channel: 'EMAIL' | 'SMS';
  retryCount: number;
}

const queue: NotificationTask[] = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  while (queue.length > 0) {
    const task = queue.shift();
    if (!task) continue;

    try {
      if (task.channel === 'EMAIL') {
        await emailProvider(task.to, task.subject, task.text, task.html);
      } else {
        await mockSmsProvider(task.to, task.text);
      }

      await prisma.notification.update({
        where: { id: task.notificationId },
        data: { status: 'SENT', sentAt: new Date() }
      });
    } catch (err: any) {
      task.retryCount++;
      if (task.retryCount <= 3) {
        const backoffMs = Math.pow(5, task.retryCount - 1) * 1000;
        console.error(`[Notification] Failed to send ${task.channel} to ${task.to}. Retrying in ${backoffMs}ms (Attempt ${task.retryCount}/3)`);
        
        await prisma.notification.update({
          where: { id: task.notificationId },
          data: { retryCount: task.retryCount, providerResponse: err.message }
        });

        setTimeout(() => {
          queue.push(task);
          processQueue();
        }, backoffMs);
      } else {
        console.error(`[Notification] Exhausted retries for ${task.channel} to ${task.to}`);
        await prisma.notification.update({
          where: { id: task.notificationId },
          data: { status: 'FAILED', providerResponse: err.message }
        });
      }
    }
  }

  isProcessing = false;
};

export const sendNotification = async (
  userId: string,
  orderId: string,
  eventType: string,
  data?: { orderNumber?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  // Resolve order number if not provided
  let orderNumber = data?.orderNumber;
  if (!orderNumber) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { orderNumber: true } });
    orderNumber = order?.orderNumber ?? orderId;
  }

  // Build rich HTML email
  const { subject, html, text } = buildEmailHtml({
    customerName: user.name,
    orderNumber,
    orderId,
    eventType,
    frontendUrl: env.FRONTEND_URL,
  });

  // Enqueue Email
  const emailNotif = await prisma.notification.create({
    data: {
      userId,
      orderId,
      eventType,
      channel: 'EMAIL',
      message: text,
      status: 'PENDING',
      recipient: user.email,
      subject,
    }
  });

  queue.push({
    notificationId: emailNotif.id,
    to: user.email,
    subject,
    text,
    html,
    channel: 'EMAIL',
    retryCount: 0,
  });

  // Enqueue SMS (plain text only)
  if (user.phone) {
    const smsNotif = await prisma.notification.create({
      data: {
        userId,
        orderId,
        eventType,
        channel: 'SMS',
        message: text,
        status: 'PENDING',
        recipient: user.phone,
      }
    });
    queue.push({ notificationId: smsNotif.id, to: user.phone, subject, text, channel: 'SMS', retryCount: 0 });
  }

  // Start processing in the background
  processQueue().catch(console.error);
};
