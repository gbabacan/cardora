"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import { useAuth } from "@/hooks/useAuth";
import { getBoardById, updateBoard, updateBoardRecipients, addContributors, getBoardMessageCount, getBoardContributors } from "@/lib/boards";
import { getBoardMessages, createMessage, updateMessage, uploadMessageMedia, addGifToMessage, addUnsplashToMessage, deleteMessageMedia } from "@/lib/messages";
import { uploadCardMedia, addExternalMediaToCard, getCardMedia } from "@/lib/cards";
import type { Board, Recipient } from "@/lib/boards";
import type { Message } from "@/lib/messages";
import Toast from "@/components/Toast";
import DeliveryConfirmationModal from "@/components/DeliveryConfirmationModal";
import DeliveryMessagePreview from "@/components/DeliveryMessagePreview";
import BackgroundSelectionPanel from "@/components/BackgroundSelectionPanel";
import EffectSelectionPanel from "@/components/EffectSelectionPanel";
import TextureSelectionPanel from "@/components/TextureSelectionPanel";
import InlineRichTextEditor from "@/components/InlineRichTextEditor";
import CompactRichTextToolbar from "@/components/CompactRichTextToolbar";
import MediaSelectionPanel, { type Media } from "@/components/MediaSelectionPanel";
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
  const [headerColorEnabled, setHeaderColorEnabled] = useState(false);
  const [headerColorCode, setHeaderColorCode] = useState<string>('#2CB1A6');
  const [titleFont, setTitleFont] = useState('Inter');
  const [titleFontSize, setTitleFontSize] = useState<number>(28);
  const [titleFontColor, setTitleFontColor] = useState<string>('#0B1F2A');
  const [envelopeFont, setEnvelopeFont] = useState('Inter');
  const [envelopeColor, setEnvelopeColor] = useState<string>('#0B1F2A');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [showTitleFontPicker, setShowTitleFontPicker] = useState(false);
  const [showBodyFontPicker, setShowBodyFontPicker] = useState(false);
  const [showEnvelopeFontPicker, setShowEnvelopeFontPicker] = useState(false);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);
  const [selectedLottieAnimation, setSelectedLottieAnimation] = useState<any>(null);

  // Background selection panel state
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);

  // Page background state (separate from card theme)
  const [showPageBackgroundPanel, setShowPageBackgroundPanel] = useState(false);
  const [pageBackground, setPageBackground] = useState<Background | null>(null);

  // Effect selection panel state
  const [showEffectPanel, setShowEffectPanel] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [selectedEffectAnimation, setSelectedEffectAnimation] = useState<any>(null);

  // Texture selection panel state
  const [showTexturePanel, setShowTexturePanel] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState<any>(null);

  // Media selection panel state
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Card/Envelope preview state
  const [viewMode, setViewMode] = useState<'envelope' | 'card'>('envelope'); // envelope or card
  const [envelopeView, setEnvelopeView] = useState<'front' | 'back'>('front'); // front or back
  const [cardView, setCardView] = useState<'front' | 'inside'>('front'); // front or inside
  const [isFlipping, setIsFlipping] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [messageEditor, setMessageEditor] = useState<any>(null);

  // Invite Contributors panel state
  const [showInvite, setShowInvite] = useState(false);
  const [inviteTab, setInviteTab] = useState<'link' | 'email' | 'social' | 'qr'>('link');
  const [boardLink, setBoardLink] = useState('www.cardora.io/boards/loading');
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [inviteMessage, setInviteMessage] = useState(`Hi! I've created a group card and would love for you to contribute. Click the link below to add your message!`);

  // Settings panel state
  const [showSettings, setShowSettings] = useState(false);

  // Delivery panel state
  const [showDelivery, setShowDelivery] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState<{[key: number]: string}>({});
  const [deliveryMessage, setDeliveryMessage] = useState(''); // Message on the card (messages.content)
  const [recipientMessage, setRecipientMessage] = useState(`Something special is waiting for you! Open this card to see a heartfelt message created just for you. Enjoy! 🎉`); // Message in email (boards.recipient_message)
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

  // Helper function to determine if a color is light or dark
  const isLightColor = (color: string) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
  };

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

      // Load page background if exists (patterns/solid colors)
      if (board.background_data) {
        setPageBackground(board.background_data);
      }

      // Load card theme if exists (for cards only - lottie/animation)
      if (board.format_type === 'card' && board.card_background_data) {
        setSelectedBackground(board.card_background_data);
      }

      // Load effect if exists
      if (board.effect_data) {
        setSelectedEffect(board.effect_data);
      }

      // Load texture if exists
      if (board.texture_data) {
        setSelectedTexture(board.texture_data);
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
      setTitleFontSize(board.title_font_size || 28);
      setTitleFontColor(board.title_font_color || '#0B1F2A');
      setEnvelopeFont(board.envelope_font || 'Inter');
      setEnvelopeColor(board.envelope_color || '#0B1F2A');
      setBodyFont(board.body_font);
      setBackgroundImage(board.background);
      setRecipientMessage(board.recipient_message || `Something special is waiting for you! Open this card to see a heartfelt message created just for you. Enjoy! 🎉`);
      setNotifyContributors(board.notify_contributors);
      if (board.scheduled_delivery) {
        const date = new Date(board.scheduled_delivery);
        setScheduledDate(date.toISOString().split('T')[0]);
        setScheduledTime(date.toTimeString().split(' ')[0].substring(0, 5));
      }

      // Set board link using short_id
      setBoardLink(`www.cardora.io/${board.format_type === 'card' ? 'cards' : 'boards'}/${board.short_id}/view`);
      setInviteMessage(`Hi! I've created a group card for ${loadedRecipients.map(r => r.name).join(', ')} and would love for you to contribute. Click the link below to add your message!`);

      // Load messages
      const { messages: loadedMessages, error: messagesError } = await getBoardMessages(board.id);
      if (!messagesError && loadedMessages) {
        setMessages(loadedMessages);

        // For cards, load the card message and its media
        if (board.format_type === 'card' && loadedMessages.length > 0) {
          const cardMessage = loadedMessages[0];

          // Load message content into delivery message
          if (cardMessage.content) {
            setDeliveryMessage(cardMessage.content);
          }

          // Load media from the message
          if (cardMessage.media && cardMessage.media.length > 0) {
            const mediaData = cardMessage.media[0];
            setSelectedMedia({
              id: mediaData.id,
              type: mediaData.file_type as 'image' | 'gif' | 'video' | 'audio',
              url: mediaData.file_url,
              thumbnail: mediaData.thumbnail_url || undefined,
              source: mediaData.file_url.includes('giphy') ? 'giphy' :
                      mediaData.file_url.includes('unsplash') ? 'unsplash' : 'upload'
            });
          }
        }
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
      // First, save the card message before delivering
      if (deliveryMessage.trim()) {
        const { messages: existingMessages } = await getBoardMessages(boardId);

        if (existingMessages && existingMessages.length > 0) {
          // Update existing message
          const { error: updateError } = await updateMessage(existingMessages[0].id, deliveryMessage);
          if (updateError) {
            setToast({ message: 'Error saving card message: ' + updateError, type: 'error' });
            setDeliveringNow(false);
            return;
          }
        } else {
          // Create new message for this card
          const { message, contributorId, error: messageError } = await createMessage({
            board_id: boardId,
            contributor_name: user?.user_metadata?.name || user?.email || 'Card Creator',
            contributor_email: user?.email,
            content: deliveryMessage,
            is_anonymous: false
          });

          if (messageError || !message || !contributorId) {
            setToast({ message: 'Error creating card message: ' + messageError, type: 'error' });
            setDeliveringNow(false);
            return;
          }

          // Save media if there is any
          if (selectedMedia && message.id && contributorId) {
            if (selectedMedia.source === 'upload' && selectedMedia.file) {
              const { error: uploadError } = await uploadMessageMedia(
                message.id,
                contributorId,
                selectedMedia.file
              );
              if (uploadError) {
                setToast({ message: 'Error uploading media: ' + uploadError, type: 'error' });
              }
            } else if (selectedMedia.source === 'gif' && selectedMedia.url) {
              const { error: gifError } = await addGifToMessage(
                message.id,
                contributorId,
                selectedMedia.url
              );
              if (gifError) {
                setToast({ message: 'Error adding GIF: ' + gifError, type: 'error' });
              }
            } else if (selectedMedia.source === 'unsplash' && selectedMedia.url) {
              const { error: unsplashError } = await addUnsplashToMessage(
                message.id,
                contributorId,
                selectedMedia.url
              );
              if (unsplashError) {
                setToast({ message: 'Error adding photo: ' + unsplashError, type: 'error' });
              }
            }
          }
        }
      }

      // Update board status to DELIVERED
      const { error: boardError } = await updateBoard(boardId, {
        status: 'DELIVERED',
        recipient_message: recipientMessage,
        notify_contributors: notifyContributors,
        delivery_type: 'ON_DEMAND',
        effect_id: selectedEffect?.id || undefined,
        texture_id: selectedTexture?.id || undefined
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
            boardLink: `www.cardora.io/${formatType === 'board' ? 'boards' : 'cards'}/${boardData?.short_id}/view`,
            deliveryMessage: recipientMessage || undefined,
            formatType: formatType,
            senderName: user?.user_metadata?.name || user?.email || 'Sender'
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

  // Save board handler
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
      // For cards, create/update the card message FIRST
      let cardMessageId: string | undefined = undefined;
      let cardContributorId: string | undefined = undefined;

      if (formatType === 'card') {
        // Check if card already has a message
        const { messages: existingMessages } = await getBoardMessages(boardId);

        if (existingMessages && existingMessages.length > 0) {
          // Update existing message
          cardMessageId = existingMessages[0].id;
          cardContributorId = existingMessages[0].contributor_id;

          const { error: updateError } = await updateMessage(cardMessageId, deliveryMessage);
          if (updateError) {
            setToast({ message: 'Error updating card message: ' + updateError, type: 'error' });
            setSaving(false);
            return;
          }
        } else {
          // Create new message for this card
          const { message, contributorId, error: messageError } = await createMessage({
            board_id: boardId,
            contributor_name: user?.user_metadata?.name || user?.email || 'Card Creator',
            contributor_email: user?.email,
            content: deliveryMessage,
            is_anonymous: false
          });

          if (messageError || !message || !contributorId) {
            setToast({ message: 'Error creating card message: ' + messageError, type: 'error' });
            setSaving(false);
            return;
          }

          cardMessageId = message.id;
          cardContributorId = contributorId;
        }

        // Save card media if there is any, linked to the message
        if (selectedMedia && cardMessageId && cardContributorId) {
          console.log('Saving card media:', selectedMedia);

          // Check if this is new media or already saved media
          // Media loaded from database will have: id (from media table), url, source, type
          // Newly selected media will have: id (from giphy/unsplash), url, source, type, but NOT file_url
          // We need to check if this media is already in our database
          // Simple check: if the URL matches what's already in the message's media, skip saving
          const { messages: currentMessages } = await getBoardMessages(boardId);
          const currentMedia = currentMessages?.[0]?.media?.[0];
          const isMediaAlreadySaved = currentMedia && currentMedia.file_url === selectedMedia.url;

          if (!isMediaAlreadySaved) {
            // Delete old media before uploading new media
            const { error: deleteError } = await deleteMessageMedia(cardMessageId);
            if (deleteError) {
              console.error('Error deleting old media:', deleteError);
              // Continue anyway, as we still want to upload the new media
            }

            if (selectedMedia.source === 'upload' && selectedMedia.file) {
              // Upload file to storage
              const { error: mediaError } = await uploadMessageMedia({
                board_id: boardId,
                message_id: cardMessageId,
                contributor_id: cardContributorId,
                file: selectedMedia.file,
                file_type: selectedMedia.type
              });

              if (mediaError) {
                console.error('Media upload error:', mediaError);
                setToast({ message: 'Error uploading media: ' + mediaError, type: 'error' });
                setSaving(false);
                return;
              }
            } else if (selectedMedia.source === 'giphy') {
              const { error: mediaError } = await addGifToMessage({
                board_id: boardId,
                message_id: cardMessageId,
                contributor_id: cardContributorId,
                gif_url: selectedMedia.url
              });

              if (mediaError) {
                setToast({ message: 'Error saving GIF: ' + mediaError, type: 'error' });
                setSaving(false);
                return;
              }
            } else if (selectedMedia.source === 'unsplash') {
              const { error: mediaError } = await addUnsplashToMessage({
                board_id: boardId,
                message_id: cardMessageId,
                contributor_id: cardContributorId,
                unsplash_url: selectedMedia.url,
                unsplash_author: 'Unsplash',
                unsplash_author_url: selectedMedia.thumbnail || ''
              });

              if (mediaError) {
                setToast({ message: 'Error saving Unsplash image: ' + mediaError, type: 'error' });
                setSaving(false);
                return;
              }
            }
          }
        }
      }

      // Update board
      // For cards: background_id (page background), card_background_id (card theme lottie)
      // For boards: background_id (theme/lottie/patterns/solid)
      const { error: boardError} = await updateBoard(boardId, {
        title: boardTitle,
        header_color: headerColorEnabled,
        header_color_code: headerColorEnabled ? headerColorCode : undefined,
        title_font: titleFont,
        title_font_size: titleFontSize,
        title_font_color: titleFontColor,
        envelope_font: envelopeFont,
        envelope_color: envelopeColor,
        body_font: bodyFont,
        intro_animation: true,
        effect_id: selectedEffect?.id || undefined,
        background: backgroundImage,
        background_id: pageBackground?.id || undefined, // Page background (patterns/solid colors)
        card_background_id: formatType === 'card' ? selectedBackground?.id : undefined, // Card theme (lottie/animation)
        recipient_message: recipientMessage, // Email message
        notify_contributors: notifyContributors,
        delivery_type: scheduledDate && scheduledTime ? 'SCHEDULED' : undefined,
        scheduled_delivery: scheduledDate && scheduledTime
          ? `${scheduledDate}T${scheduledTime}:00`
          : undefined,
        status: 'PUBLISHED',
        texture_id: selectedTexture?.id || undefined
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
        deliveryMessage={recipientMessage}
        boardLink={`www.cardora.io/${formatType === 'board' ? 'boards' : 'cards'}/${boardData?.short_id}/view`}
        formatType={formatType}
        senderName={user?.user_metadata?.name || user?.email || 'Sender'}
      />

      <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E5EAF0] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Image
              src="/cardoraLogo.png"
              alt="Cardora"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="h-6 w-px bg-[#E5EAF0]" />
          <span className="text-sm text-[#5B6B75]">
            {isReadOnly ? 'Viewing' : 'Editing'}: <span className="font-medium text-[#0B1F2A]">{boardTitle}</span>
          </span>
          {recipients.length > 0 && (
            <>
              <div className="h-6 w-px bg-[#E5EAF0]" />
              <span className="text-sm text-[#5B6B75]">
                For: <span className="font-medium text-[#0B1F2A]">{recipients.join(', ')}</span>
              </span>
            </>
          )}
          {isReadOnly && (
            <span className="px-3 py-1 bg-[#FFF4E6] text-[#92400E] text-xs font-semibold rounded-full border border-[#F59E0B]">
              DELIVERED - READ ONLY
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="px-4 py-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium">
              {isReadOnly ? 'Back to Dashboard' : 'Cancel'}
            </button>
          </Link>
          {!isReadOnly && (
            <>
              <Link href={`/${formatType === 'card' ? 'cards' : 'boards'}/${boardData?.short_id}/view`} target="_blank">
                <button className="px-4 py-2 border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View as Recipient
                </button>
              </Link>
              <button
                onClick={handleSaveBoard}
                disabled={saving}
                className="px-6 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - 30% - Utilities */}
        <div className="w-[30%] bg-white border-r border-[#E5EAF0] overflow-y-auto flex-shrink-0">
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
                {/* Card Themes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-[#0B1F2A]">Card Themes</label>
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
                          <Lottie
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

                {/* Card Texture */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-[#0B1F2A]">Card Texture</label>
                  </div>
                  <div className="relative bg-white rounded-lg overflow-hidden border-2 border-[#E5EAF0]">
                    {/* Texture Preview */}
                    <div
                      className="h-48 relative"
                      style={
                        selectedTexture?.file_path
                          ? {
                              backgroundImage: `url(${selectedTexture.file_path})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
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
                      {!selectedTexture && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-[#5B6B75] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-[#5B6B75]">No texture selected</p>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => setShowTexturePanel(true)}
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

                {/* Background (Page Background) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-[#0B1F2A]">Background</label>
                  </div>
                  <div className="relative bg-white rounded-lg overflow-hidden border-2 border-[#E5EAF0]">
                    {/* Background Preview */}
                    <div
                      className="h-48 relative rounded-lg overflow-hidden"
                      style={
                        pageBackground
                          ? pageBackground.type === 'PATTERN'
                            ? {
                                backgroundImage: getBackgroundCssValue(pageBackground),
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }
                            : {
                                background: getBackgroundCssValue(pageBackground)
                              }
                          : {
                              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                            }
                      }
                    >
                      {!pageBackground && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-[#5B6B75] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-[#5B6B75]">No background selected</p>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => setShowPageBackgroundPanel(true)}
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

                {/* Envelope */}
                <div>
                  <div className="mb-3">
                    <label className="text-sm font-bold text-[#0B1F2A]">Envelope</label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Envelope Font Size */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Envelope Font Size (px)</label>
                      <input
                        type="number"
                        min="8"
                        max="128"
                        value={titleFontSize}
                        onChange={(e) => setTitleFontSize(parseInt(e.target.value) || 28)}
                        className="w-full px-3 py-2 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none text-sm"
                      />
                    </div>

                    {/* Envelope Color */}
                    <div>
                      <label className="block text-xs font-semibold text-[#5B6B75] mb-2">Envelope Color</label>
                      <input
                        type="color"
                        value={envelopeColor}
                        onChange={(e) => setEnvelopeColor(e.target.value)}
                        className="w-full h-10 rounded border-2 border-[#E5EAF0] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Envelope font */}
                <div className="relative">
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Envelope font</label>
                  <button
                    onClick={() => setShowEnvelopeFontPicker(!showEnvelopeFontPicker)}
                    className="w-full bg-white border-2 border-[#E5EAF0] rounded-lg p-4 flex items-center justify-between hover:border-[#2CB1A6] transition-colors"
                  >
                    <span className="text-[#5B6B75] font-medium">{envelopeFont}</span>
                    <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Font Picker Dropdown */}
                  {showEnvelopeFontPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#E5EAF0] rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                      {/* Professional Fonts */}
                      <div className="p-3 bg-[#F7FAFC] border-b border-[#E5EAF0]">
                        <h5 className="text-xs font-bold text-[#5B6B75] uppercase tracking-wide">Professional</h5>
                      </div>
                      {fonts.filter(f => f.category === 'Professional').map((font) => (
                        <button
                          key={font.name}
                          onClick={() => {
                            setEnvelopeFont(font.name);
                            setShowEnvelopeFontPicker(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-[#F7FAFC] transition-colors border-b border-[#E5EAF0] ${
                            envelopeFont === font.name ? 'bg-[#E8F5F4] text-[#2CB1A6]' : 'text-[#0B1F2A]'
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
                            setEnvelopeFont(font.name);
                            setShowEnvelopeFontPicker(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-[#F7FAFC] transition-colors border-b border-[#E5EAF0] ${
                            envelopeFont === font.name ? 'bg-[#E8F5F4] text-[#2CB1A6]' : 'text-[#0B1F2A]'
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
                            setEnvelopeFont(font.name);
                            setShowEnvelopeFontPicker(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-[#F7FAFC] transition-colors border-b border-[#E5EAF0] last:border-b-0 ${
                            envelopeFont === font.name ? 'bg-[#E8F5F4] text-[#2CB1A6]' : 'text-[#0B1F2A]'
                          }`}
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  )}
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
                          alert('Link copied to clipboard!');
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

                {/* Message to Recipients */}
                <div>
                  <label className="block text-sm font-bold text-[#0B1F2A] mb-2">Message to recipients</label>
                  <textarea
                    value={recipientMessage}
                    onChange={(e) => setRecipientMessage(e.target.value)}
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
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5B6B75] mb-2">Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5B6B75] mb-2">Time</label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
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
                      value={`www.cardora.io/${formatType === 'board' ? 'boards' : 'cards'}/${boardData?.short_id}/view`}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg text-sm text-[#5B6B75] focus:border-[#2CB1A6] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`www.cardora.io/${formatType === 'board' ? 'boards' : 'cards'}/${boardData?.short_id}/view`);
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
                  <p className="text-xs text-[#5B6B75] mt-2">Share this link with the recipient to view their {formatType === 'board' ? 'board' : 'card'}</p>

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
                        Once you've shared the link and want to mark this {formatType === 'board' ? 'board' : 'card'} as delivered, click the button above. This will make the {formatType === 'board' ? 'board' : 'card'} read-only.
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

        {/* Right Panel - 70% - Card/Envelope Preview */}
        <div
          className="flex-1 overflow-y-auto relative flex flex-col"
          style={
            pageBackground
              ? pageBackground.type === 'PATTERN'
                ? {
                    backgroundImage: getBackgroundCssValue(pageBackground),
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'clamp(300px, 40vmin, 1200px) clamp(300px, 40vmin, 1200px)'
                  }
                : { background: getBackgroundCssValue(pageBackground) }
              : { background: 'linear-gradient(to bottom right, rgb(252, 231, 243), rgb(249, 168, 212), rgb(236, 72, 153))' }
          }
        >
          {/* Content wrapper */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full h-full flex items-center justify-center relative">

              {/* ENVELOPE - Always visible */}
              <div
                className={`absolute transition-all duration-700 ease-in-out ${
                  viewMode === 'envelope'
                    ? 'scale-100 opacity-100 z-20 left-16'
                    : 'scale-85 opacity-80 z-10 left-8'
                }`}
                onClick={() => setViewMode('envelope')}
                style={{
                  cursor: viewMode === 'card' ? 'pointer' : 'default',
                  perspective: '1000px'
                }}
              >
                {envelopeView === 'front' ? (
                  /* Envelope Front (Closed) */
                  <div className="relative w-[750px]">
                    <div
                      className={`aspect-[16/10] rounded-lg shadow-2xl relative overflow-hidden transition-all duration-500 ${
                        isFlipping && viewMode === 'envelope' ? 'animate-flip' : ''
                      }`}
                      style={{
                        backgroundColor: envelopeColor || '#8B4513',
                        boxShadow: viewMode === 'envelope'
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                          : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Stamp */}
                      <div className="absolute top-8 right-8 flex items-center">
                        {/* Postmark SVG */}
                        <div className="relative w-32 h-32 -mr-4 z-10">
                          <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Outer circle */}
                            <circle
                              cx="70"
                              cy="100"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="8 4"
                              opacity="0.7"
                              className="text-gray-800"
                            />
                            {/* Middle circle */}
                            <circle
                              cx="70"
                              cy="100"
                              r="38"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeDasharray="6 3"
                              opacity="0.6"
                              className="text-gray-800"
                            />
                            {/* Inner circle */}
                            <circle
                              cx="70"
                              cy="100"
                              r="31"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray="5 2"
                              opacity="0.5"
                              className="text-gray-800"
                            />
                            {/* Wavy lines on the right */}
                            <path
                              d="M 115 75 Q 135 70, 155 75 T 195 75"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              opacity="0.7"
                              className="text-gray-800"
                            />
                            <path
                              d="M 115 87 Q 135 82, 155 87 T 195 87"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              opacity="0.6"
                              className="text-gray-800"
                            />
                            <path
                              d="M 115 100 Q 135 95, 155 100 T 195 100"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              opacity="0.7"
                              className="text-gray-800"
                            />
                            <path
                              d="M 115 113 Q 135 108, 155 113 T 195 113"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              opacity="0.6"
                              className="text-gray-800"
                            />
                            <path
                              d="M 115 125 Q 135 120, 155 125 T 195 125"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              opacity="0.7"
                              className="text-gray-800"
                            />
                          </svg>
                        </div>

                        {/* Cardora Stamp Text */}
                        <div className="w-28 h-20 transform rotate-2">
                          <div className="relative w-full h-full bg-white shadow-lg" style={{
                            clipPath: `polygon(
                              0 3px, 3px 3px, 3px 0, 6px 0, 6px 3px, 9px 3px, 9px 0, 12px 0, 12px 3px, 15px 3px, 15px 0, 18px 0, 18px 3px, 21px 3px, 21px 0, 24px 0, 24px 3px, 27px 3px, 27px 0, 30px 0, 30px 3px, 33px 3px, 33px 0, 36px 0, 36px 3px, 39px 3px, 39px 0, 42px 0, 42px 3px, 45px 3px, 45px 0, 48px 0, 48px 3px, 51px 3px, 51px 0, 54px 0, 54px 3px, 57px 3px, 57px 0, 60px 0, 60px 3px, 63px 3px, 63px 0, 66px 0, 66px 3px, 69px 3px, 69px 0, 72px 0, 72px 3px, 75px 3px, 75px 0, 78px 0, 78px 3px, 81px 3px, 81px 0, 84px 0, 84px 3px, 87px 3px, 87px 0, 90px 0, 90px 3px, 93px 3px, 93px 0, 96px 0, 96px 3px, 99px 3px, 99px 0, 102px 0, 102px 3px, 105px 3px, 105px 0, 108px 0, 108px 3px, 111px 3px, 111px 0, 112px 0,
                              112px 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% 9px, calc(100% - 3px) 9px, calc(100% - 3px) 12px, 100% 12px, 100% 15px, calc(100% - 3px) 15px, calc(100% - 3px) 18px, 100% 18px, 100% 21px, calc(100% - 3px) 21px, calc(100% - 3px) 24px, 100% 24px, 100% 27px, calc(100% - 3px) 27px, calc(100% - 3px) 30px, 100% 30px, 100% 33px, calc(100% - 3px) 33px, calc(100% - 3px) 36px, 100% 36px, 100% 39px, calc(100% - 3px) 39px, calc(100% - 3px) 42px, 100% 42px, 100% 45px, calc(100% - 3px) 45px, calc(100% - 3px) 48px, 100% 48px, 100% 51px, calc(100% - 3px) 51px, calc(100% - 3px) 54px, 100% 54px, 100% 57px, calc(100% - 3px) 57px, calc(100% - 3px) 60px, 100% 60px, 100% 63px, calc(100% - 3px) 63px, calc(100% - 3px) 66px, 100% 66px, 100% 69px, calc(100% - 3px) 69px, calc(100% - 3px) 72px, 100% 72px, 100% 75px, calc(100% - 3px) 75px, calc(100% - 3px) 78px, 100% 78px, 100% 80px,
                              calc(100% - 3px) calc(100% - 3px), 108px calc(100% - 3px), 108px 100%, 105px 100%, 105px calc(100% - 3px), 102px calc(100% - 3px), 102px 100%, 99px 100%, 99px calc(100% - 3px), 96px calc(100% - 3px), 96px 100%, 93px 100%, 93px calc(100% - 3px), 90px calc(100% - 3px), 90px 100%, 87px 100%, 87px calc(100% - 3px), 84px calc(100% - 3px), 84px 100%, 81px 100%, 81px calc(100% - 3px), 78px calc(100% - 3px), 78px 100%, 75px 100%, 75px calc(100% - 3px), 72px calc(100% - 3px), 72px 100%, 69px 100%, 69px calc(100% - 3px), 66px calc(100% - 3px), 66px 100%, 63px 100%, 63px calc(100% - 3px), 60px calc(100% - 3px), 60px 100%, 57px 100%, 57px calc(100% - 3px), 54px calc(100% - 3px), 54px 100%, 51px 100%, 51px calc(100% - 3px), 48px calc(100% - 3px), 48px 100%, 45px 100%, 45px calc(100% - 3px), 42px calc(100% - 3px), 42px 100%, 39px 100%, 39px calc(100% - 3px), 36px calc(100% - 3px), 36px 100%, 33px 100%, 33px calc(100% - 3px), 30px calc(100% - 3px), 30px 100%, 27px 100%, 27px calc(100% - 3px), 24px calc(100% - 3px), 24px 100%, 21px 100%, 21px calc(100% - 3px), 18px calc(100% - 3px), 18px 100%, 15px 100%, 15px calc(100% - 3px), 12px calc(100% - 3px), 12px 100%, 9px 100%, 9px calc(100% - 3px), 6px calc(100% - 3px), 6px 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px), 0 100%,
                              0 calc(100% - 3px), 3px calc(100% - 3px), 3px 75px, 0 75px, 0 72px, 3px 72px, 3px 69px, 0 69px, 0 66px, 3px 66px, 3px 63px, 0 63px, 0 60px, 3px 60px, 3px 57px, 0 57px, 0 54px, 3px 54px, 3px 51px, 0 51px, 0 48px, 3px 48px, 3px 45px, 0 45px, 0 42px, 3px 42px, 3px 39px, 0 39px, 0 36px, 3px 36px, 3px 33px, 0 33px, 0 30px, 3px 30px, 3px 27px, 0 27px, 0 24px, 3px 24px, 3px 21px, 0 21px, 0 18px, 3px 18px, 3px 15px, 0 15px, 0 12px, 3px 12px, 3px 9px, 0 9px, 0 6px, 3px 6px, 3px 3px
                            )`
                          }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[#2CB1A6] font-bold text-base">Cardora</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* From Section in upper left */}
                      <div className="absolute top-8 left-8">
                        <div
                          className="space-y-2"
                          style={{
                            fontFamily: titleFont,
                            color: isLightColor(envelopeColor || '#8B4513') ? '#1F2937' : '#FFFFFF'
                          }}
                        >
                          <p className="text-xl">
                            <span className="font-semibold">From:</span> {user?.user_metadata?.name || user?.email || 'Sender'}
                          </p>
                          <p className="text-xl">
                            <span className="font-semibold">To:</span> {recipients.filter(r => r.trim()).join(', ') || 'Recipients'}
                          </p>
                        </div>
                      </div>

                      {/* Title in center */}
                      <div className="absolute inset-0 flex items-center justify-center px-8">
                        {isEditingTitle && viewMode === 'envelope' ? (
                          <input
                            type="text"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setIsEditingTitle(false);
                              }
                            }}
                            autoFocus
                            className="font-bold text-center bg-transparent border-2 border-dashed border-white/50 rounded px-4 py-2 outline-none w-full max-w-2xl"
                            style={{
                              fontFamily: envelopeFont,
                              fontSize: `${titleFontSize * 1.5}px`,
                              color: isLightColor(envelopeColor || '#8B4513') ? '#1F2937' : '#FFFFFF'
                            }}
                            placeholder="Card Title"
                          />
                        ) : (
                          <h1
                            onClick={() => !isReadOnly && viewMode === 'envelope' && setIsEditingTitle(true)}
                            className={`font-bold text-center ${!isReadOnly ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
                            style={{
                              fontFamily: envelopeFont,
                              fontSize: `${titleFontSize * 1.5}px`,
                              color: isLightColor(envelopeColor || '#8B4513') ? '#1F2937' : '#FFFFFF'
                            }}
                          >
                            {boardTitle || 'Card Title'}
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Envelope Back (Open with lining) */
                  <div className="relative w-[750px]">
                    <div
                      className={`aspect-[16/10] rounded-lg shadow-2xl relative overflow-hidden transition-all duration-500 ${
                        isFlipping && viewMode === 'envelope' ? 'animate-flip' : ''
                      }`}
                      style={{
                        backgroundColor: envelopeColor || '#8B4513',
                        boxShadow: viewMode === 'envelope'
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                          : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Envelope opened flap with golden lining */}
                      <div className="absolute inset-0">
                        {/* Bottom part of envelope */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3"
                          style={{ backgroundColor: envelopeColor || '#8B4513' }}
                        />

                        {/* Top flap opened */}
                        <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
                          <div
                            className="absolute inset-0 origin-top"
                            style={{
                              backgroundColor: '#D4AF37',
                              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                              transform: 'scaleY(1.2) translateY(-10%)'
                            }}
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD - Always visible */}
              <div
                className={`absolute transition-all duration-700 ease-in-out ${
                  viewMode === 'card'
                    ? 'scale-100 opacity-100 z-20 right-1/4'
                    : 'scale-85 opacity-80 z-10 right-8'
                }`}
                onClick={() => setViewMode('card')}
                style={{
                  cursor: viewMode === 'envelope' ? 'pointer' : 'default',
                  perspective: '1000px'
                }}
              >
                {cardView === 'front' ? (
                  /* Card Front */
                  <div className="relative w-[550px]">
                    <div
                      className={`aspect-[3/4] rounded-lg shadow-2xl relative overflow-hidden transition-all duration-500 ${
                        isFlipping && viewMode === 'card' ? 'animate-flip' : ''
                      }`}
                      style={{
                        backgroundImage: selectedTexture?.file_path ? `url(${selectedTexture.file_path})` : 'none',
                        backgroundColor: selectedTexture?.file_path ? 'transparent' : '#FAFAFA',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: viewMode === 'card'
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                          : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Theme Animation */}
                      {selectedBackground?.type === 'ANIMATION' && selectedLottieAnimation && (
                        <div className="absolute inset-0">
                          <Lottie
                            animationData={selectedLottieAnimation}
                            loop={true}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Card Inside */
                  <div className="relative w-[550px]">
                    <div
                      className={`aspect-[3/4] rounded-lg shadow-2xl relative ${
                        isEditingMessage ? 'overflow-visible' : 'overflow-hidden'
                      } p-12 transition-all duration-500 ${
                        isFlipping && viewMode === 'card' ? 'animate-flip' : ''
                      }`}
                      style={{
                        backgroundImage: selectedTexture?.file_path ? `url(${selectedTexture.file_path})` : 'none',
                        backgroundColor: selectedTexture?.file_path ? 'transparent' : '#FAFAFA',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: viewMode === 'card'
                          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                          : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Two sections: Media (top) and Message (bottom) */}
                      <div className="h-full flex flex-col gap-0 p-0">
                        {/* Top Section - Media Upload */}
                        <div className="h-1/2 flex items-center justify-center border-b-2 border-gray-200 relative overflow-hidden bg-gray-50">
                          {selectedMedia ? (
                            <div className="relative w-full h-full">
                              {selectedMedia.type === 'image' || selectedMedia.type === 'gif' ? (
                                <img
                                  src={selectedMedia.url}
                                  alt="Selected media"
                                  className="w-full h-full object-cover"
                                />
                              ) : selectedMedia.type === 'video' ? (
                                <video
                                  src={selectedMedia.url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              ) : selectedMedia.type === 'audio' ? (
                                <div className="flex items-center justify-center h-full bg-gray-100 px-4">
                                  <audio src={selectedMedia.url} controls className="w-full max-w-md" />
                                </div>
                              ) : null}
                              {viewMode === 'card' && cardView === 'inside' && !isReadOnly && (
                                <button
                                  onClick={() => setShowMediaPanel(true)}
                                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 border-2 border-gray-200 z-10"
                                  title="Change media"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ) : !isReadOnly ? (
                            <button
                              onClick={() => setShowMediaPanel(true)}
                              className="flex flex-col items-center gap-4 hover:scale-105 transition-transform"
                              disabled={viewMode !== 'card' || cardView !== 'inside'}
                            >
                              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </div>
                              <p className="text-gray-600 font-medium text-lg">Add media</p>
                            </button>
                          ) : null}
                        </div>

                        {/* Bottom Section - Message */}
                        <div className="h-1/2 flex flex-col p-8 relative overflow-visible">
                          {/* T Button for editing */}
                          {viewMode === 'card' && cardView === 'inside' && !isReadOnly && (
                            <button
                              onClick={() => {
                                setIsEditingMessage(!isEditingMessage);
                                if (!isEditingMessage && messageEditor) {
                                  messageEditor.commands.focus();
                                }
                              }}
                              className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 border-2 ${
                                isEditingMessage ? 'border-[#2CB1A6]' : 'border-gray-200'
                              } z-50`}
                              title="Edit message"
                            >
                              <span className={`font-bold text-lg ${isEditingMessage ? 'text-[#2CB1A6]' : 'text-gray-700'}`}>T</span>
                            </button>
                          )}

                          <div
                            className="flex-1 overflow-y-auto relative"
                            onClick={() => {
                              if (viewMode === 'card' && cardView === 'inside' && !isEditingMessage && !isReadOnly) {
                                setIsEditingMessage(true);
                                setTimeout(() => {
                                  if (messageEditor) {
                                    messageEditor.commands.focus();
                                  }
                                }, 100);
                              }
                            }}
                          >
                            {viewMode === 'card' && cardView === 'inside' ? (
                              <div className="w-full h-full">
                                <InlineRichTextEditor
                                  content={deliveryMessage || '<p>Click to add your message...</p>'}
                                  onChange={setDeliveryMessage}
                                  placeholder="Click to add your message..."
                                  editable={isEditingMessage}
                                  onEditorReady={setMessageEditor}
                                />
                              </div>
                            ) : (
                              <div
                                className="text-gray-800 text-lg leading-relaxed prose prose-sm max-w-none"
                                style={{ fontFamily: bodyFont }}
                                dangerouslySetInnerHTML={{
                                  __html: deliveryMessage || '<p class="text-gray-400">Your message will appear here...</p>'
                                }}
                              />
                            )}
                          </div>

                          {/* Compact Rich Text Toolbar - Right below message, inside card */}
                          {isEditingMessage && viewMode === 'card' && cardView === 'inside' && messageEditor ? (
                            <div className="mt-2 flex justify-center relative z-50">
                              <CompactRichTextToolbar editor={messageEditor} />
                            </div>
                          ) : (
                            <div className="mt-4 text-left">
                              <p className="text-gray-600" style={{ fontFamily: bodyFont }}>
                                From {user?.user_metadata?.name || user?.email || 'Sender'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Toggle Buttons at bottom */}
          <div className="p-6 flex justify-center gap-4">
            {/* Flip Button - Flips current focused item */}
            <button
              onClick={() => {
                setIsFlipping(true);
                setTimeout(() => {
                  if (viewMode === 'envelope') {
                    setEnvelopeView(prev => prev === 'front' ? 'back' : 'front');
                  } else {
                    setCardView(prev => prev === 'front' ? 'inside' : 'front');
                  }
                }, 250);
                setTimeout(() => setIsFlipping(false), 600);
              }}
              className="px-6 py-3 rounded-full bg-white shadow-xl flex items-center gap-2 hover:scale-105 transition-transform border-2 border-gray-300"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">
                Flip {viewMode === 'envelope' ? 'Envelope' : 'Card'}
              </span>
            </button>
          </div>
        </div>

        {/* End of right panel */}
      </div>

      {/* Card Theme Selection Panel (Animations only) */}
      <BackgroundSelectionPanel
        isOpen={showBackgroundPanel}
        onClose={() => setShowBackgroundPanel(false)}
        selectedOccasion={occasionType}
        onSelectBackground={(background) => {
          setSelectedBackground(background);
          setToast({ message: 'Card theme selected! Save changes to apply.', type: 'success' });
        }}
        currentBackground={selectedBackground}
        onlyAnimations={true} // Show only animations for card themes
      />

      {/* Page Background Selection Panel (Patterns & Solid Colors only) */}
      <BackgroundSelectionPanel
        isOpen={showPageBackgroundPanel}
        onClose={() => setShowPageBackgroundPanel(false)}
        selectedOccasion={occasionType}
        onSelectBackground={(background) => {
          setPageBackground(background);
          setToast({ message: 'Page background selected! Save changes to apply.', type: 'success' });
        }}
        currentBackground={pageBackground}
        hideAnimations={true} // Hide animations for page background
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

      <TextureSelectionPanel
        isOpen={showTexturePanel}
        onClose={() => setShowTexturePanel(false)}
        selectedTexture={selectedTexture}
        onSelectTexture={(texture) => {
          setSelectedTexture(texture);
          setToast({
            message: texture ? 'Texture selected! Save changes to apply.' : 'Texture removed!',
            type: 'success'
          });
        }}
      />

      <MediaSelectionPanel
        isOpen={showMediaPanel}
        onClose={() => setShowMediaPanel(false)}
        onSelectMedia={(media) => {
          setSelectedMedia(media);
          setToast({
            message: media ? 'Media selected! Save and publish to apply.' : 'Media removed!',
            type: 'success'
          });
        }}
      />

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
                Once marked as delivered, this {formatType === 'board' ? 'board' : 'card'} will become <strong>read-only</strong> and can no longer be edited. Are you sure you want to continue?
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