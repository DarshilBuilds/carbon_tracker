import { useState, useCallback, useEffect } from 'react';
import { ApiStatus } from '@/types/emissions';
import { API_CONFIG, getApiUrl } from '@/config/api';

export function useApiStatus() {
  const [status, setStatus] = useState<ApiStatus>({
    isConnected: false,
    lastCheck: null,
    baseUrl: API_CONFIG.baseUrl,
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(getApiUrl('health'), {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      setStatus({
        isConnected: response.ok,
        lastCheck: new Date(),
        baseUrl: API_CONFIG.baseUrl,
      });
    } catch {
      setStatus({
        isConnected: false,
        lastCheck: new Date(),
        baseUrl: API_CONFIG.baseUrl,
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkConnection]);

  return { status, isChecking, checkConnection };
}
