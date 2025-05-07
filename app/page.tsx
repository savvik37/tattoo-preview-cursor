"use client";
import ChatInterface from './components/ChatInterface';
import { useState } from 'react';

export default function Home() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const handleInitialLoadChange = (value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(isInitialLoad) : value;
    setIsInitialLoad(newValue);
    if (!newValue) {
      // Delay showing the chat interface until the title fades out
      setTimeout(() => setShowChat(true), 700); // Match the duration of the title transition
    } else {
      setShowChat(false);
    }
  };

  return (
    <main className="min-h-screen">
      <h1
        className={`text-4xl font-bold text-center transition-all duration-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[180px] ${
          isInitialLoad ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
      </h1>
      <ChatInterface 
        isInitialLoad={isInitialLoad} 
        setIsInitialLoad={handleInitialLoadChange}
        showChat={showChat}
      />
    </main>
  );
}
