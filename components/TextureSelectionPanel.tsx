"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Texture {
  id: string;
  name: string;
  description: string;
  file_path: string;
  category: string;
}

interface TextureSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTexture: Texture | null;
  onSelectTexture: (texture: Texture | null) => void;
}

export default function TextureSelectionPanel({
  isOpen,
  onClose,
  selectedTexture,
  onSelectTexture
}: TextureSelectionPanelProps) {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadTextures();
    }
  }, [isOpen]);

  const loadTextures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('textures')
      .select('*')
      .order('category', { ascending: true });

    if (!error && data) {
      setTextures(data);
    }
    setLoading(false);
  };

  const categories = ['all', ...Array.from(new Set(textures.map(t => t.category)))];

  const filteredTextures = selectedCategory === 'all'
    ? textures
    : textures.filter(t => t.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Select Card Texture</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2CB1A6] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Textures Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading textures...</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {/* None option */}
              <button
                onClick={() => {
                  onSelectTexture(null);
                  onClose();
                }}
                className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                  !selectedTexture
                    ? 'border-[#2CB1A6] ring-2 ring-[#2CB1A6] ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">No Texture</p>
                  </div>
                </div>
              </button>

              {/* Texture options */}
              {filteredTextures.map(texture => (
                <button
                  key={texture.id}
                  onClick={() => {
                    onSelectTexture(texture);
                    onClose();
                  }}
                  className={`relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                    selectedTexture?.id === texture.id
                      ? 'border-[#2CB1A6] ring-2 ring-[#2CB1A6] ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={texture.file_path}
                    alt={texture.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-sm font-medium text-white">{texture.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}