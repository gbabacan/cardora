"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import LottieAnimation from "@/components/LottieAnimation";
import { getAllLottieAnimations, groupAnimationsByOccasion, loadLottieAnimationData } from "@/lib/lotties";
import { getAllPatterns } from "@/lib/backgrounds";
import { createSolidBackground, createPatternBackground, createAnimationBackground } from "@/lib/backgrounds";
import { getOccasions } from "@/lib/occasions";
import type { LottieAnimation as LottieAnimationData } from "@/lib/lotties";
import type { Background, Pattern } from "@/lib/backgrounds";
import type { Occasion } from "@/lib/occasions";

// 50 Cool colors for web, ranging from white to black with main colors
// All colors are pastel/muted for better background suitability
const SOLID_COLORS = [
  // Whites and Light Grays (5)
  '#FFFFFF', '#F7FAFC', '#F0F4F8', '#E5EAF0', '#E2E8F0',

  // Pastels - Reds/Pinks (3)
  '#FFF5F5', '#FED7D7', '#FEB2B2',

  // Pastels - Oranges (3)
  '#FFFAF0', '#FEEBC8', '#FBD38D',

  // Pastels - Yellows (3)
  '#FFFFF0', '#FEFCBF', '#FAF089',

  // Pastels - Greens (3)
  '#F0FFF4', '#C6F6D5', '#9AE6B4',

  // Pastels - Teals/Cyans (3)
  '#E6FFFA', '#B2F5EA', '#81E6D9',

  // Pastels - Blues (3)
  '#EBF8FF', '#BEE3F8', '#90CDF4',

  // Pastels - Purples (3)
  '#FAF5FF', '#E9D8FD', '#D6BCFA',

  // Pastels - Pinks (3)
  '#FFF5F7', '#FED7E2', '#FBB6CE',

  // Brand Colors (Teals/Turquoise) (3)
  '#E8F5F4', '#A7E8E2', '#2CB1A6',

  // Soft Reds (2)
  '#FEE2E2', '#FECACA',

  // Soft Oranges (2)
  '#FFEDD5', '#FED7AA',

  // Soft Yellows (2)
  '#FEF3C7', '#FDE68A',

  // Soft Greens (2)
  '#D1FAE5', '#A7F3D0',

  // Soft Cyans (2)
  '#CFFAFE', '#A5F3FC',

  // Soft Blues (2)
  '#DBEAFE', '#BFDBFE',

  // Soft Purples (2)
  '#E0E7FF', '#C7D2FE',

  // Soft Pinks (2)
  '#FCE7F3', '#FBCFE8',

  // Grays and Darks (5)
  '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151'
];

// Darker variants for each color (for header usage)
const COLOR_DARKER_MAP: Record<string, string> = {
  // Whites and Light Grays
  '#FFFFFF': '#E5EAF0', '#F7FAFC': '#E2E8F0', '#F0F4F8': '#CBD5E0', '#E5EAF0': '#CBD5E0', '#E2E8F0': '#CBD5E0',

  // Pastels - Reds/Pinks
  '#FFF5F5': '#FED7D7', '#FED7D7': '#FEB2B2', '#FEB2B2': '#FC8181',

  // Pastels - Oranges
  '#FFFAF0': '#FEEBC8', '#FEEBC8': '#FBD38D', '#FBD38D': '#F6AD55',

  // Pastels - Yellows
  '#FFFFF0': '#FEFCBF', '#FEFCBF': '#FAF089', '#FAF089': '#F6E05E',

  // Pastels - Greens
  '#F0FFF4': '#C6F6D5', '#C6F6D5': '#9AE6B4', '#9AE6B4': '#68D391',

  // Pastels - Teals/Cyans
  '#E6FFFA': '#B2F5EA', '#B2F5EA': '#81E6D9', '#81E6D9': '#4FD1C5',

  // Pastels - Blues
  '#EBF8FF': '#BEE3F8', '#BEE3F8': '#90CDF4', '#90CDF4': '#63B3ED',

  // Pastels - Purples
  '#FAF5FF': '#E9D8FD', '#E9D8FD': '#D6BCFA', '#D6BCFA': '#B794F4',

  // Pastels - Pinks
  '#FFF5F7': '#FED7E2', '#FED7E2': '#FBB6CE', '#FBB6CE': '#F687B3',

  // Brand Colors (Teals/Turquoise)
  '#E8F5F4': '#A7E8E2', '#A7E8E2': '#2CB1A6', '#2CB1A6': '#1F8F86',

  // Soft Reds
  '#FEE2E2': '#FECACA', '#FECACA': '#FCA5A5',

  // Soft Oranges
  '#FFEDD5': '#FED7AA', '#FED7AA': '#FDBA74',

  // Soft Yellows
  '#FEF3C7': '#FDE68A', '#FDE68A': '#FCD34D',

  // Soft Greens
  '#D1FAE5': '#A7F3D0', '#A7F3D0': '#6EE7B7',

  // Soft Cyans
  '#CFFAFE': '#A5F3FC', '#A5F3FC': '#67E8F9',

  // Soft Blues
  '#DBEAFE': '#BFDBFE', '#BFDBFE': '#93C5FD',

  // Soft Purples
  '#E0E7FF': '#C7D2FE', '#C7D2FE': '#A5B4FC',

  // Soft Pinks
  '#FCE7F3': '#FBCFE8', '#FBCFE8': '#F9A8D4',

  // Grays and Darks
  '#D1D5DB': '#9CA3AF', '#9CA3AF': '#6B7280', '#6B7280': '#4B5563', '#4B5563': '#374151', '#374151': '#1F2937'
};

