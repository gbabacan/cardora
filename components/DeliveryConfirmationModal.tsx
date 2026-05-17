"use client";

interface DeliveryConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  recipientCount: number;
  isDelivering: boolean;
  formatType?: 'board' | 'card';
}

export default function DeliveryConfirmationModal({
  isOpen,
  onCancel,
  onConfirm,
  recipientCount,
  isDelivering,
  formatType = 'board'
}: DeliveryConfirmationModalProps) {
  if (!isOpen) return null;

  const formatName = formatType === 'board' ? 'board' : 'card';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-100">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-[#FFF4E6] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#0B1F2A] text-center mb-4">
            Confirm Delivery
          </h2>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-[#5B6B75] text-center text-base">
              You are about to deliver this {formatName} to <span className="font-bold text-[#0B1F2A]">{recipientCount} recipient{recipientCount > 1 ? 's' : ''}</span>.
            </p>

            {/* Warning Points */}
            <div className="bg-[#FFF4E6] border-2 border-[#F59E0B] rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-[#92400E] font-medium">
                  Recipients will be notified immediately via email
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <p className="text-sm text-[#92400E] font-medium">
                  No one will be able to add new messages after delivery
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-[#92400E] font-medium">
                  The {formatName} will become read-only and cannot be edited
                </p>
              </div>
            </div>

            <p className="text-[#5B6B75] text-center text-sm font-medium">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDelivering}
              className="flex-1 px-6 py-3 bg-white border-2 border-[#E5EAF0] text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              disabled={isDelivering}
              className="flex-1 px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDelivering ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Delivering...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Delivery
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}