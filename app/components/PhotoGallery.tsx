'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon, Moon, Sun, Plus } from 'lucide-react';
import { useAccentColor, ACCENT_COLORS, type AccentColor } from '../context/AccentColorContext';

interface PhotoGalleryProps {
  onImageClick: (image: string) => void;
  onReset: () => void;
  model: 'current' | 'google';
  setModel: React.Dispatch<React.SetStateAction<'current' | 'google'>>;
}

const MAX_STORED_IMAGES = 20; // Maximum number of images to store

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  theme 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  theme: 'light' | 'dark';
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div 
        className={`relative z-50 w-full max-w-md p-6 rounded-lg shadow-lg ${
          theme === 'light' 
            ? 'bg-white text-gray-900' 
            : 'bg-[#1a1a1a] text-gray-100'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Start New Chat?</h3>
        <p className="mb-6">Are you sure you want to start a new chat? The current chat will be deleted.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Start New Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom hook to ensure we only run on client side
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export default function PhotoGallery({ onImageClick, onReset, model, setModel }: PhotoGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { accentColor, setAccentColor } = useAccentColor();
  const isClient = useClientOnly();

  useEffect(() => {
    if (!isClient) return;
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(storedTheme);
    } else {
      // Default to dark mode if no theme is stored
      setTheme('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [isClient]);

  // Handle new images
  useEffect(() => {
    if (!isClient) return;
    const handleNewImage = (event: CustomEvent<string>) => {
      const newImage = event.detail;
      setImages(prev => {
        // Add new image and keep only the most recent MAX_STORED_IMAGES
        return [newImage, ...prev].slice(0, MAX_STORED_IMAGES);
      });
    };

    window.addEventListener('newGeneratedImage', handleNewImage as EventListener);

    return () => {
      window.removeEventListener('newGeneratedImage', handleNewImage as EventListener);
    };
  }, [isClient]);

  const toggleTheme = () => {
    if (!isClient) return;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      {/* Gallery Button and New Chat Button (always visible) */}
      {!isExpanded && (
        <div className="fixed right-4 top-4 flex flex-col gap-2 z-30">
          <div className="w-12 h-12 rounded-lg">
            <button
              onClick={() => setIsExpanded(true)}
              className="gallery-button"
              aria-label="Expand gallery"
            >
              <ImageIcon className="gallery-button-icon" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-lg">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="gallery-button"
              aria-label="Start new chat"
            >
              <Plus className="gallery-button-icon" />
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          onReset();
          setShowConfirmModal(false);
        }}
        theme={theme}
      />

      {/* Gallery Overlay (fades in/out) */}
      <div
        className={`gallery-overlay${isExpanded ? ' open' : ''}`}
        onClick={() => isExpanded && setIsExpanded(false)}
      >
        <div
          className="gallery-overlay-content"
          onClick={e => e.stopPropagation()}
        >
          {isExpanded && (
            <>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className={`p-1 rounded-full transition-colors ${
                      theme === 'light' 
                        ? 'bg-gray-100 hover:bg-gray-200' 
                        : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? (
                      <Moon className={`w-4 h-4 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`} />
                    ) : (
                      <Sun className="w-4 h-4 text-yellow-400" />
                    )}
                  </button>
                  {/* Download All button */}
                  {images.length > 0 && (
                    <button
                      onClick={() => {
                        images.forEach((img, idx) => {
                          const a = document.createElement('a');
                          a.href = img;
                          a.download = `tattoo-preview-${idx + 1}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        });
                      }}
                      className="ml-2 px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                      aria-label="Download all images"
                    >
                      Download All
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-1 rounded-full transition-colors ${
                    theme === 'light' 
                      ? 'bg-gray-100 hover:bg-gray-200' 
                      : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                  }`}
                  aria-label={isExpanded ? "Collapse gallery" : "Expand gallery"}
                >
                  <X className={`w-4 h-4 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`} />
                </button>
              </div>
              
              <div className="flex-1 px-4 pb-4 overflow-y-auto">
                {images.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center">No images generated yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => onImageClick(image)}
                      >
                        <Image
                          src={image}
                          alt={`Generated image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg border gallery-image"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 