/**
 * Get darker variant of a color for header usage
 */
export function getDarkerColor(color: string): string {
  return COLOR_DARKER_MAP[color.toUpperCase()] || color;
}

type TabType = 'solid' | 'pattern' | 'animation';

interface BackgroundSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOccasion: string;
  onSelectBackground: (background: Background) => void;
  currentBackground?: Background | null;
  hideAnimations?: boolean; // Hide animation tab (for page backgrounds)
  onlyAnimations?: boolean; // Show only animations, hide patterns and solid colors (for card themes)
}

// Animation Card Component
function AnimationCard({
  animation,
  isSelected,
  onSelect,
  onHover
}: {
  animation: LottieAnimationData;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  // Intersection Observer to detect when card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before card enters viewport
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Load animation only when visible
  useEffect(() => {
    if (!isVisible) return;

    let mounted = true;

    const loadAnimation = async () => {
      const data = await loadLottieAnimationData(animation);
      if (mounted) {
        setAnimationData(data);
        setLoading(false);
      }
    };

    loadAnimation();

    return () => {
      mounted = false;
    };
  }, [animation, isVisible]);

  return (
    <button
      ref={cardRef}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`group relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${
        isSelected
          ? 'border-[#2CB1A6] bg-white'
          : 'border-[#E5EAF0] bg-white hover:border-[#2CB1A6]'
      }`}
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2CB1A6]"></div>
        </div>
      ) : animationData ? (
        <div className="absolute inset-0 p-2">
          <LottieAnimation
            animationData={animationData}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: animation.helper_color || '#2CB1A6' }}
            ></div>
            <p className="text-xs font-medium text-[#0B1F2A] line-clamp-2">
              {animation.name}
            </p>
          </div>
        </div>
      )}

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center shadow-lg z-10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function BackgroundSelectionPanel({
  isOpen,
  onClose,
  selectedOccasion,
  onSelectBackground,
  currentBackground,
  hideAnimations = false,
  onlyAnimations = false,
}: BackgroundSelectionPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    onlyAnimations ? 'animation' : hideAnimations ? 'pattern' : 'animation'
  );
  const [loading, setLoading] = useState(false);

  // Solid color state
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [previewColor, setPreviewColor] = useState<string | null>(null);

  // Pattern state
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [previewPattern, setPreviewPattern] = useState<Pattern | null>(null);
  const [visiblePatternsCount, setVisiblePatternsCount] = useState(20);
  const PATTERNS_PER_PAGE = 20;

  // Animation state
  const [animations, setAnimations] = useState<LottieAnimationData[]>([]);
  const [groupedAnimations, setGroupedAnimations] = useState<Record<string, LottieAnimationData[]>>({});
  const [selectedAnimation, setSelectedAnimation] = useState<LottieAnimationData | null>(null);
  const [previewAnimation, setPreviewAnimation] = useState<any>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState<string>('ALL');

  // Refs for scrolling to occasions
  const occasionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Reset visible patterns count when opening
      setVisiblePatternsCount(PATTERNS_PER_PAGE);
      // Set default occasion filter based on selectedOccasion
      if (selectedOccasion) {
        setSelectedOccasionFilter(selectedOccasion);
      } else {
        setSelectedOccasionFilter('ALL');
      }
    }
  }, [isOpen, selectedOccasion]);

  const loadData = async () => {
    setLoading(true);

    // Load occasions for ordering
    const { occasions: fetchedOccasions } = await getOccasions();
    if (fetchedOccasions) {
      setOccasions(fetchedOccasions);
    }

    // Load animations
    const { animations: fetchedAnimations } = await getAllLottieAnimations();
    if (fetchedAnimations) {
      setAnimations(fetchedAnimations);
      const grouped = groupAnimationsByOccasion(fetchedAnimations);
      setGroupedAnimations(grouped);
    }

    // Load patterns
    const { data: fetchedPatterns } = await getAllPatterns();
    if (fetchedPatterns) {
      setPatterns(fetchedPatterns);
    }

    setLoading(false);
  };

  const handleColorSelect = async (color: string) => {
    // Update preview immediately
    setSelectedColor(color);
    setPreviewColor(color);

    // Create solid background in database
    const { data, error } = await createSolidBackground(color);
    if (!error && data) {
      // Notify parent with the background including the color
      onSelectBackground(data);
    }

    // Close panel after selection
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handlePatternSelect = async (pattern: Pattern) => {
    setSelectedPattern(pattern);

    // Create pattern background and notify parent
    const { data, error } = await createPatternBackground(pattern.id);
    if (!error && data) {
      onSelectBackground(data);
      onClose();
    }
  };

  const handleAnimationSelect = async (animation: LottieAnimationData) => {
    setSelectedAnimation(animation);

    // Create animation background and notify parent
    const { data, error } = await createAnimationBackground(animation.id);
    if (!error && data) {
      onSelectBackground(data);
      onClose();
    }
  };

  const handleAnimationPreview = async (animation: LottieAnimationData) => {
    const animData = await loadLottieAnimationData(animation);
    setPreviewAnimation(animData);
  };

  const formatOccasionName = (occasion: string) => {
    return occasion
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Create a map of occasion_type/short_id to occasion for easy lookup
  const occasionMap = useMemo(() => {
    const map = new Map<string, Occasion>();
    occasions.forEach(occ => {
      map.set(occ.short_id, occ);
    });
    return map;
  }, [occasions]);

  // Order occasions by the occasions table order field
  const orderedOccasions = useMemo(() => {
    const occasionShortIds = Object.keys(groupedAnimations);

    // Sort by order field from occasions table
    return occasionShortIds.sort((a, b) => {
      const orderA = occasionMap.get(a)?.order ?? 999;
      const orderB = occasionMap.get(b)?.order ?? 999;
      return orderA - orderB;
    });
  }, [groupedAnimations, occasionMap]);

  // Handle occasion filter change and scroll
  const handleOccasionFilterChange = (occasionShortId: string) => {
    setSelectedOccasionFilter(occasionShortId);

    if (occasionShortId !== 'ALL' && occasionRefs.current[occasionShortId]) {
      // Scroll to the selected occasion
      occasionRefs.current[occasionShortId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else if (occasionShortId === 'ALL') {
      // Scroll to top
      const scrollContainer = document.getElementById('animations-scroll-container');
      scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle horizontal scroll for occasion rows
  const scrollOccasionRow = (occasionId: string, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[occasionId];
    if (container) {
      const scrollAmount = 400; // Scroll by ~2.5 cards (160px each + gap)
      const newScrollLeft = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] md:max-h-[90vh] flex overflow-hidden my-auto">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <div className="px-4 md:px-8 py-4 md:py-6 border-b border-[#E5EAF0] flex items-center justify-between bg-white">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-[#0B1F2A]">Select Background</h2>
              <p className="text-xs md:text-sm text-[#5B6B75] mt-1 hidden sm:block">Choose a proper background from our libraries</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#E5EAF0] bg-white">
            <div className="px-3 md:px-8 flex gap-0 md:gap-1">
              {!hideAnimations && (
                <button
                  onClick={() => setActiveTab('animation')}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold transition-all ${
                    activeTab === 'animation'
                      ? 'text-[#2CB1A6] border-b-2 border-[#2CB1A6]'
                      : 'text-[#5B6B75] hover:text-[#0B1F2A]'
                  }`}
                >
                  Animations
                </button>
              )}
              {!onlyAnimations && (
                <>
                  <button
                    onClick={() => setActiveTab('pattern')}
                    className={`flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold transition-all ${
                      activeTab === 'pattern'
                        ? 'text-[#2CB1A6] border-b-2 border-[#2CB1A6]'
                        : 'text-[#5B6B75] hover:text-[#0B1F2A]'
                    }`}
                  >
                    Patterns
                  </button>
                  <button
                    onClick={() => setActiveTab('solid')}
                    className={`flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold transition-all ${
                      activeTab === 'solid'
                        ? 'text-[#2CB1A6] border-b-2 border-[#2CB1A6]'
                        : 'text-[#5B6B75] hover:text-[#0B1F2A]'
                    }`}
                  >
                    Solid Color
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Occasion Filter - Fixed Section (Only for Animation Tab) */}
          {!loading && activeTab === 'animation' && (
            <div className="px-4 md:px-8 py-3 md:py-4 border-b border-[#E5EAF0] bg-white">
              <label className="block text-sm font-semibold text-[#0B1F2A] mb-2">Filter by Occasion</label>
              <select
                value={selectedOccasionFilter}
                onChange={(e) => handleOccasionFilterChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none text-[#0B1F2A] font-medium"
              >
                <option value="ALL">All Occasions</option>
                {orderedOccasions.map((occasionShortId) => {
                  const occasion = occasionMap.get(occasionShortId);
                  return (
                    <option key={occasionShortId} value={occasionShortId}>
                      {occasion?.name || formatOccasionName(occasionShortId)}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6" id="animations-scroll-container">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2CB1A6]"></div>
                  <p className="mt-4 text-[#5B6B75]">Loading backgrounds...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Solid Color Tab */}
                {activeTab === 'solid' && (
                  <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                    {SOLID_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        onMouseEnter={() => setPreviewColor(color)}
                        className={`group relative aspect-square rounded-lg transition-all hover:scale-110 ${
                          selectedColor === color || currentBackground?.color === color
                            ? 'ring-4 ring-[#2CB1A6] ring-offset-2'
                            : 'hover:ring-2 hover:ring-[#E5EAF0]'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {/* Checkered pattern for white/light colors */}
                        {['#FFFFFF', '#F7FAFC', '#F0F4F8'].includes(color) && (
                          <div
                            className="absolute inset-0 rounded-lg"
                            style={{
                              backgroundImage: `
                                repeating-conic-gradient(#E5EAF0 0% 25%, transparent 0% 50%)
                              `,
                              backgroundSize: '12px 12px',
                              opacity: 0.3
                            }}
                          />
                        )}

                        {/* Selected Badge */}
                        {(selectedColor === color || currentBackground?.color === color) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Pattern Tab */}
                {activeTab === 'pattern' && (
                  <div>
                    {patterns.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                          {patterns.slice(0, visiblePatternsCount).map((pattern) => (
                            <button
                              key={pattern.id}
                              onClick={() => handlePatternSelect(pattern)}
                              onMouseEnter={() => setPreviewPattern(pattern)}
                              className={`group relative aspect-square rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${
                                selectedPattern?.id === pattern.id || currentBackground?.pattern_id === pattern.id
                                  ? 'border-[#2CB1A6] ring-2 ring-[#2CB1A6] ring-offset-2'
                                  : 'border-[#E5EAF0] hover:border-[#2CB1A6]'
                              }`}
                            >
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `url(${pattern.file_path})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                                }}
                              />

                              {/* Selected Badge */}
                              {(selectedPattern?.id === pattern.id || currentBackground?.pattern_id === pattern.id) && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center shadow-lg">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Load More Button */}
                        {visiblePatternsCount < patterns.length && (
                          <div className="flex justify-center mt-8">
                            <button
                              onClick={() => setVisiblePatternsCount(prev => prev + PATTERNS_PER_PAGE)}
                              className="px-6 py-3 bg-transparent hover:bg-[#E8F5F4] text-[#2CB1A6] hover:text-[#1F8F86] rounded-lg font-medium transition-colors flex items-center gap-2 border-2 border-[#2CB1A6] hover:border-[#1F8F86]"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Load More ({Math.min(PATTERNS_PER_PAGE, patterns.length - visiblePatternsCount)} more)
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <svg className="w-16 h-16 text-[#E5EAF0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xl text-[#5B6B75] mb-2">No patterns available</p>
                        <p className="text-[#5B6B75]">Upload pattern images to get started</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Animation Tab */}
                {activeTab === 'animation' && (
                  <div className="space-y-8">
                    {orderedOccasions.map((occasion) => (
                      <div
                        key={occasion}
                        ref={(el) => { occasionRefs.current[occasion] = el; }}
                      >
                        {/* Occasion Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-lg font-bold text-[#0B1F2A]">
                            {occasionMap.get(occasion)?.name || formatOccasionName(occasion)}
                          </h3>
                          {occasion === selectedOccasion && (
                            <span className="px-3 py-1 bg-[#2CB1A6] text-white text-xs font-semibold rounded-full">
                              Your Selection
                            </span>
                          )}
                          <div className="flex-1 h-px bg-[#E5EAF0]"></div>
                        </div>

                        {/* Animations Row - Horizontal Scroll with Arrows */}
                        <div className="relative group">
                          {/* Left Arrow */}
                          <button
                            onClick={() => scrollOccasionRow(occasion, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#2CB1A6] text-[#0B1F2A] hover:text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Scroll left"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

                          {/* Right Arrow */}
                          <button
                            onClick={() => scrollOccasionRow(occasion, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-[#2CB1A6] text-[#0B1F2A] hover:text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Scroll right"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>

                          <div
                            ref={(el) => { scrollContainerRefs.current[occasion] = el; }}
                            className="overflow-x-auto pb-2 scrollbar-hide"
                          >
                            <div className="flex gap-4 w-max py-2 px-1">
                              {groupedAnimations[occasion].map((animation) => (
                                <div key={animation.id} className="flex-shrink-0 w-40">
                                  <AnimationCard
                                    animation={animation}
                                    isSelected={selectedAnimation?.id === animation.id || currentBackground?.lottie_animation_id === animation.id}
                                    onSelect={() => handleAnimationSelect(animation)}
                                    onHover={() => handleAnimationPreview(animation)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {animations.length === 0 && (
                      <div className="text-center py-16">
                        <svg className="w-16 h-16 text-[#E5EAF0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xl text-[#5B6B75] mb-2">No animations found</p>
                        <p className="text-[#5B6B75]">Add Lottie animations to your database</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Preview (hidden on mobile) */}
        <div className="hidden md:flex w-[500px] bg-[#F7FAFC] border-l border-[#E5EAF0] flex-col flex-shrink-0">
          <div className="p-6 border-b border-[#E5EAF0]">
            <h3 className="font-bold text-[#0B1F2A]">Preview</h3>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            {activeTab === 'solid' && previewColor && (
              <div className="w-full aspect-square rounded-lg border-2 border-[#E5EAF0] overflow-hidden relative">
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: previewColor }}
                />
                {/* Checkered pattern for white/light colors */}
                {['#FFFFFF', '#F7FAFC', '#F0F4F8'].includes(previewColor) && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        repeating-conic-gradient(#E5EAF0 0% 25%, transparent 0% 50%)
                      `,
                      backgroundSize: '20px 20px',
                      opacity: 0.3
                    }}
                  />
                )}
              </div>
            )}

            {activeTab === 'pattern' && previewPattern && (
              <div className="w-full aspect-square rounded-lg border-2 border-[#E5EAF0] overflow-hidden relative">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${previewPattern.file_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            )}

            {activeTab === 'animation' && previewAnimation ? (
              <div className="w-full aspect-square">
                <LottieAnimation
                  animationData={previewAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : activeTab === 'animation' && !previewAnimation && (
              <div className="text-center text-[#5B6B75]">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-sm">Hover over an animation to preview</p>
              </div>
            )}

            {!previewColor && !previewPattern && !previewAnimation && (
              <div className="text-center text-[#5B6B75]">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-sm">Select a background to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
