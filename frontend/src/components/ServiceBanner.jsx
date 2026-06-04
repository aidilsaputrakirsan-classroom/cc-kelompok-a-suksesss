import React from 'react';

export default function ServiceBanner({ type = 'network', onRetry }) {
  const config = {
    network: {
      icon: '🔌',
      title: 'Tidak Dapat Terhubung ke Server',
      message: 'Pastikan Docker sedang berjalan atau koneksi internet Anda stabil.',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.95)',  
      border: 'rgba(239, 68, 68, 0.4)',
    },
    auth: {
      icon: '🔐',
      title: 'Layanan Autentikasi Sedang Gangguan',
      message: 'Beberapa fitur (login, register, dashboard BK) mungkin tidak tersedia sementara.',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
    }
  };

    const current = config[type] || config.network;

  return (
    <div 
      className="service-banner" 
      style={{ 
        background: current.bg,
        borderBottomColor: current.border,
      }}
    >
      <span className="service-banner__icon">{current.icon}</span>
      <div className="service-banner__content">
        <div className="service-banner__title" style={{ color: current.color }}>
          {current.title}
        </div>
        <div className="service-banner__message">
          {current.message}
        </div>
      </div>
      {onRetry && (
        <button 
          className="service-banner__retry-btn" 
          onClick={onRetry}
        >
          🔄 Coba Lagi
        </button>
      )}
    </div>
  );
}