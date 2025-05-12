'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PhotoGallery from './PhotoGallery';
import LandingPage from './LandingPage';
import './ChatInterface.css';
import { X, Download } from 'lucide-react';
import { useAccentColor, ACCENT_COLORS } from '../context/AccentColorContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

interface ChatInterfaceProps {
  isInitialLoad: boolean;
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  showChat: boolean;
}

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="loading-message">
      <div className="flex items-center gap-2">
        <div className="loading-spinner-icon"></div>
        <p>Generating your tattoo design...</p>
      </div>
    </div>
  </div>
);

const ImagePreview = ({ src, onClose }: { src: string; onClose: () => void }) => {
  // Download handler for the download button
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = src;
    a.download = 'tattoo-preview.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div 
      className="image-preview"
      onClick={onClose}
    >
      <div 
        className="image-preview-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="image-preview-btn image-preview-exit absolute -top-3 -right-3"
          aria-label="Close preview"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
        {/* Download button */}
        <button
          onClick={handleDownload}
          className="image-preview-btn image-preview-download absolute -top-3 right-8"
          aria-label="Download image"
          type="button"
        >
          <Download className="w-4 h-4" />
        </button>
        <Image
          src={src}
          alt="Image preview"
          fill
          className="object-contain rounded-lg"
          priority
        />
      </div>
    </div>
  );
};

export default function ChatInterface({ isInitialLoad, setIsInitialLoad, showChat }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const originalImageRef = useRef<string | null>(null);
  const [model, setModel] = useState<'current' | 'google'>('current');
  const { accentColor, setAccentColor } = useAccentColor();

  // Set accent color based on model
  useEffect(() => {
    if (model === 'google') setAccentColor('blue');
    else setAccentColor('white');
  }, [model, setAccentColor]);

  const handleReset = () => {
    setMessages([]);
    setInput('');
    setSelectedImage(null);
    setLastGeneratedImage(null);
    setPreviewImage(null);
    originalImageRef.current = null;
    setIsInitialLoad(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      originalImageRef.current = imageData; // Store the original image
      setLastGeneratedImage(imageData); // Ensure uploaded image is used for next generation
    };
    reader.readAsDataURL(file);
  };

  const handleToggleModel = () => setModel(m => m === 'current' ? 'google' : 'current');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setIsInitialLoad(false);
    const newMessage: Message = {
      role: 'user',
      content: input,
      image: messages.length === 0 && selectedImage ? selectedImage : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use selectedImage as a fallback if lastGeneratedImage is not available
      const imageToUse = messages.length === 0 ? originalImageRef.current : lastGeneratedImage || selectedImage;
      
      if (!imageToUse) {
        throw new Error('No image available for generation');
      }

      // Choose the API endpoint based on the selected model
      const endpoint = model === 'google' ? '/api/google-chat' : '/api/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          image: imageToUse,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: prev.filter(m => m.role === 'assistant').length === 0
            ? 'Tattoo generated! You can download your images by accessing the gallery on the top right of the screen or by clicking any image you see, then download on the top right.'
            : data.message,
          image: data.image,
        },
      ]);
      
      // Update the last generated image
      setLastGeneratedImage(data.image);

      // Emit the new image to be stored in the gallery
      if (data.image) {
        window.dispatchEvent(new CustomEvent('newGeneratedImage', { detail: data.image }));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Failed to generate image',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLandingPageSubmit = async (message: string, image: string, landingPageModel: 'current' | 'google') => {
    setSelectedImage(image);
    originalImageRef.current = image;
    setInput(message);
    setIsInitialLoad(false);
    setModel(landingPageModel); // Set the model from landing page
    
    // Add the initial user message
    const newMessage: Message = {
      role: 'user',
      content: message,
      image: image,
    };
    setMessages([newMessage]);
    setIsLoading(true);

    try {
      // Choose the API endpoint based on the selected model
      const endpoint = landingPageModel === 'google' ? '/api/google-chat' : '/api/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          image: image,
          conversationHistory: []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: prev.filter(m => m.role === 'assistant').length === 0
            ? 'Tattoo generated! You can download your images by accessing the gallery on the top right of the screen or by clicking any image you see, then download on the top right.'
            : data.message,
          image: data.image,
        },
      ]);
      
      // Update the last generated image
      setLastGeneratedImage(data.image);

      // Emit the new image to be stored in the gallery
      if (data.image) {
        window.dispatchEvent(new CustomEvent('newGeneratedImage', { detail: data.image }));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Failed to generate image',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-interface ${isInitialLoad ? 'initial-load' : ''}`} style={{ backgroundColor: 'var(--background)' }}>
      {isInitialLoad ? (
        <LandingPage onSubmit={handleLandingPageSubmit} />
      ) : showChat && (
        <>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role}${message.role === 'user' && accentColor === 'white' ? ' openai-user-message' : ''}`}
              >
                <div className="message-content">
                  {message.image && (
                    <div 
                      className="message-image"
                      onClick={() => message.image && setPreviewImage(message.image)}
                    >
                      <Image
                        src={message.image}
                        alt="Generated image"
                        width={280}
                        height={280}
                      />
                    </div>
                  )}
                  <p className="message-text">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && <LoadingSpinner />}
            <div ref={messagesEndRef} />
          </div>

          {previewImage && (
            <ImagePreview
              src={previewImage}
              onClose={() => setPreviewImage(null)}
            />
          )}

          {/* Model label above chat input */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button
              onClick={handleToggleModel}
              className="model-label-button"
              style={{ 
                fontSize: '0.7rem', 
                color: '#888', 
                fontWeight: 500, 
                marginBottom: '0.25rem', 
                marginRight: '0.25rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                transition: 'all 0.2s ease',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = model === 'google' ? '#2563eb' : '#4c754c';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888';
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label="Toggle model"
            >
              Model: {model === 'google' ? 'Google Gemini' : 'OpenAI DALL·E'}
            </button>
          </div>
          <form 
            onSubmit={handleSubmit} 
            className="w-full mt-4"
          >
            {!selectedImage && (
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="upload-button">
                  <span className="material-icons text-lg mr-1"></span> Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

              </div>
            )}

            <div className="chat-input-container" style={accentColor === 'white' ? { background: '#fff', border: '1px solid #e5e7eb' } : {}}>
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
                style={accentColor === 'white' ? { color: '#23272f' } : {}}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`send-button${accentColor === 'white' ? ' openai-send-button' : ''}`}
                aria-label="Send"
                style={accentColor === 'white' ? { background: '#fff', color: '#23272f', border: '1px solid #e5e7eb' } : {}}
              >
                {isLoading ? (
                  <span className="loading-spinner-icon"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={accentColor === 'white' ? '#23272f' : 'currentColor'} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                )}
              </button>
            </div>
          </form>

          <PhotoGallery onImageClick={setPreviewImage} onReset={handleReset} model={model} setModel={setModel} />
        </>
      )}
    </div>
  );
}