// Sender for all outgoing email. cardora.cards is verified in Resend, and
// hello@ forwards to the owner's inbox so replies are not lost.
export const EMAIL_FROM = 'Cardora <hello@cardora.cards>';
export const CONTACT_FORM_FROM = 'Cardora Contact Form <hello@cardora.cards>';

// Resend's emails.send() reports most failures (e.g. a 403 for an unverified
// sender) in the resolved `error` field instead of throwing, so a fulfilled
// promise alone does not mean the email was sent.
export function summarizeSendResults(
  results: PromiseSettledResult<{ error: unknown }>[]
): { sent: number; failed: number; errors: unknown[] } {
  const errors: unknown[] = [];
  let sent = 0;
  for (const result of results) {
    if (result.status === 'rejected') {
      errors.push(result.reason);
    } else if (result.value.error) {
      errors.push(result.value.error);
    } else {
      sent++;
    }
  }
  return { sent, failed: errors.length, errors };
}
