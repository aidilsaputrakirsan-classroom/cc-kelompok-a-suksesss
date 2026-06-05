// frontend/src/hooks/useServiceHealth.js
import { useState, useEffect, useCallback } from 'react';

export function useServiceHealth(apiUrl) {
  const [healthStatus, setHealthStatus] = useState({
    network: 'ok', // 'ok' atau 'down'
  });

  const checkHealth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 detik timeout

      const response = await fetch(`${apiUrl}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        setHealthStatus({ network: 'ok' });
      } else {
        setHealthStatus({ network: 'down' });
      }
    } catch (error) {
      // Jika fetch gagal (network error / abort), berarti service down
      setHealthStatus({ network: 'down' });
    }
  }, [apiUrl]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Cek setiap 30 detik
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { healthStatus, checkHealth };
}