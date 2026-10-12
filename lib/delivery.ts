// Server-only: delivers one board or card, as the scheduled-delivery cron
// does and as the admin "Send now" does.
import { render } from '@react-email/render';
import type { Resend } from 'resend';
import DeliveryEmail from '@/emails/DeliveryEmail';
import ContributorNotificationEmail from '@/emails/ContributorNotificationEmail';
import { EMAIL_FROM, summarizeSendResults } from '@/lib/email';
import { sendLogged, type EmailTrigger } from '@/lib/emailLog';
import { supabaseAdmin } from '@/lib/serverAuth';

// The columns deliverBoard reads; load with select(DELIVERY_SELECT).
export const DELIVERY_SELECT = '*, recipients(*), contributors(*)';

export interface DeliverableBoard {
  id: string;
  title: string;
  short_id: string;
  format_type: 'board' | 'card' | null;
  recipient_message: string | null;
  notify_contributors: boolean | null;
  recipients: { name: string; email: string | null }[];
  contributors: { email: string | null }[] | null;
}

export type DeliveryResult =
  | { success: true; recipientEmailsSent: number; contributorEmailsSent: number }
  | { success: false; error: string };

// Emails the recipients, then (if enabled) the contributors, then marks the
// board DELIVERED. If every recipient email fails, nothing is marked and no
// contributor is told, so a later run can retry.
export async function deliverBoard(
  resend: Resend,
  board: DeliverableBoard,
  trigger: EmailTrigger
): Promise<DeliveryResult> {
  const recipientNames = board.recipients.map(r => r.name);
  const formatType = board.format_type || 'board';
  const boardLink = `cardora.cards/${formatType === 'card' ? 'cards' : 'boards'}/${board.short_id}/view`;

  const recipientEmails = board.recipients
    .map(r => r.email)
    .filter((email): email is string => !!email && !!email.trim());

  let recipientEmailsSent = 0;

  if (recipientEmails.length > 0) {
    const recipientResults = await Promise.allSettled(
      recipientEmails.map(async email => {
        const html = await render(
          DeliveryEmail({
            recipientEmail: email,
            boardTitle: board.title,
            recipientNames,
            boardLink,
            deliveryMessage: board.recipient_message ?? undefined,
          })
        );
        return sendLogged(
          resend,
          { from: EMAIL_FROM, to: email, subject: `You have a special gift waiting for you 💝`, html },
          { kind: 'delivery', trigger, boardId: board.id }
        );
      })
    );
    const summary = summarizeSendResults(recipientResults);
    recipientEmailsSent = summary.sent;

    if (recipientEmailsSent === 0) {
      console.error(`All recipient emails failed for board ${board.id}:`, summary.errors);
      return { success: false, error: 'All recipient emails failed to send' };
    }
  }

  let contributorEmailsSent = 0;
  const contributorEmails = (board.contributors ?? [])
    .map(c => c.email)
    .filter((email): email is string => !!email && !!email.trim());

  if (board.notify_contributors && contributorEmails.length > 0) {
    const contributorResults = await Promise.allSettled(
      contributorEmails.map(async email => {
        const html = await render(
          ContributorNotificationEmail({
            contributorEmail: email,
            boardTitle: board.title,
            recipientNames,
            boardLink,
          })
        );
        return sendLogged(
          resend,
          { from: EMAIL_FROM, to: email, subject: `Your contribution to "${board.title}" has been delivered!`, html },
          { kind: 'delivered_notice', trigger, boardId: board.id }
        );
      })
    );
    contributorEmailsSent = summarizeSendResults(contributorResults).sent;
  }

  const { error } = await supabaseAdmin.from('boards').update({ status: 'DELIVERED' }).eq('id', board.id);
  if (error) {
    console.error(`Error updating board ${board.id}:`, error);
    return { success: false, error: error.message };
  }

  return { success: true, recipientEmailsSent, contributorEmailsSent };
}
