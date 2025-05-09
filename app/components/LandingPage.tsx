'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccentColor, ACCENT_COLORS } from '../context/AccentColorContext';

// Add placeholder images for the background gallery
const PLACEHOLDER_IMAGES = [
  '/images/tattoo (1).png',
  '/images/tattoo (2).png',
  '/images/tattoo (3).png',
  '/images/tattoo (4).png',
  '/images/tattoo (5).png',
  '/images/tattoo (6).png',
  '/images/tattoo (7).png',
  '/images/tattoo (8).png',
  '/images/tattoo (9).png',
  '/images/tattoo (10).png',
];

const BackgroundGallery = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    window.addEventListener('storage', checkDark);
    window.addEventListener('classChange', checkDark);
    return () => {
      window.removeEventListener('storage', checkDark);
      window.removeEventListener('classChange', checkDark);
    };
  }, []);

  // Repeat images to fill the width
  const repeatedImages = Array(10)
    .fill(PLACEHOLDER_IMAGES)
    .flat();

  // Define mixed speed multipliers for each row (non-linear, varied)
  const ROW_SPEEDS = [1.2, 0.7, 1.5, 0.9, 1.8, 0.6, 1.35, 0.8, 1.65];

  return (
    <div className="fixed left-0 right-0 bottom-0 h-[900px] pointer-events-none z-0 overflow-hidden">
      <div className="absolute left-0 right-0 bottom-0 h-[900px] flex flex-col gap-4 py-2">
        {/* Render 9 rows */}
        {Array.from({ length: 9 }).map((_, rowIdx) => {
          // Offset images for each row to create a different sequence
          const offset = rowIdx % PLACEHOLDER_IMAGES.length;
          const rowImages = [
            ...repeatedImages.slice(offset),
            ...repeatedImages.slice(0, offset),
          ];
          return (
            <div
              key={`row${rowIdx}`}
              className="flex items-start gap-4 h-[120px]"
              style={{
                position: 'relative',
                width: '100%',

              }}
            >
              {/* First group of images */}
              <div
                className="flex items-end gap-4"
                style={{
                  animation: `scrolling${rowIdx} ${400 / ROW_SPEEDS[rowIdx]}s linear infinite`,
                }}
              >
                {rowImages.map((src, index) => (
                  <div key={`row${rowIdx}-${index}`} className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg mt-[5px]">
                    <Image
                      src={src}
                      alt={`Background image ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover opacity-70"
                      priority
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate group of images */}
              <div
                className="flex items-start gap-4"
                aria-hidden="true"
                style={{
                  animation: `scrolling${rowIdx} ${400 / ROW_SPEEDS[rowIdx]}s linear infinite`,
                }}
              >
                {rowImages.map((src, index) => (
                  <div key={`row${rowIdx}-dup-${index}`} className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg mt-[5px]">
                    <Image
                      src={src}
                      alt={`Background image ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover opacity-70"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Add dynamic keyframes for each row */}
      <style jsx>{`
        ${Array.from({ length: 9 }).map((_, rowIdx) => `
          @keyframes scrolling${rowIdx} {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `).join('')}
      `}</style>
      {/* Top fade overlay */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[900px] z-10"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0.2) 80%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,1) 60%, rgba(255,255,255,0.2) 80%, transparent 100%)',
        }}
      />
      {/* Bottom fade overlay */}
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-[900px] z-10"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(24,24,24,1) 0%, rgba(24,24,24,0.7) 10%, rgba(24,24,24,0.2) 30%, transparent 60%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 10%, rgba(255,255,255,0.2) 30%, transparent 60%)',
        }}
      />
    </div>
  );
};

interface LandingPageProps {
  onSubmit: (message: string, image: string) => void;
}

// Add these styles at the top of the file after the imports
const styles = `
  .form-border-container {
    position: relative;
    width: 100%;
    max-width: 28rem;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .border {
    position: absolute;
    inset: 0;
    width: 100%;
    max-width: 28rem;
    clip-path: inset(0 0 0 0 round 1rem);
    border-radius: 1rem;
    border: 2px solid #e5e7eb;
    background: transparent;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }
  .dark .border {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .trail {
    width: 120px;
    height: 12px;
    position: absolute;
    background: linear-gradient(90deg,
      var(--trail-accent, #3b82f6) 0%,
      rgba(var(--trail-rgb, 59,130,246), 0.7) 60%,
      transparent 100%
    );
    border-radius: 6px;
    filter: blur(2px) drop-shadow(0 0 24px var(--trail-accent, #3b82f6));
    offset-path: border-box;
    offset-anchor: 100% 50%;
    animation: journey 10s infinite linear;
    z-index: 2;
    pointer-events: none;
    transform: rotate(180deg);
    will-change: transform;
  }

  @keyframes journey {
    0% {
      offset-distance: 0%;
    }
    25% {
      offset-distance: 25%;
    }
    50% {
      offset-distance: 50%;
    }
    75% {
      offset-distance: 75%;
    }
    100% {
      offset-distance: 100%;
    }
  }

  .content {
    width: 100%;
    max-width: 28rem;
    background: rgba(255,255,255,0.8);
    color: #23272f;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
  }
  .dark .content {
    background: rgba(0, 0, 0, 0.5);
    color: #f3f4f6;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export default function LandingPage({ onSubmit }: LandingPageProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { accentColor } = useAccentColor();
  const [isDark, setIsDark] = useState(false);

  // Set the accent color for the trail effect
  useEffect(() => {
    const color = ACCENT_COLORS[accentColor]?.primary || '#3b82f6';
    // Convert hex to rgb for the glow
    function hexToRgb(hex: string) {
      const match = hex.replace('#', '').match(/.{1,2}/g);
      if (!match) return '59,130,246';
      const [r, g, b] = match.map(x => parseInt(x, 16));
      return `${r},${g},${b}`;
    }
    document.documentElement.style.setProperty('--trail-accent', color);
    document.documentElement.style.setProperty('--trail-rgb', hexToRgb(color));
  }, [accentColor]);

  // Inject styles on client side
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    window.addEventListener('storage', checkDark);
    window.addEventListener('classChange', checkDark);
    return () => {
      window.removeEventListener('storage', checkDark);
      window.removeEventListener('classChange', checkDark);
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setSelectedImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setIsLoading(true);
    onSubmit(input, selectedImage || '');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-0">
      <BackgroundGallery />
      <div className="relative z-10 w-full max-w-[98vw] sm:max-w-xl mx-auto px-0 sm:px-0 md:px-4">
        <div className="text-center mb-8">
          <h1
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[6rem] font-bold mb-4 vintage-title"
            style={{ color: isDark ? '#f3f4f6' : '#23272f' }}
          >
            Tattoo Preview
          </h1>
          <p
            className="text-lg vintage-title mt-8"
            style={{ color: isDark ? '#e5e7eb' : '#6b7280' }}
          >
            Transform your ideas into stunning tattoo designs
          </p>
        </div>
        {/* Instructions Section */}
        <div className="form-border-container mb-4">
          <div className="w-full text-sm instructions-tooltip">
            <ul className="list-disc list-inside text-left">
              <li>Upload a photo of yourself or where you want the tattoo.</li>
              <li>Describe the tattoo you want in the text box below.</li>
              <li>Click the arrow button to generate a tattoo preview.</li>
              <li>View and download your custom tattoo design!</li>
            </ul>
          </div>
        </div>
        <div className="initial-load-form">
          <div className="form-border-container">
            <div className="border">
              <div className="trail"></div>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-[99vw] sm:max-w-[28rem] mx-auto p-0 sm:p-4 content">
              {/* Upload button above chat input */}
              {!selectedImage && (
                <div className="flex items-center gap-2 mb-2">
                  <label className="upload-button">
                    <span className="material-icons text-sm mr-1">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              <div className="chat-input-container" style={{ position: 'relative', width: '100%' }}>
                {selectedImage && (
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={selectedImage}
                      alt="Selected image"
                      fill
                      className="object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the tattoo you want..."
                  className="chat-input text-sm sm:text-base"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="send-button"
                  aria-label="Send"
                >
                  {isLoading ? (
                    <span className="loading-spinner-icon"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Dark mode toggle - moved outside the form container */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              const isDark = document.documentElement.classList.contains('dark');
              if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              }
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('classChange'));
            }}
            className="p-2 rounded-full transition-colors bg-[#2a2a2a] hover:bg-[#3a3a3a] dark:bg-gray-200 dark:hover:bg-gray-300"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#2a2a2a]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 