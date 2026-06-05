// frontend/src/components/RetryButton.jsx
import React from 'react';

export default function RetryButton({ onRetry, isLoading = false, label = 'Coba Lagi' }) {
  return (
    <button 
      className="retry-btn" 
      onClick={onRetry} 
      disabled={isLoading}
    >
      {isLoading ? 'Memproses...' : `🔄 ${label}`}
    </button>
  );
}