"use client";

import { useState } from "react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardLink: string;
  boardTitle: string;
  boardId: string;
  recipientNames: string[];
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export default function InviteModal({
  isOpen,
  onClose,
  boardLink,
  boardTitle,
  boardId,
  recipientNames,
  onError,
  onSuccess
}: InviteModalProps) {
  const [inviteTab, setInviteTab] = useState<'link' | 'email' | 'social' | 'qr'>('link');
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [inviteMessage, setInviteMessage] = useState(`Hi! I found this amazing group card for ${boardTitle}. Come add your message and make it even more special!`);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${boardLink}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendInvites = async () => {
    // Filter and validate emails
    const trimmedEmails = inviteEmails.map(email => email.trim()).filter(email => email);

    if (trimmedEmails.length === 0) {
      if (onError) {
        onError('Please enter at least one email address');
      }
      return;
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = trimmedEmails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      if (onError) {
        onError(`Invalid email format: ${invalidEmails.join(', ')}`);
      }
      return;
    }

    setSendingInvites(true);

    try {
      // Step 1: Save contributors to database
      const contributorsResponse = await fetch('/api/contributors/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: boardId,
          emails: trimmedEmails
        })
      });

      const contributorsResult = await contributorsResponse.json();

      if (!contributorsResponse.ok) {
        if (onError) {
          onError('Error saving invites: ' + contributorsResult.error);
        }
        setSendingInvites(false);
        return;
      }

      // Step 2: Send email invitations
      const emailResponse = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: trimmedEmails,
          boardTitle: boardTitle,
          recipientNames: recipientNames,
          boardLink: boardLink,
          customMessage: inviteMessage,
          creatorName: 'A contributor'
        })
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        if (onError) {
          onError(`Contributors saved, but failed to send emails: ${emailResult.error}`);
        }
        setSendingInvites(false);
        return;
      }

      // Success!
      if (onSuccess) {
        onSuccess(`Invites sent to ${trimmedEmails.length} email${trimmedEmails.length > 1 ? 's' : ''}! 🎉`);
      }

      // Reset and close
      setInviteEmails(['']);
      setInviteMessage(`Hi! I found this amazing group card for ${boardTitle}. Come add your message and make it even more special!`);
      setSendingInvites(false);
      onClose();

    } catch (error: any) {
      if (onError) {
        onError('Failed to send invites. Please try again.');
      }
      setSendingInvites(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="p-6 border-b border-[#E5EAF0] flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-[#0B1F2A]">🎉 Invite People</h2>
            <button
              onClick={onClose}
              className="text-[#5B6B75] hover:text-[#0B1F2A] text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="p-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setInviteTab('link')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  inviteTab === 'link'
                    ? 'bg-[#2CB1A6] text-white'
                    : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                }`}
              >
                📎 Link
              </button>
              <button
                onClick={() => setInviteTab('email')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  inviteTab === 'email'
                    ? 'bg-[#2CB1A6] text-white'
                    : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                }`}
              >
                ✉️ Email
              </button>
              <button
                onClick={() => setInviteTab('social')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  inviteTab === 'social'
                    ? 'bg-[#2CB1A6] text-white'
                    : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                }`}
              >
                🌐 Social
              </button>
              <button
                onClick={() => setInviteTab('qr')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  inviteTab === 'qr'
                    ? 'bg-[#2CB1A6] text-white'
                    : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                }`}
              >
                📱 QR Code
              </button>
            </div>

            {/* Link Tab */}
            {inviteTab === 'link' && (
              <div className="space-y-4">
                <p className="text-sm text-[#5B6B75]">Share this link with others to add their messages</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={boardLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copySuccess ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {inviteTab === 'email' && (
              <div className="space-y-4">
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
                  {sendingInvites ? 'Sending...' : 'Send Invites'}
                </button>
              </div>
            )}

            {/* Social Tab */}
            {inviteTab === 'social' && (
              <div className="space-y-4">
                <p className="text-sm text-[#5B6B75] mb-4">Share this board on social media</p>

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

                {/* Twitter/X */}
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://${boardLink}`)}&text=${encodeURIComponent(`Check out this group card: ${boardTitle}`)}`, '_blank')}
                  className="w-full flex items-center gap-4 p-4 bg-white border-2 border-[#E5EAF0] rounded-lg hover:border-[#000000] hover:bg-[#000000]/5 transition-colors group"
                >
                  <div className="w-12 h-12 bg-[#000000] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h5 className="font-bold text-[#0B1F2A]">Share on X (Twitter)</h5>
                    <p className="text-sm text-[#5B6B75]">Tweet to your followers</p>
                  </div>
                  <svg className="w-5 h-5 text-[#5B6B75] group-hover:text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="space-y-4 text-center">
                <p className="text-sm text-[#5B6B75]">Scan this QR code to access the board</p>
                <div className="bg-white border-2 border-[#E5EAF0] rounded-lg p-8 inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://${boardLink}`)}`}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`https://${boardLink}`)}`}
                  download="board-qr-code.png"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR Code
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}