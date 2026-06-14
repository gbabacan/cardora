"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import type { Effect } from "@/lib/effects";
import { getActiveEffects, loadEffectAnimationData } from "@/lib/effects";

interface EffectSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEffect: Effect | null;
  onSelectEffect: (effect: Effect | null) => void;
}

function EffectCard({
  effect,
  isSelected,
  onSelect,
}: {
  effect: Effect;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnimation = async () => {
      const data = await loadEffectAnimationData(effect);
      setAnimationData(data);
      setLoading(false);
    };

    loadAnimation();
  }, [effect]);

  return (
    <button
      onClick={onSelect}
      className={`relative rounded-lg overflow-hidden transition-all border-2 ${
        isSelected
          ? 'border-[#2CB1A6] ring-2 ring-[#2CB1A6] ring-opacity-50'
          : 'border-[#E5EAF0] hover:border-[#2CB1A6]'
      }`}
      style={{ aspectRatio: '1' }}
    >
      {loading ? (
        <div className="absolute inset-0 bg-[#F7FAFC] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2CB1A6]"></div>
        </div>
      ) : animationData ? (
        <div className="absolute inset-0 bg-white">
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#F7FAFC] flex items-center justify-center">
          <span className="text-[#5B6B75] text-xs">Failed to load</span>
        </div>
      )}

      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-[#2CB1A6] rounded-full p-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function EffectSelectionPanel({
  isOpen,
  onClose,
  selectedEffect,
  onSelectEffect,
}: EffectSelectionPanelProps) {
  const [effects, setEffects] = useState<Effect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadEffects();
    }
  }, [isOpen]);

  const loadEffects = async () => {
    setLoading(true);
    const { effects: effectsData, error } = await getActiveEffects();

    if (!error) {
      setEffects(effectsData);
    }

    setLoading(false);
  };

  const handleEffectSelect = (effect: Effect | null) => {
    onSelectEffect(effect);
    // Close panel after a short delay for visual feedback
    setTimeout(() => {
      onClose();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#E5EAF0] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1F2A]">Select Effect</h2>
            <p className="text-sm text-[#5B6B75] mt-1">Choose an overlay effect that plays when recipients view the board</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
          >
            <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* No Effect Option */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#0B1F2A] mb-3">No Effect</h3>
            <button
              onClick={() => handleEffectSelect(null)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                !selectedEffect
                  ? 'border-[#2CB1A6] bg-[#E8F5F4]'
                  : 'border-[#E5EAF0] hover:border-[#2CB1A6]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#0B1F2A] font-medium">None</span>
                {!selectedEffect && (
                  <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Effects Grid */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#0B1F2A] mb-3">Available Effects</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CB1A6]"></div>
            </div>
          ) : effects.length === 0 ? (
            <div className="text-center py-12 text-[#5B6B75]">
              <p>No effects available</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {effects.map((effect) => (
                <EffectCard
                  key={effect.id}
                  effect={effect}
                  isSelected={selectedEffect?.id === effect.id}
                  onSelect={() => handleEffectSelect(effect)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
