"use client";

import { useState } from 'react';
import { Editor } from '@tiptap/react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface CompactRichTextToolbarProps {
  editor: Editor | null;
}

export default function CompactRichTextToolbar({ editor }: CompactRichTextToolbarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) {
    return null;
  }

  const fonts = [
    'Inter',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Comic Sans MS',
    'Pacifico',
    'Dancing Script',
    'Edu VIC WA NT Beginner',
    'Caveat',
    'Kalam',
    'Patrick Hand',
    'Indie Flower',
  ];

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
  ];

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '40', '48', '56', '64', '72'];

  const onEmojiClick = (emojiData: EmojiClickData) => {
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
  };

  const setFontSize = (size: string) => {
    (editor.chain().focus() as any).setFontSize(size).run();
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 flex flex-wrap gap-2 items-center relative">
      {/* Font Family */}
      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 cursor-pointer"
        style={{ minWidth: '100px' }}
      >
        <option value="">Edu</option>
        {fonts.map(font => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font.split(' ')[0]}
          </option>
        ))}
      </select>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Decrease Font Size */}
      <button
        onClick={() => {
          const currentSize = 18; // Default, you might want to track this
          setFontSize(String(Math.max(12, currentSize - 2)));
        }}
        className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-bold"
        title="Decrease font size"
      >
        −
      </button>

      {/* Font Size */}
      <select
        onChange={(e) => setFontSize(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 cursor-pointer"
        defaultValue="18"
      >
        {fontSizes.map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      {/* Increase Font Size */}
      <button
        onClick={() => {
          const currentSize = 18; // Default, you might want to track this
          setFontSize(String(Math.min(72, currentSize + 2)));
        }}
        className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-bold"
        title="Increase font size"
      >
        +
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        title="Bold"
      >
        <span className="font-bold text-xl">B</span>
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <span className="italic text-xl">I</span>
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive('underline') ? 'bg-gray-200' : ''
        }`}
        title="Underline"
      >
        <span className="underline text-xl">U</span>
      </button>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Text Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
          title="Text Color"
        >
          <span className="text-xl font-bold">A</span>
        </button>
        {showColorPicker && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowColorPicker(false)}
            />
            <div className="absolute bottom-full left-0 mb-2 p-3 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
              <div className="grid grid-cols-5 gap-2 mb-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="w-full px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Clear Color
              </button>
            </div>
          </>
        )}
      </div>

      {/* Emoji Picker */}
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Add Emoji"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {showEmojiPicker && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowEmojiPicker(false)}
            />
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          </>
        )}
      </div>

      {/* Text Color Button */}
      <button
        className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Text Color"
      >
        <span className="text-xl font-bold">T</span>
      </button>
    </div>
  );
}