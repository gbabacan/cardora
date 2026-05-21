"use client";

import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

interface RichTextEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditorPanel({
  isOpen,
  onClose,
  content,
  onChange
}: RichTextEditorPanelProps) {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (html: string) => {
    setLocalContent(html);
    onChange(html); // Update in real-time for preview
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Floating Panel */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Edit Message</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Editor */}
          <div className="p-4">
            <RichTextEditor
              content={localContent}
              onChange={handleChange}
              placeholder="Type your message here..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#2CB1A6] text-white rounded-lg hover:bg-[#25A094] transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}