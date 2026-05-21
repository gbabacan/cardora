"use client";

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextAlign } from '@tiptap/extension-text-align';
import { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export default function RichTextEditor({ content, onChange, placeholder, compact = false }: RichTextEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        strike: false, // Disable strike to avoid conflicts
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
  });

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
    <div className={`w-full border-2 border-gray-300 rounded-lg bg-white ${compact ? 'text-sm' : ''}`}>
      {/* Toolbar */}
      <div className={`border-b border-gray-300 ${compact ? 'p-2' : 'p-3'} flex flex-wrap gap-2 items-center`}>
        {/* Font Family */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 cursor-pointer"
          style={{ minWidth: '120px' }}
        >
          <option value="">Default</option>
          {fonts.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300"></div>

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

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
          title="Bold"
        >
          <span className="font-bold text-lg">B</span>
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
          title="Italic"
        >
          <span className="italic text-lg">I</span>
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('underline') ? 'bg-gray-200' : ''
          }`}
          title="Underline"
        >
          <span className="underline text-lg">U</span>
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Text Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="Text Color"
          >
            <span className="text-lg font-bold">A</span>
            <div className="w-4 h-1 bg-current rounded"></div>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
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
          )}
        </div>

        {/* Emoji Picker */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add Emoji"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-2 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Clear Formatting */}
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear Formatting"
        >
          Clear Format
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={`prose max-w-none ${compact ? 'p-2 min-h-[100px]' : 'p-4 min-h-[200px]'} focus:outline-none`}
        placeholder={placeholder}
      />

      {/* Click outside to close pickers */}
      {(showEmojiPicker || showColorPicker) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowEmojiPicker(false);
            setShowColorPicker(false);
          }}
        />
      )}
    </div>
  );
}