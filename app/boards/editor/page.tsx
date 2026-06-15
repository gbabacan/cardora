"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import LottieAnimation from "@/components/LottieAnimation";
import { useAuth } from "@/hooks/useAuth";
import { getBoardById, updateBoard, updateBoardRecipients, addContributors, getBoardMessageCount, getBoardContributors } from "@/lib/boards";
import { getBoardMessages } from "@/lib/messages";
import type { Board, Recipient } from "@/lib/boards";
import type { Message } from "@/lib/messages";
import Toast from "@/components/Toast";
import DeliveryConfirmationModal from "@/components/DeliveryConfirmationModal";
import DeliveryMessagePreview from "@/components/DeliveryMessagePreview";
import BackgroundSelectionPanel from "@/components/BackgroundSelectionPanel";
import EffectSelectionPanel from "@/components/EffectSelectionPanel";
import type { Background } from "@/lib/backgrounds";
import type { Effect } from "@/lib/effects";
import { getBackgroundCssValue } from "@/lib/backgrounds";
import { loadLottieAnimationData } from "@/lib/lotties";
import { loadEffectAnimationData } from "@/lib/effects";

function BoardEditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  // Get board ID from URL
  const boardId = searchParams.get('id');
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardData, setBoardData] = useState<Board | null>(null);
  const [recipientData, setRecipientData] = useState<Recipient[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Board state
  const [boardTitle, setBoardTitle] = useState('Your Board Title');
  const [recipients, setRecipients] = useState<string[]>(['Recipients']);
  const [formatType, setFormatType] = useState<'board' | 'card'>('board');
  const [occasionType, setOccasionType] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Appearance panel state
  const [showAppearance, setShowAppearance] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'customize' | 'preview'>('preview');
  const [headerColorEnabled, setHeaderColorEnabled] = useState(false);
  const [headerColorCode, setHeaderColorCode] = useState<string>('#2CB1A6');
  const [titleFont, setTitleFont] = useState('Inter');
  const [titleFontSize, setTitleFontSize] = useState<number>(48);
  const [titleFontColor, setTitleFontColor] = useState<string>('#0B1F2A');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [showTitleFontPicker, setShowTitleFontPicker] = useState(false);
  const [showBodyFontPicker, setShowBodyFontPicker] = useState(false);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);
  const [selectedLottieAnimation, setSelectedLottieAnimation] = useState<any>(null);

  // Background selection panel state
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);

  // Effect selection panel state
  const [showEffectPanel, setShowEffectPanel] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [selectedEffectAnimation, setSelectedEffectAnimation] = useState<any>(null);

  // Invite Contributors panel state
  const [showInvite, setShowInvite] = useState(false);
  const [inviteTab, setInviteTab] = useState<'link' | 'email' | 'social' | 'qr'>('link');
  const [boardLink, setBoardLink] = useState('cardora-livid.vercel.app/boards/loading');
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [inviteMessage, setInviteMessage] = useState(`Hi! I've created a group card and would love for you to contribute. Click the link below to add your message!`);

  // Settings panel state
  const [showSettings, setShowSettings] = useState(false);

  // Delivery panel state
  const [showDelivery, setShowDelivery] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState<{[key: number]: string}>({});
  const [deliveryMessage, setDeliveryMessage] = useState(`We've created something special for you! Dive into all the heartfelt messages from your friends and colleagues. Enjoy! 🎉`);
  const [notifyContributors, setNotifyContributors] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [deliveringNow, setDeliveringNow] = useState(false);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showMarkDeliveredConfirm, setShowMarkDeliveredConfirm] = useState(false);
  const [markingDelivered, setMarkingDelivered] = useState(false);

  // Delivery confirmation modal state
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);

  // Delivery message preview modal state
  const [showMessagePreview, setShowMessagePreview] = useState(false);

  // Font options
  const fonts = [
    // Serious/Professional
    { name: 'Inter', category: 'Professional' },
    { name: 'Poppins', category: 'Professional' },
    { name: 'Montserrat', category: 'Professional' },
    { name: 'Raleway', category: 'Professional' },
    { name: 'Lato', category: 'Professional' },
    { name: 'Open Sans', category: 'Professional' },
    { name: 'Roboto', category: 'Professional' },
    { name: 'Playfair Display', category: 'Professional' },
    { name: 'Merriweather', category: 'Professional' },
    { name: 'Libre Baskerville', category: 'Professional' },
    // Fun/Playful
    { name: 'Pacifico', category: 'Playful' },
    { name: 'Lobster', category: 'Playful' },
    { name: 'Fredoka One', category: 'Playful' },
    { name: 'Righteous', category: 'Playful' },
    { name: 'Secular One', category: 'Playful' },
    { name: 'Bungee', category: 'Playful' },
    { name: 'Chewy', category: 'Playful' },
    { name: 'Lilita One', category: 'Playful' },
    { name: 'Permanent Marker', category: 'Playful' },
    // Handwriting
    { name: 'Dancing Script', category: 'Handwriting' },
    { name: 'Kaushan Script', category: 'Handwriting' },
    { name: 'Satisfy', category: 'Handwriting' },
    { name: 'Cookie', category: 'Handwriting' },
    { name: 'Great Vibes', category: 'Handwriting' },
    { name: 'Allura', category: 'Handwriting' },
    { name: 'Courgette', category: 'Handwriting' },
    { name: 'Shadows Into Light', category: 'Handwriting' },
    { name: 'Caveat', category: 'Handwriting' },
    { name: 'Patrick Hand', category: 'Handwriting' },
    { name: 'Sacramento', category: 'Handwriting' },
  ];

  // Load Google Font dynamically
  const loadFont = (fontName: string) => {
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href*="${fontName.replace(/ /g, '+')}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  // Load all fonts for preview in dropdown on mount
  useEffect(() => {
    fonts.forEach(font => loadFont(font.name));
    loadLottieAnimation();
  }, []);

  // Load remote Lottie animation
  const loadLottieAnimation = async () => {
    try {
      const remoteLottieUrl = 'https://assets-v2.lottiefiles.com/a/6a0cd638-48b9-11ef-b744-db583b43c862/KzeQAnBTz3.json';
      const response = await fetch(remoteLottieUrl);
      if (response.ok) {
        const animationData = await response.json();
        setLottieAnimation(animationData);
      } else {
        console.error('Failed to load remote Lottie animation');
      }
    } catch (error) {
      console.error('Error loading Lottie animation:', error);
    }
  };

  // Load board data on mount
  useEffect(() => {
    const loadBoard = async () => {
      if (!boardId) {
        router.push('/boards/create');
        return;
      }

      const { board, recipients: loadedRecipients, error } = await getBoardById(boardId);

      if (error || !board) {
        setToast({ message: 'Error loading board: ' + (error || 'Board not found'), type: 'error' });
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      // Set board data
      setBoardData(board);
      setRecipientData(loadedRecipients);
      setBoardTitle(board.title);
      setRecipients(loadedRecipients.map(r => r.name));

      // Load background - prioritize card_background_data (occasion lottie) over background_data (page background)
      if (board.card_background_data) {
        setSelectedBackground(board.card_background_data);
      } else if (board.background_data) {
        setSelectedBackground(board.background_data);
      }

      // Load effect if exists
      if (board.effect_data) {
        setSelectedEffect(board.effect_data);
      }

      // Check if board is delivered (read-only mode)
      setIsReadOnly(board.status === 'DELIVERED');

      // Populate recipient emails from loaded data
      const emailsMap: {[key: number]: string} = {};
      loadedRecipients.forEach((recipient, index) => {
        if (recipient.email) {
          emailsMap[index] = recipient.email;
        }
      });
      setRecipientEmails(emailsMap);

      setFormatType(board.format_type);
      setOccasionType(board.occasion_type);
      setHeaderColorEnabled(board.header_color);
      setHeaderColorCode(board.header_color_code || '#2CB1A6');
      setTitleFont(board.title_font);
      setTitleFontSize(board.title_font_size || 48);
      setTitleFontColor(board.title_font_color || '#0B1F2A');
      setBodyFont(board.body_font);
      setBackgroundImage(board.background);
      setDeliveryMessage(board.recipient_message || `We've created something special for you! Dive into all the heartfelt messages from your friends and colleagues. Enjoy! 🎉`);
      setNotifyContributors(board.notify_contributors);
      if (board.scheduled_delivery) {
        const date = new Date(board.scheduled_delivery);
        const pad = (n: number) => String(n).padStart(2, '0');
        setScheduledDate(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`);
        setScheduledTime(`${pad(date.getHours())}:${pad(date.getMinutes())}`);
      }

      // Set board link using short_id (for contributors, not view-only)
      setBoardLink(`cardora-livid.vercel.app/boards/${board.short_id}`);
      setInviteMessage(`Hi! I've created a group card for ${loadedRecipients.map(r => r.name).join(', ')} and would love for you to contribute. Click the link below to add your message!`);

      // Load messages
      const { messages: loadedMessages, error: messagesError } = await getBoardMessages(board.id);
      if (!messagesError && loadedMessages) {
        setMessages(loadedMessages);
      }

      setBoardLoading(false);
    };

    if (!loading && user && boardId) {
      loadBoard();
    }
  }, [boardId, user, loading, router]);

  // Load fonts when selected
  useEffect(() => {
    loadFont(titleFont);
  }, [titleFont]);

  useEffect(() => {
    loadFont(bodyFont);
  }, [bodyFont]);

  // Load selected Lottie animation data when background changes
  useEffect(() => {
    const loadSelectedAnimation = async () => {
      if (selectedBackground?.type === 'ANIMATION' && selectedBackground.lottie_animation) {
        const animData = await loadLottieAnimationData(selectedBackground.lottie_animation as any);
        setSelectedLottieAnimation(animData);
      } else {
        setSelectedLottieAnimation(null);
      }
    };

    loadSelectedAnimation();
  }, [selectedBackground]);

  // Load selected effect animation data when effect changes
  useEffect(() => {
    const loadSelectedEffectAnimation = async () => {
      if (selectedEffect) {
        const animData = await loadEffectAnimationData(selectedEffect);
        setSelectedEffectAnimation(animData);
      } else {
        setSelectedEffectAnimation(null);
      }
    };

    loadSelectedEffectAnimation();
  }, [selectedEffect]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || boardLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-[#2CB1A6] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !boardData) {
    return null;
  }

  // Email validation regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reload messages
  const reloadMessages = async () => {
    if (!boardId) return;
    const { messages: loadedMessages, error: messagesError } = await getBoardMessages(boardId);
    if (!messagesError && loadedMessages) {
      setMessages(loadedMessages);
    }
  };

  // Handle deliver now button click - runs validations then shows confirmation
  const handleDeliverNowClick = async () => {
    if (!boardId) return;

    // Validation 1: Check if board title exists
    if (!boardTitle.trim()) {
      setToast({ message: `Please add a title to your ${formatType}`, type: 'error' });
      return;
    }

    // Validation 2: Check if there are recipients
    if (recipients.length === 0 || !recipients.some(r => r.trim())) {
      setToast({ message: 'Please add at least one recipient', type: 'error' });
      return;
    }

    // Validation 3: Check all recipients have names
    const recipientsWithoutNames = recipients.filter((name) => !name.trim());
    if (recipientsWithoutNames.length > 0) {
      setToast({ message: 'Please provide names for all recipients', type: 'error' });
      return;
    }

    // Validation 4: Check all recipients have email addresses
    const recipientsWithoutEmails = recipients.filter((_, index) => !recipientEmails[index]?.trim());
    if (recipientsWithoutEmails.length > 0) {
      setToast({ message: 'Please provide email addresses for all recipients', type: 'error' });
      return;
    }

    // Validation 5: Validate all recipient email formats
    const invalidRecipientEmails = recipients
      .map((_, index) => recipientEmails[index]?.trim())
      .filter(email => email && !isValidEmail(email));

    if (invalidRecipientEmails.length > 0) {
      setToast({
        message: `Invalid recipient email format: ${invalidRecipientEmails.join(', ')}`,
        type: 'error'
      });
      return;
    }

    // Validation 6: Check if delivery message exists
    if (!deliveryMessage.trim()) {
      setToast({ message: 'Please add a message to recipients', type: 'error' });
      return;
    }

    // Validation 7: Check if board has at least one message
    // TEMPORARILY DISABLED FOR TESTING
    // const { count: messageCount, error: countError } = await getBoardMessageCount(boardId);

    // if (countError) {
    //   setToast({ message: 'Error checking board messages: ' + countError, type: 'error' });
    //   return;
    // }

    // if (messageCount === 0) {
    //   setToast({ message: 'Board must have at least one message before delivery', type: 'error' });
    //   return;
    // }

    // All validations passed - show confirmation modal
    setShowDeliveryConfirmation(true);
  };

  // Actually deliver the board after confirmation
  const handleConfirmDelivery = async () => {
    if (!boardId) return;

    setDeliveringNow(true);

    try {
      // Determine which background field to update based on background type
      const isAnimationBackground = selectedBackground?.type === 'ANIMATION';

      // Update board status to DELIVERED
      const { error: boardError } = await updateBoard(boardId, {
        status: 'DELIVERED',
        recipient_message: deliveryMessage,
        notify_contributors: notifyContributors,
        delivery_type: 'ON_DEMAND',
        effect_id: selectedEffect?.id || undefined,
        background_id: isAnimationBackground ? undefined : (selectedBackground?.id || undefined),
        card_background_id: isAnimationBackground ? (selectedBackground?.id || undefined) : undefined
      });

      if (boardError) {
        setToast({ message: `Error delivering ${formatType}: ` + boardError, type: 'error' });
        setDeliveringNow(false);
        return;
      }

      // Update recipients with emails
      const recipientsToSave = recipients.map((name, index) => ({
        name,
        email: recipientEmails[index] || undefined
      }));

      const { error: recipientsError } = await updateBoardRecipients(boardId, recipientsToSave);

      if (recipientsError) {
        setToast({ message: 'Error saving recipients: ' + recipientsError, type: 'error' });
        setDeliveringNow(false);
        return;
      }

      // Send delivery emails to recipients
      const recipientEmailsList = recipients
        .map((name, index) => recipientEmails[index])
        .filter(email => email && email.trim());

      let recipientEmailsSent = 0;

      if (recipientEmailsList.length > 0) {
        const emailResponse = await fetch('/api/send-delivery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emails: recipientEmailsList,
            boardTitle,
            recipientNames: recipients.filter(r => r.trim()),
            boardLink: `cardora-livid.vercel.app/boards/${boardData?.short_id}/view`,
            deliveryMessage: deliveryMessage || undefined
          })
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error('Error sending delivery emails:', emailResult.error);
        } else {
          recipientEmailsSent = emailResult.sent;
        }
      }

      // Send notification emails to contributors if checkbox is checked
      let contributorEmailsSent = 0;

      if (notifyContributors) {
        const { contributors, error: contributorsError } = await getBoardContributors(boardId);

        if (!contributorsError && contributors && contributors.length > 0) {
          // Filter contributors with emails
          const contributorEmailsList = contributors
            .map(c => c.email)
            .filter(email => email && email.trim()) as string[];

          if (contributorEmailsList.length > 0) {
            const contributorResponse = await fetch('/api/send-contributor-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                emails: contributorEmailsList,
                boardTitle,
                recipientNames: recipients.filter(r => r.trim()),
                boardLink: boardLink
              })
            });

            const contributorResult = await contributorResponse.json();

            if (!contributorResponse.ok) {
              console.error('Error sending contributor notifications:', contributorResult.error);
            } else {
              contributorEmailsSent = contributorResult.sent;
            }
          }
        }
      }

      // Show success message
      const formatName = formatType === 'board' ? 'Board' : 'Card';
      let successMessage = `${formatName} delivered successfully!`;
      if (recipientEmailsSent > 0 && contributorEmailsSent > 0) {
        successMessage = `${formatName} delivered! ${recipientEmailsSent} recipient(s) and ${contributorEmailsSent} contributor(s) notified. 🎉`;
      } else if (recipientEmailsSent > 0) {
        successMessage = `${formatName} delivered! ${recipientEmailsSent} recipient(s) notified. 🎉`;
      } else if (contributorEmailsSent > 0) {
        successMessage = `${formatName} delivered! ${contributorEmailsSent} contributor(s) notified. 🎉`;
      } else {
        successMessage = `${formatName} delivered successfully! 🎉`;
      }

      setToast({
        message: successMessage,
        type: 'success'
      });

      setDeliveringNow(false);
      setShowDeliveryConfirmation(false);
      setIsReadOnly(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      setToast({ message: `Error delivering ${formatType}: ` + error.message, type: 'error' });
      setDeliveringNow(false);
      setShowDeliveryConfirmation(false);
    }
  };

  // Handle sending invites
  const handleSendInvites = async () => {
    if (!boardId || !boardData) return;

    // Filter out empty emails
    const trimmedEmails = inviteEmails.map(email => email.trim()).filter(email => email);

    if (trimmedEmails.length === 0) {
      setToast({ message: 'Please enter at least one email address', type: 'error' });
      return;
    }

    // Validate email formats
    const invalidEmails = trimmedEmails.filter(email => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      setToast({
        message: `Invalid email format: ${invalidEmails.join(', ')}`,
        type: 'error'
      });
      return;
    }

    setSendingInvites(true);

    try {
      // Step 1: Save contributors to database
      const { contributors, error: dbError } = await addContributors(boardId, trimmedEmails);

      if (dbError) {
        setToast({ message: 'Error saving invites: ' + dbError, type: 'error' });
        setSendingInvites(false);
        return;
      }

      // Step 2: Send email invitations
      const emailResponse = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: trimmedEmails,
          boardTitle: boardTitle,
          recipientNames: recipients.filter(r => r.trim()),
          boardLink: boardLink,
          customMessage: inviteMessage,
          creatorName: user?.user_metadata?.name || user?.email || 'Someone',
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        setToast({
          message: `Contributors saved, but failed to send emails: ${emailResult.error}`,
          type: 'error'
        });
        setSendingInvites(false);
        return;
      }

      setToast({
        message: `Successfully sent ${emailResult.sent} invite email${emailResult.sent > 1 ? 's' : ''}! 📧`,
        type: 'success'
      });

      // Clear the email fields
      setInviteEmails(['']);
      setSendingInvites(false);
    } catch (error: any) {
      setToast({ message: 'Error sending invites: ' + error.message, type: 'error' });
      setSendingInvites(false);
    }
  };

  // Mark as delivered handler
  const handleMarkAsDelivered = async () => {
    if (!boardId) return;

    setMarkingDelivered(true);

    try {
      const { error } = await updateBoard(boardId, {
        status: 'DELIVERED'
      });

      if (error) {
        setToast({ message: `Error marking ${formatType} as delivered: ` + error, type: 'error' });
      } else {
        setToast({ message: `${formatType === 'board' ? 'Board' : 'Card'} marked as delivered!`, type: 'success' });
        setShowMarkDeliveredConfirm(false);

        // Reload the page to reflect read-only state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      setToast({ message: 'Error: ' + error.message, type: 'error' });
    } finally {
      setMarkingDelivered(false);
    }
  };

  // Save board handler
  const handleSaveBoard = async () => {
    if (!boardId) return;

    // Validate scheduled delivery date is in the future
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
      if (scheduledDateTime <= new Date()) {
        setToast({ message: 'Scheduled delivery date and time must be in the future', type: 'error' });
        return;
      }

      // Validate all recipients have emails when scheduling
      const recipientsWithoutEmails = recipients.filter((_, index) => !recipientEmails[index]?.trim());
      if (recipientsWithoutEmails.length > 0) {
        setToast({ message: 'All recipients must have email addresses for scheduled delivery', type: 'error' });
        return;
      }
    }

    setSaving(true);

    try {
      // Determine which background field to update based on background type
      const isAnimationBackground = selectedBackground?.type === 'ANIMATION';

      // Update board
      const { error: boardError } = await updateBoard(boardId, {
        title: boardTitle,
        header_color: headerColorEnabled,
        header_color_code: headerColorEnabled ? headerColorCode : undefined,
        title_font: titleFont,
        title_font_size: titleFontSize,
        title_font_color: titleFontColor,
        body_font: bodyFont,
        intro_animation: true,
        effect_id: selectedEffect?.id || undefined,
        background: backgroundImage,
        background_id: isAnimationBackground ? undefined : (selectedBackground?.id || undefined),
        card_background_id: isAnimationBackground ? (selectedBackground?.id || undefined) : undefined,
        recipient_message: deliveryMessage,
        notify_contributors: notifyContributors,
        delivery_type: scheduledDate && scheduledTime ? 'SCHEDULED' : 'ON_DEMAND',
        scheduled_delivery: scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString()
          : undefined,
        status: 'PUBLISHED'
      });

      if (boardError) {
        setToast({ message: `Error saving ${formatType}: ` + boardError, type: 'error' });
        setSaving(false);
        return;
      }

      // Update recipients
      const recipientsToSave = recipients.map((name, index) => ({
        name,
        email: recipientEmails[index] || undefined
      }));

      const { error: recipientsError } = await updateBoardRecipients(boardId, recipientsToSave);

      if (recipientsError) {
        setToast({ message: 'Error saving recipients: ' + recipientsError, type: 'error' });
        setSaving(false);
        return;
      }

      // Reload messages after save
      await reloadMessages();

      setToast({ message: `${formatType === 'board' ? 'Board' : 'Card'} saved and published successfully! 🎉`, type: 'success' });
      setSaving(false);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      setToast({ message: `Error saving ${formatType}: ` + error.message, type: 'error' });
      setSaving(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delivery Confirmation Modal */}
      <DeliveryConfirmationModal
        isOpen={showDeliveryConfirmation}
        onCancel={() => setShowDeliveryConfirmation(false)}
        onConfirm={handleConfirmDelivery}
        recipientCount={recipients.filter(r => r.trim()).length}
        isDelivering={deliveringNow}
        formatType={formatType}
      />

      {/* Delivery Message Preview Modal */}
      <DeliveryMessagePreview
        isOpen={showMessagePreview}
        onClose={() => setShowMessagePreview(false)}
        boardTitle={boardTitle}
        recipientNames={recipients.filter(r => r.trim())}
        deliveryMessage={deliveryMessage}
        boardLink={`cardora-livid.vercel.app/boards/${boardData?.short_id}/view`}
      />

      <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5EAF0] px-3 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0 gap-2">
        {/* Left side */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/dashboard" className="flex-shrink-0">
            <Image
              src="/cardoraLogo.png"
              alt="Cardora"
              width={120}
              height={32}
              className="h-7 md:h-8 w-auto"
            />
          </Link>
          <div className="hidden sm:block h-6 w-px bg-[#E5EAF0] flex-shrink-0" />
          <span className="hidden sm:block text-sm text-[#5B6B75] truncate max-w-[120px] md:max-w-none">
            {isReadOnly ? 'Viewing' : 'Editing'}: <span className="font-medium text-[#0B1F2A]">{boardTitle}</span>
          </span>
          {recipients.length > 0 && (
            <span className="hidden md:block text-sm text-[#5B6B75] truncate max-w-[120px]">
              For: <span className="font-medium text-[#0B1F2A]">{recipients.join(', ')}</span>
            </span>
          )}
          {isReadOnly && (
            <span className="px-2 py-1 bg-[#FFF4E6] text-[#92400E] text-xs font-semibold rounded-full border border-[#F59E0B] flex-shrink-0">
              <span className="hidden sm:inline">DELIVERED - </span>READ ONLY
            </span>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
          <Link href="/dashboard">
            <button className="flex items-center gap-1 px-2 md:px-4 py-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium" title={isReadOnly ? 'Back to Dashboard' : 'Cancel'}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden md:inline">{isReadOnly ? 'Back to Dashboard' : 'Cancel'}</span>
            </button>
          </Link>
          {!isReadOnly && (
            <>
              {/* View as Contributor — icon only on mobile */}
              <Link href={`/boards/${boardData?.short_id}`} target="_blank">
                <button className="p-2 md:px-4 md:py-2 border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] rounded-lg font-medium transition-colors flex items-center gap-2" title="View as Contributor">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <span className="hidden md:inline">View as Contributor</span>
                </button>
              </Link>
              {/* View as Recipient — icon only on mobile */}
              <Link href={`/boards/${boardData?.short_id}/view`} target="_blank">
                <button className="p-2 md:px-4 md:py-2 border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] rounded-lg font-medium transition-colors flex items-center gap-2" title="View as Recipient">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="hidden md:inline">View as Recipient</span>
                </button>
              </Link>
              {/* Save button */}
              <button
                onClick={handleSaveBoard}
                disabled={saving}
                className="px-3 md:px-6 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {saving ? 'Saving...' : <><span className="hidden md:inline">Save & Publish</span><span className="md:hidden">Save</span></>}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile sub-row: board title + recipients */}
      <div className="sm:hidden bg-white border-b border-[#E5EAF0] px-4 py-1.5 flex items-center justify-between gap-2 text-xs text-[#5B6B75] flex-shrink-0">
        <span className="truncate">
          {isReadOnly ? 'Viewing' : 'Editing'}: <span className="font-medium text-[#0B1F2A]">{boardTitle}</span>
        </span>
        {recipients.length > 0 && (
          <span className="truncate text-right">
            For: <span className="font-medium text-[#0B1F2A]">{recipients.join(', ')}</span>
          </span>
        )}
      </div>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b border-[#E5EAF0] bg-white flex-shrink-0">
        <button
          onClick={() => setMobilePanel('customize')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            mobilePanel === 'customize'
              ? 'text-[#2CB1A6] border-b-2 border-[#2CB1A6]'
              : 'text-[#5B6B75]'
          }`}
        >
          Customize
        </button>
        <button
          onClick={() => setMobilePanel('preview')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            mobilePanel === 'preview'
              ? 'text-[#2CB1A6] border-b-2 border-[#2CB1A6]'
              : 'text-[#5B6B75]'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - 30% - Utilities */}
        <div className={`${mobilePanel === 'customize' ? 'flex' : 'hidden'} md:flex w-full md:w-[30%] bg-white border-r border-[#E5EAF0] overflow-y-auto flex-shrink-0 flex-col`}>
          {/* Utilities Header */}
          <div className="p-6 border-b border-[#E5EAF0]">
            <h3 className="text-xl font-bold text-[#0B1F2A]">
              {isReadOnly ? 'Board Details' : `Customize Your ${formatType === 'board' ? 'Board' : 'Card'}`}
            </h3>
            <p className="text-sm text-[#5B6B75] mt-1">
              {isReadOnly
                ? 'This board has been delivered and is now read-only'
                : `Use the tools below to personalize your ${formatType}`
              }
            </p>
          </div>

          {/* Appearance Section */}
          <div className="border-b border-[#E5EAF0]">
            <button
              onClick={() => {
                if (isReadOnly) return;
                setShowAppearance(!showAppearance);
                if (!showAppearance) {
                  setShowInvite(false);
                  setShowDelivery(false);
                  setShowSettings(false);
                }
              }}
              disabled={isReadOnly}
              className={`w-full p-6 text-left transition-colors ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#F7FAFC]'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5F4] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1F2A]">Appearance</h4>
                    <p className="text-sm text-[#5B6B75]">Customize look & feel</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-[#5B6B75] flex-shrink-0 transition-transform ${showAppearance ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Expanded Appearance Panel */}
            {showAppearance && (
              <div className="bg-[#F7FAFC] p-6 space-y-6">
                {/* Background */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-[#0B1F2A]">Background</label>
                    {selectedBackground && (
                      <span className="px-3 py-1 bg-[#E8F5F4] text-[#2CB1A6] text-xs font-semibold rounded-full border border-[#A7E8E2]">
                        {selectedBackground.type}
                      </span>
                    )}
                  </div>
                  <div className="relative bg-white rounded-lg overflow-hidden border-2 border-[#E5EAF0]">
                    {/* Preview */}
                    <div
                      className="h-48 relative rounded-lg overflow-hidden"
                      style={
                        selectedBackground
                          ? {
                              ...(selectedBackground.type === 'SOLID' && selectedBackground.color
                                ? { backgroundColor: selectedBackground.color }
                                : selectedBackground.type === 'PATTERN' && selectedBackground.pattern?.file_path
                                ? {
                                    backgroundImage: `url(${selectedBackground.pattern.file_path})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                  }
                                : {})
                            }
                          : {
                              backgroundImage: `
                                repeating-linear-gradient(
                                  45deg,
                                  transparent,
                                  transparent 35px,
                                  rgba(44, 177, 166, 0.03) 35px,
                                  rgba(44, 177, 166, 0.03) 70px
                                ),
                                repeating-linear-gradient(
                                  -45deg,
                                  transparent,
                                  transparent 35px,
                                  rgba(167, 232, 226, 0.03) 35px,
                                  rgba(167, 232, 226, 0.03) 70px
                                ),
                                linear-gradient(to bottom, #ffffff, #fafcfc)
                              `
                            }
                      }
                    >
                      {/* Lottie Animation Preview */}
                      {selectedBackground?.type === 'ANIMATION' && selectedLottieAnimation && (
                        <div className="absolute inset-0">
                          <LottieAnimation
                            animationData={selectedLottieAnimation}
                            loop={true}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      )}
                      <button
                        onClick={() => setShowBackgroundPanel(true)}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-[#5B6B75] hover:bg-[#0B1F2A] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Header Color */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-[#0B1F2A]">Header color</label>
                    <button
                      onClick={() => setHeaderColorEnabled(!headerColorEnabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        headerColorEnabled ? 'bg-[#2CB1A6]' : 'bg-[#E5EAF0]'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        headerColorEnabled ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  {/* Show color pickers when header color is enabled */}
                  {headerColorEnabled && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {/* Header Background Color */}
                      <div>
                        <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Header Color</label>
                        <input
                          type="color"
                          value={headerColorCode}
                          onChange={(e) => setHeaderColorCode(e.target.value)}
                          className="w-full h-10 rounded border-2 border-[#E5EAF0] cursor-pointer"
                        />
                      </div>

                      {/* Title Font Size */}
                      <div>
                        <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Title Size (px)</label>
                        <input
                          type="number"
                          min="8"
                          max="128"
                          value={titleFontSize}
                          onChange={(e) => setTitleFontSize(parseInt(e.target.value) || 48)}
                          className="w-full px-3 py-2 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none text-sm"
                        />
                      </div>

                      {/* Title Font Color */}
                      <div>
                        <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Title Color</label>
                        <input
                          type="color"
                          value={titleFontColor}
                          onChange={(e) => setTitleFontColor(e.target.value)}
                          className="w-full h-10 rounded border-2 border-[#E5EAF0] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title Size and Color - Show when header color is disabled */}
                {!headerColorEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Title Font Size */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Title Size (px)</label>
                      <input
                        type="number"
                        min="8"
                        max="128"
                        value={titleFontSize}
                        onChange={(e) => setTitleFontSize(parseInt(e.target.value) || 48)}
                        className="w-full px-3 py-2 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none text-sm"
                      />
                    </div>

                    {/* Title Font Color */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Title Color</label>
                      <input
                        type="color"
                        value={titleFontColor}
                        onChange={(e) => setTitleFontColor(e.target.value)}
                        className="w-full h-10 rounded border-2 border-[#E5EAF0] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Title Font */}
                <div className="relative">
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Title font</label>
                  <button
                    onClick={() => setShowTitleFontPicker(!showTitleFontPicker)}
                    className="w-full bg-white border-2 border-[#E5EAF0] rounded-lg p-4 flex items-center justify-between hover:border-[#2CB1A6] transition-colors"
                  >
                    <span className="text-[#5B6B75] font-medium">{titleFont}</span>
                    <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Font Picker Dropdown */}
                  {showTitleFontPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#E5EAF0] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                      {/* Professional Fonts */}
                      <div className="p-3 bg-[#F7FAFC] border-b border-[#E5EAF0]">
                        <h5 className="text-xs font-bold text-[#5B6B75] uppercase tracking-wide">Professional</h5>
                      </div>
                      {fonts.filter(f => f.category === 'Professional').map((font) => (
                        <button
                          key={font.name}
                          onClick={() => {
                            setTitleFont(font.name);
                            setShowTitleFontPicker(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-[#F7FAFC] transition-colors border-b border-[#E5EAF0] ${
                            titleFont === font.name ? 'bg-[#E8F5F4] text-[#2CB1A6]' : 'text-[#0B1F2A]'
                          }`}
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </button>
                      ))}

                      {/* Playful Fonts */}
                      <div className="p-3 bg-[#F7FAFC] border-b border-[#E5EAF0]">
                        <h5 className="text-xs font-bold text-[#5B6B75] uppercase tracking-wide">Playful</h5>
                      </div>
                      {fonts.filter(f => f.category === 'Playful').map((font) => (
                        <button
                          key={font.name}
                          onClick={() => {
                            setTitleFont(font.name);
                            setShowTitleFontPicker(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-[#F7FAFC] transition-colors border-b border-[#E5EAF0] ${
                            titleFont === font.name ? 'bg-[#E8F5F4] text-[#2CB1A6]' : 'text-[#0B1F2A]'
                          }`}
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </button>
                      ))}

                      {/* Handwriting Fonts */}
                      <div className="p-3 bg-[#F7FAFC] border-b border-[#E5EAF0]">
                        <h5 className="text-xs font-bold text-[#5B6B75] uppercase tracking-wide">Handwriting</h5>
                      </div>
                      {fonts.filter(f => f.category === 'Handwriting').map((font) => (
                        <button
                          key={font.name}
                          onClick={() => {
                            setTitleFont(font.name);
                            setShowTitleFontPicker(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-[#F7FAFC] transition-colors border-b border-[#E5EAF0] last:border-b-0 ${
                            titleFont === font.name ? 'bg-[#E8F5F4] text-[#2CB1A6]' : 'text-[#0B1F2A]'
                          }`}
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Effects */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-[#0B1F2A]">Effects</label>
                  </div>
                  <div className="relative bg-[#F7FAFC] rounded-lg overflow-hidden aspect-video border-2 border-[#E5EAF0]">
                    {/* Effect Preview */}
                    {selectedEffectAnimation ? (
                      <div className="absolute inset-0">
                        <Lottie
                          animationData={selectedEffectAnimation}
                          loop={true}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-[#5B6B75] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <p className="text-sm text-[#5B6B75]">No effect selected</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setShowEffectPanel(true)}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-[#5B6B75] hover:bg-[#0B1F2A] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invite Contributors Section - Only show for boards, not cards */}
          {formatType === 'board' && (
          <div className="border-b border-[#E5EAF0]">
            <button
              onClick={() => {
                if (isReadOnly) return;
                setShowInvite(!showInvite);
                if (!showInvite) {
                  setShowAppearance(false);
                  setShowDelivery(false);
                  setShowSettings(false);
                }
              }}
              disabled={isReadOnly}
              className={`w-full p-6 text-left transition-colors ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#F7FAFC]'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5F4] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1F2A]">Invite Contributors</h4>
                    <p className="text-sm text-[#5B6B75]">Share with others</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-[#5B6B75] flex-shrink-0 transition-transform ${showInvite ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Expanded Invite Panel */}
            {showInvite && (
              <div className="bg-[#F7FAFC] p-6 space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-[#E5EAF0]">
                  <button
                    onClick={() => setInviteTab('link')}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                      inviteTab === 'link'
                        ? 'border-[#2CB1A6] text-[#2CB1A6]'
                        : 'border-transparent text-[#5B6B75] hover:text-[#0B1F2A]'
                    }`}
                  >
                    Link
                  </button>
                  <button
                    onClick={() => setInviteTab('email')}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                      inviteTab === 'email'
                        ? 'border-[#2CB1A6] text-[#2CB1A6]'
                        : 'border-transparent text-[#5B6B75] hover:text-[#0B1F2A]'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setInviteTab('social')}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                      inviteTab === 'social'
                        ? 'border-[#2CB1A6] text-[#2CB1A6]'
                        : 'border-transparent text-[#5B6B75] hover:text-[#0B1F2A]'
                    }`}
                  >
                    Social
                  </button>
                  <button
                    onClick={() => setInviteTab('qr')}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                      inviteTab === 'qr'
                        ? 'border-[#2CB1A6] text-[#2CB1A6]'
                        : 'border-transparent text-[#5B6B75] hover:text-[#0B1F2A]'
                    }`}
                  >
                    QR Code
                  </button>
                </div>

                {/* Link Tab */}
                {inviteTab === 'link' && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-[#5B6B75]">Share this link with contributors to add their messages</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={boardLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://${boardLink}`);
                          setToast({ message: 'Link Copied To Clipboard', type: 'success' });
                        }}
                        className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Tab */}
                {inviteTab === 'email' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Email addresses</label>
                      <div className="space-y-2">
                        {inviteEmails.map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                const newEmails = [...inviteEmails];
                                newEmails[index] = e.target.value;
                                setInviteEmails(newEmails);
                              }}
                              placeholder="contributor@email.com"
                              className="flex-1 px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                            />
                            {inviteEmails.length > 1 && (
                              <button
                                onClick={() => setInviteEmails(inviteEmails.filter((_, i) => i !== index))}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => setInviteEmails([...inviteEmails, ''])}
                          className="text-sm text-[#2CB1A6] hover:text-[#1F8F86] font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add another email
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Message</label>
                      <textarea
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors resize-none"
                        placeholder="Add a personal message..."
                      />
                    </div>

                    <button
                      onClick={handleSendInvites}
                      disabled={sendingInvites}
                      className="w-full px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {sendingInvites ? 'Saving...' : 'Send Invites'}
                    </button>
                  </div>
                )}

                {/* Social Tab */}
                {inviteTab === 'social' && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-[#5B6B75] mb-4">Share your board on social media</p>

                    {/* Facebook */}
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${boardLink}`)}`, '_blank')}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-[#E5EAF0] rounded-lg hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#1877F2] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h5 className="font-bold text-[#0B1F2A]">Share on Facebook</h5>
                        <p className="text-sm text-[#5B6B75]">Post to your timeline or groups</p>
                      </div>
                      <svg className="w-5 h-5 text-[#5B6B75] group-hover:text-[#1877F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* LinkedIn */}
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://${boardLink}`)}`, '_blank')}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-[#E5EAF0] rounded-lg hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#0A66C2] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h5 className="font-bold text-[#0B1F2A]">Share on LinkedIn</h5>
                        <p className="text-sm text-[#5B6B75]">Share with your professional network</p>
                      </div>
                      <svg className="w-5 h-5 text-[#5B6B75] group-hover:text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this group card: https://${boardLink}`)}`, '_blank')}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-[#E5EAF0] rounded-lg hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#25D366] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h5 className="font-bold text-[#0B1F2A]">Share on WhatsApp</h5>
                        <p className="text-sm text-[#5B6B75]">Send to contacts or groups</p>
                      </div>
                      <svg className="w-5 h-5 text-[#5B6B75] group-hover:text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* QR Code Tab */}
                {inviteTab === 'qr' && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-[#5B6B75] mb-4">Scan this QR code to access the board</p>
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                      {/* QR Code placeholder - using an API to generate real QR code */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://${boardLink}`)}`}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                      <p className="text-sm text-[#5B6B75] mt-4 text-center font-mono">{boardLink}</p>
                      <button
                        onClick={() => {
                          // Download QR code
                          const link = document.createElement('a');
                          link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(`https://${boardLink}`)}`;
                          link.download = `qr-code-${boardId}.png`;
                          link.click();
                        }}
                        className="mt-4 px-6 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download QR Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          {/* Delivery Section */}
          <div className="border-b border-[#E5EAF0]">
            <button
              onClick={() => {
                if (isReadOnly) return;
                setShowDelivery(!showDelivery);
                if (!showDelivery) {
                  setShowAppearance(false);
                  setShowInvite(false);
                  setShowSettings(false);
                }
              }}
              disabled={isReadOnly}
              className={`w-full p-6 text-left transition-colors ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#F7FAFC]'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5F4] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1F2A]">Delivery</h4>
                    <p className="text-sm text-[#5B6B75]">Schedule & send</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-[#5B6B75] flex-shrink-0 transition-transform ${showDelivery ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Expanded Delivery Panel */}
            {showDelivery && (
              <div className="bg-[#F7FAFC] p-6 space-y-6">
                {/* Recipients with Emails */}
                <div>
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Recipients</label>
                  <p className="text-xs text-[#5B6B75] mb-3">Add email addresses for each recipient</p>
                  <div className="space-y-3">
                    {recipients.map((recipient, index) => (
                      <div key={index} className="bg-white border-2 border-[#E5EAF0] rounded-lg p-4">
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={recipient}
                            onChange={(e) => {
                              const newRecipients = [...recipients];
                              newRecipients[index] = e.target.value;
                              setRecipients(newRecipients);
                            }}
                            placeholder="Recipient name"
                            className="flex-1 px-4 py-2 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors text-sm"
                          />
                          {recipients.length > 1 && (
                            <button
                              onClick={() => {
                                setRecipients(recipients.filter((_, i) => i !== index));
                                const newEmails = {...recipientEmails};
                                delete newEmails[index];
                                setRecipientEmails(newEmails);
                              }}
                              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors flex-shrink-0"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <input
                          type="email"
                          value={recipientEmails[index] || ''}
                          onChange={(e) => setRecipientEmails({...recipientEmails, [index]: e.target.value})}
                          placeholder="recipient@email.com"
                          className="w-full px-4 py-2 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setRecipients([...recipients, ''])}
                      className="text-sm text-[#2CB1A6] hover:text-[#1F8F86] font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add another recipient
                    </button>
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Message to recipients</label>
                  <textarea
                    value={deliveryMessage}
                    onChange={(e) => setDeliveryMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors resize-none"
                    placeholder="Add a personal message to recipients..."
                  />
                </div>

                {/* Notify Contributors - Only show for boards, not cards */}
                {formatType === 'board' && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="notify-contributors"
                    checked={notifyContributors}
                    onChange={(e) => setNotifyContributors(e.target.checked)}
                    className="w-5 h-5 text-[#2CB1A6] border-2 border-[#E5EAF0] rounded focus:ring-[#2CB1A6] focus:ring-2"
                  />
                  <label htmlFor="notify-contributors" className="text-sm font-medium text-[#0B1F2A] cursor-pointer">
                    Notify contributors when the {formatType} is delivered
                  </label>
                </div>
                )}

                {/* Deliver Now Button */}
                <div>
                  <button
                    onClick={handleDeliverNowClick}
                    disabled={deliveringNow}
                    className="w-full py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-bold transition-colors shadow-lg text-base disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Deliver Now
                  </button>
                  <p className="text-xs text-center text-[#5B6B75] mt-2">{formatType === 'board' ? 'Board' : 'Card'} will be sent immediately to all recipients</p>

                  {/* Preview Message Link */}
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setShowMessagePreview(true)}
                      className="text-sm text-[#2CB1A6] hover:text-[#1F8F86] font-medium flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview message
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5EAF0]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#F7FAFC] text-[#5B6B75] font-medium">OR</span>
                  </div>
                </div>

                {/* Schedule Delivery */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-[#0B1F2A]">Schedule for later</label>
                    {scheduledDate && scheduledTime && (
                      <button
                        onClick={() => { setScheduledDate(''); setScheduledTime(''); }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear schedule
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 md:gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-medium text-[#5B6B75] mb-2">Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-2 py-2.5 md:px-4 md:py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors text-xs md:text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-medium text-[#5B6B75] mb-2">Time</label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-2 py-2.5 md:px-4 md:py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors text-xs md:text-sm"
                      />
                    </div>
                  </div>
                  {scheduledDate && scheduledTime ? (
                    (() => {
                      const scheduledDT = new Date(`${scheduledDate}T${scheduledTime}:00`);
                      const isPast = scheduledDT <= new Date();
                      return isPast ? (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-3 flex items-start gap-2">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-sm text-red-700 font-medium">
                            This date is in the past. Please select a future date and time.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-[#E8F5F4] border border-[#2CB1A6] rounded-lg p-3 flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#2CB1A6] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-[#0B1F2A] font-medium">
                            Scheduled for {scheduledDT.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {scheduledTime}. Save to confirm.
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-[#5B6B75]">
                      Select date and time to schedule delivery. Recipients must have email addresses.
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5EAF0]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#F7FAFC] text-[#5B6B75] font-medium">OR</span>
                  </div>
                </div>

                {/* Send Manually */}
                <div>
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-3">Send Manually</label>
                  <p className="text-xs text-[#5B6B75] mb-3">Copy the link below and share it with the recipient yourself</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`cardora-livid.vercel.app/boards/${boardData?.short_id}`}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg text-sm text-[#5B6B75] focus:border-[#2CB1A6] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`cardora-livid.vercel.app/boards/${boardData?.short_id}`);
                        setToast({ message: 'Link copied to clipboard!', type: 'success' });
                      }}
                      className="px-6 py-3 bg-[#E8F5F4] hover:bg-[#A7E8E2] text-[#2CB1A6] rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-[#5B6B75] mt-2">Share this link with the recipient to view their {formatType}</p>

                  {/* Mark as Delivered */}
                  {boardData?.status !== 'DELIVERED' && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowMarkDeliveredConfirm(true)}
                        className="w-full px-4 py-3 bg-white hover:bg-[#FFF4E5] text-[#F59E0B] border-2 border-[#FFD88A] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark as Delivered
                      </button>
                      <p className="text-xs text-[#5B6B75] mt-2">
                        Once you've shared the link and want to mark this {formatType} as delivered, click the button above. This will make the {formatType} read-only.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="border-b border-[#E5EAF0]">
            <button
              onClick={() => {
                if (isReadOnly) return;
                setShowSettings(!showSettings);
                if (!showSettings) {
                  setShowAppearance(false);
                  setShowInvite(false);
                  setShowDelivery(false);
                }
              }}
              disabled={isReadOnly}
              className={`w-full p-6 text-left transition-colors ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#F7FAFC]'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5F4] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1F2A]">Settings</h4>
                    <p className="text-sm text-[#5B6B75]">Advanced options</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-[#5B6B75] flex-shrink-0 transition-transform ${showSettings ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Expanded Settings Panel */}
            {showSettings && (
              <div className="bg-[#F7FAFC] p-6 space-y-6">
                {/* Creator Info */}
                <div>
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Creator</label>
                  <div className="bg-white border-2 border-[#E5EAF0] rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold flex-shrink-0">
                        {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#0B1F2A]">{user?.user_metadata?.name || user?.email}</p>
                        <p className="text-sm text-[#5B6B75]">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#5B6B75] mt-2">Board creator (name can be changed only from Account Settings)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - 70% - Preview */}
        <div
          className={`${mobilePanel === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 overflow-y-auto relative flex-col`}
          style={{
            ...(selectedBackground?.type === 'SOLID' && selectedBackground.color
              ? { backgroundColor: selectedBackground.color }
              : selectedBackground?.type === 'PATTERN' && selectedBackground.pattern?.file_path
              ? {
                  backgroundImage: `url(${selectedBackground.pattern.file_path})`,
                  backgroundSize: 'clamp(300px, 40vmin, 1200px) clamp(300px, 40vmin, 1200px)',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'repeat'
                }
              : {})
          }}
        >
          {/* Lottie Background Animation - Only show if ANIMATION type or no background selected */}
          {(selectedBackground?.type === 'ANIMATION' && selectedLottieAnimation) || (!selectedBackground && lottieAnimation) ? (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <LottieAnimation
                animationData={selectedBackground?.type === 'ANIMATION' ? selectedLottieAnimation : lottieAnimation}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ) : null}

          {/* Content wrapper with higher z-index */}
          <div className="relative z-10">
          {/* Board Title */}
          <div
            className="py-6 px-8 transition-colors relative"
            style={{
              backgroundColor: headerColorEnabled ? headerColorCode : 'transparent'
            }}
          >
            {/* Gradient shadow overlay when header color is disabled */}
            {!headerColorEnabled && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3) 50%, transparent)'
                }}
              />
            )}

            <textarea
              value={boardTitle}
              onChange={(e) => {
                if (!isReadOnly) {
                  const newValue = e.target.value;
                  const lineCount = newValue.split('\n').length;
                  // Limit to 2 lines
                  if (lineCount <= 2) {
                    setBoardTitle(newValue);
                  }
                }
              }}
              rows={1}
              disabled={isReadOnly}
              className={`font-bold text-center w-full bg-transparent border-2 rounded-lg px-4 py-2 transition-colors resize-none overflow-hidden relative z-10 ${
                isReadOnly
                  ? 'border-transparent cursor-default'
                  : 'border-transparent hover:border-[#E5EAF0] focus:border-[#2CB1A6] focus:outline-none'
              }`}
              placeholder="Enter board title..."
              style={{
                fontFamily: titleFont,
                fontSize: `${titleFontSize}px`,
                color: titleFontColor,
                lineHeight: '1.2'
              }}
            />
          </div>

          {/* Board Content Area - Messages */}
          <div className="p-8">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
                <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-12 shadow-xl">
                  <div className="text-center text-[#0B1F2A]">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-lg font-semibold">No messages yet</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Media */}
                    {message.media && message.media.length > 0 && (
                      <div className="relative w-full bg-gray-100">
                        {message.media[0].file_type === 'video' ? (
                          <video
                            src={message.media[0].file_url}
                            controls
                            className="w-full h-auto max-h-64 object-contain"
                          />
                        ) : message.media[0].file_type === 'audio' ? (
                          <div className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-[#2CB1A6] flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#0B1F2A]">Audio Message</p>
                                <p className="text-xs text-[#5B6B75]">Click play to listen</p>
                              </div>
                            </div>
                            <audio
                              src={message.media[0].file_url}
                              controls
                              className="w-full"
                            />
                          </div>
                        ) : (
                          <img
                            src={message.media[0].file_url}
                            alt="Message media"
                            className="w-full h-auto max-h-64 object-contain"
                          />
                        )}
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="p-6">
                      <div
                        className="text-[#0B1F2A] mb-4 leading-relaxed prose prose-sm max-w-none"
                        style={{ fontFamily: bodyFont }}
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />

                      {/* Author & Date */}
                      <div className="flex items-center justify-between text-sm text-[#5B6B75] pt-4 border-t border-[#E5EAF0]">
                        <span className="font-semibold">
                          — {message.contributor?.is_anonymous ? 'Anonymous' : message.contributor?.name}
                        </span>
                        <span>{new Date(message.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Background Selection Panel */}
        <BackgroundSelectionPanel
          isOpen={showBackgroundPanel}
          onClose={() => setShowBackgroundPanel(false)}
          selectedOccasion={occasionType}
          onSelectBackground={(background) => {
            setSelectedBackground(background);
            setToast({ message: 'Background selected! Save changes to apply.', type: 'success' });
          }}
          currentBackground={selectedBackground}
        />

        <EffectSelectionPanel
          isOpen={showEffectPanel}
          onClose={() => setShowEffectPanel(false)}
          selectedEffect={selectedEffect}
          onSelectEffect={(effect) => {
            setSelectedEffect(effect);
            setToast({
              message: effect ? 'Effect selected! Save changes to apply.' : 'Effect removed!',
              type: 'success'
            });
          }}
        />
      </div>

      {/* Mark as Delivered Confirmation Modal */}
      {showMarkDeliveredConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFF4E5] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0B1F2A] mb-2">
                Mark as Delivered?
              </h3>
              <p className="text-[#5B6B75]">
                Once marked as delivered, this {formatType} will become <strong>read-only</strong> and can no longer be edited. Are you sure you want to continue?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMarkDeliveredConfirm(false)}
                disabled={markingDelivered}
                className="flex-1 px-6 py-3 bg-white hover:bg-[#F7FAFC] text-[#5B6B75] border-2 border-[#E5EAF0] rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsDelivered}
                disabled={markingDelivered}
                className="flex-1 px-6 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {markingDelivered ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default function BoardEditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center"><div className="text-[#2CB1A6] text-xl">Loading...</div></div>}>
      <BoardEditorPageContent />
    </Suspense>
  );
}