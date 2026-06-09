"use client";

interface DeliveryMessagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  boardTitle: string;
  recipientNames: string[];
  deliveryMessage: string;
  boardLink: string;
  formatType?: 'board' | 'card';
  senderName?: string;
}

export default function DeliveryMessagePreview({
  isOpen,
  onClose,
  boardTitle,
  recipientNames,
  deliveryMessage,
  boardLink,
  formatType = 'board',
  senderName,
}: DeliveryMessagePreviewProps) {
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
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="bg-[#F7FAFC] border-b border-[#E5EAF0] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0B1F2A]">
                Email Preview
              </h2>
              <p className="text-sm text-[#5B6B75] mt-1">
                This is how your message will appear to recipients
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Email Preview Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Email Container */}
            <div className="p-8" style={{ backgroundColor: '#F7FAFC' }}>
              <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Logo */}
                <div className="text-center py-6 bg-white border-b border-[#E5EAF0]">
                  <h1 className="text-3xl font-bold text-[#2CB1A6]">Cardora</h1>
                </div>

                {/* Main Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-[#0B1F2A] text-center mb-6">
                    We have something special for you 💝
                  </h2>

                  {/* Board Info */}
                  <div className="bg-[#E8F5F4] rounded-lg p-5 mb-6">
                    <p className="text-lg font-bold text-[#0B1F2A] mb-2">
                      {boardTitle}
                    </p>
                    {formatType === 'card' && senderName && (
                      <p className="text-sm text-[#5B6B75] mb-1">
                        From: {senderName}
                      </p>
                    )}
                    <p className="text-sm text-[#5B6B75]">
                      For: {recipientNames.filter(r => r.trim()).join(', ')}
                    </p>
                  </div>

                  {/* Custom Message */}
                  {deliveryMessage && (
                    <div className="bg-[#F7FAFC] border-l-4 border-[#2CB1A6] p-4 mb-6">
                      <p className="text-sm font-bold text-[#0B1F2A] mb-2">
                        Personal Message:
                      </p>
                      <p className="text-sm text-[#5B6B75] leading-relaxed whitespace-pre-wrap">
                        {deliveryMessage}
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="text-center mb-6">
                    <div className="inline-block bg-[#2CB1A6] text-white font-bold px-8 py-4 rounded-lg cursor-default">
                      View Your Board
                    </div>
                  </div>

                  {/* Link */}
                  <p className="text-center text-sm text-[#5B6B75]">
                    Or copy and paste this link into your browser:<br />
                    <span className="text-[#2CB1A6] underline break-all">
                      https://{boardLink}
                    </span>
                  </p>
                </div>

                {/* Footer */}
                <div className="bg-[#F7FAFC] border-t border-[#E5EAF0] px-8 py-6 text-center">
                  <p className="text-xs text-[#5B6B75]">
                    © 2024 Cardora. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#F7FAFC] border-t border-[#E5EAF0] px-6 py-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}