import { useState, useEffect, useCallback } from 'react';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8001';
const ITEM_API_URL = import.meta.env.VITE_ITEM_API_URL || 'http://localhost:8002';

function ServiceCard({ name, icon, healthUrl, metricsUrl }) {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    
    try {
      const healthRes = await fetch(healthUrl);
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      } else {
        setHealth({ status: 'unhealthy' });
      }
    } catch {
      setHealth({ status: 'unreachable' });
    }

    if (metricsUrl) {
      try {
        const metricsRes = await fetch(metricsUrl);
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        } else {
          setMetrics(null);
        }
      } catch { 
        setMetrics(null);
      }
    }

    setLoading(false);
  }, [healthUrl, metricsUrl]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'unhealthy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const status = health?.status || 'unreachable';
  const statusColor = getStatusColor(status);

  return (
    <div className="status-card">
      <div className="status-card-header">
        <h3 className="status-card-title">{icon} {name}</h3>
        <span 
          className="status-badge" 
          style={{ 
            background: `${statusColor}20`, 
            color: statusColor,
            border: `1px solid ${statusColor}40`
          }}
        >
          {loading ? '⏳ Memuat...' : status}
        </span>
      </div>

      {metrics && !loading && (
        <div className="status-metrics">
          <div className="metric-grid">
            <div className="metric-item">
              <span className="metric-label">Total Requests</span>
              <span className="metric-value">{metrics.request_count || 0}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Errors</span>
              <span className="metric-value">{metrics.error_count || 0}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Error Rate</span>
              <span className="metric-value">{(metrics.error_rate * 100).toFixed(1)}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Uptime</span>
              <span className="metric-value">{metrics.uptime || '0m'}</span>
            </div>
          </div>
        </div>
      )}

      {!metrics && !loading && (
        <div className="status-no-metrics">
          <p>Metrics belum tersedia (backend perlu endpoint /metrics)</p>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  const [lastChecked, setLastChecked] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setLastChecked(new Date());
        setIsRefreshing(false);
      }, 800);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-page-container">
      <div className="status-header">
        <div>
          <h1 className="status-title">📊 System Status</h1>
          <p className="status-subtitle">
            Real-time health monitoring — Auto-refresh setiap 10 detik
          </p>
        </div>
        
        <div className="status-refresh-indicator">
          <span className={`refresh-dot ${isRefreshing ? 'pulsing' : ''}`} />
          <span className="refresh-text">
            Terakhir update: {lastChecked.toLocaleTimeString('id-ID')}
          </span>
        </div>
      </div>

      <div className="status-grid">
        <ServiceCard
          name="Backend API"
          icon="⚙️"
          healthUrl={`${AUTH_API_URL}/health`}
          metricsUrl={`${AUTH_API_URL}/custom-metrics`}
        />
        <ServiceCard
          name="Database"
          icon="🗄️"
          healthUrl={`${ITEM_API_URL}/health`}
          metricsUrl={`${ITEM_API_URL}/custom-metrics`}
        />
        {/* Frontend*/}
        <div className="status-card">
          <div className="status-card-header">
            <h3 className="status-card-title">🎨 Frontend</h3>
            <span 
              className="status-badge" 
              style={{ 
                background: '#10b98120', 
                color: '#10b981',
                border: '1px solid #10b98140'
              }}
            >
              LIVE
            </span>
          </div>
          
          <div className="status-metrics" style={{ marginTop: 'auto' }}>
            <div className="metric-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="metric-item">
                <span className="metric-label">Environment</span>
                <span className="metric-value" style={{ fontSize: '1rem' }}>Production</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Framework</span>
                <span className="metric-value" style={{ fontSize: '1rem' }}>React + Vite</span>
              </div>
              <div className="metric-item" style={{ gridColumn: 'span 2' }}>
                <span className="metric-label">Client Status</span>
                <span className="metric-value" style={{ fontSize: '0.975rem', color: '#3b82f6' }}>
                  (✓ ) Terhubung dan Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}