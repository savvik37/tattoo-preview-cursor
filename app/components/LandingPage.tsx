'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccentColor, ACCENT_COLORS } from '../context/AccentColorContext';

// Add placeholder images for the background gallery
const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/800/600?random=1',
  'https://picsum.photos/800/600?random=2',
  'https://picsum.photos/800/600?random=3',
  'https://picsum.photos/800/600?random=4',
  'https://picsum.photos/800/600?random=5',
];

const BackgroundGallery = () => {
  const [position, setPosition] = useState(0);
  const imageWidth = 120; // Width of each image
  const totalWidth = PLACEHOLDER_IMAGES.length * imageWidth;

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        const newPosition = prev + 1;
        // Reset position when we've scrolled one full image width
        // This creates the illusion of infinite scroll
        if (newPosition >= imageWidth) {
          return 0;
        }
        return newPosition;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Repeat images to fill the width
  const repeatedImages = Array(10)
    .fill(PLACEHOLDER_IMAGES)
    .flat();

  // Define mixed speed multipliers for each row (non-linear, varied)
  const ROW_SPEEDS = [1.2, 0.7, 1.5, 0.9, 1.8, 0.6, 1.35, 0.8, 1.65];

  return (
    <div className="fixed left-0 right-0 bottom-0 h-[1120px] pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute left-0 right-0 bottom-0 h-[1120px] flex flex-col gap-4"
        style={{
          transform: `translateX(-${position}px)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {/* Render 9 rows */}
        {Array.from({ length: 9 }).map((_, rowIdx) => (
          <div
            key={`row${rowIdx}`}
            className="flex items-end gap-4"
            style={{
              transform: `translateX(-${position * ROW_SPEEDS[rowIdx]}px)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {repeatedImages.map((src, index) => (
              <div key={`row${rowIdx}-${index}`} className="relative w-[120px] h-[120px] flex-shrink-0">
                <Image
                  src={src}
                  alt={`Background image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg opacity-70"
                  priority
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Top fade overlay */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[1120px] z-10" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0.2) 80%, transparent 100%)'
      }} />
      {/* Bottom fade overlay */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-[1120px] z-10" style={{
        background: 'linear-gradient(to bottom, rgba(24,24,24,1) 0%, rgba(24,24,24,0.7) 10%, rgba(24,24,24,0.2) 30%, transparent 60%)'
      }} />
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
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    z-index: 1;
    pointer-events: none;
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
  }

  @keyframes journey {
    to {
      offset-distance: 100%;
    }
  }

  .content {
    width: 100%;
    max-width: 28rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
  }
`;

// Add this after the styles constant
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default function LandingPage({ onSubmit }: LandingPageProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { accentColor } = useAccentColor();

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
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundGallery />
      <div className="relative z-10 w-full max-w-[98vw] sm:max-w-xl mx-auto px-1 sm:px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Tattoo Preview</h1>
          <p className="text-lg text-gray-200">Transform your ideas into stunning tattoo designs</p>
        </div>
        {/* Instructions Section */}
        <div className="form-border-container mb-4">
          <div
            className="w-full text-sm"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '1.5rem',
            }}
          >
            <ul className="list-disc list-inside text-gray-100 text-left">
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
            <form onSubmit={handleSubmit} className="w-full max-w-[98vw] sm:max-w-[28rem] mx-auto p-2 sm:p-4 content">
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
                  className="chat-input"
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
      </div>
    </div>
  );
} 