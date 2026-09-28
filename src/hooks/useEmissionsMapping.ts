import { useState, useCallback } from 'react';
import { ActivityInput, MappingResult, EmissionsSummary } from '@/types/emissions';
import { getApiUrl, API_CONFIG } from '@/config/api';
import { safeMapDemoActivity } from '@/lib/demoMapping';

export function useEmissionsMapping() {
  const [results, setResults] = useState<MappingResult[]>([]);
  const [summary, setSummary] = useState<EmissionsSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processActivities = useCallback(async (
    activities: ActivityInput[],
    useApi: boolean = false
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      let mappingResults: MappingResult[];

      if (useApi) {
        try {
          // Dynamic timeout: at least API_CONFIG.timeout (120s), plus 50ms per activity for extra safety
          const dynamicTimeout = Math.max(API_CONFIG.timeout, activities.length * 50);

          const response = await fetch(getApiUrl('map'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activities }),
            signal: AbortSignal.timeout(dynamicTimeout),
          });

          if (!response.ok) {
            const payload = await response.json().catch(() => null);
            const detail = payload?.detail;
            const message = typeof detail === 'string'
              ? detail
              : Array.isArray(detail)
                ? detail.map(issue => issue.msg).join('; ')
                : 'API request failed';
            throw new Error(message);
          }

          mappingResults = await response.json();
        } catch (apiErr) {
          console.warn('Backend API timed out or unavailable, continuing with local mapping engine:', apiErr);
          mappingResults = activities.map(safeMapDemoActivity);
        }
      } else {
        // Use demo mode with simulated processing
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing delay
        
        mappingResults = activities.map(safeMapDemoActivity);
      }

      if (!mappingResults.length) {
        throw new Error('The mapping service returned no results.');
      }

      setResults(mappingResults);

      // Calculate summary
      const totalEmissions = mappingResults.reduce((sum, r) => sum + r.calculatedEmissions, 0);
      const avgConfidence = mappingResults.reduce((sum, r) => sum + r.confidenceScore, 0) / mappingResults.length;
      
      setSummary({
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        activityCount: mappingResults.length,
        avgConfidence: Math.round(avgConfidence),
        highConfidenceCount: mappingResults.filter(r => r.confidenceScore >= 80).length,
        lowConfidenceCount: mappingResults.filter(r => r.confidenceScore < 60).length,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process activities');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setSummary(null);
    setError(null);
  }, []);

  return {
    results,
    summary,
    isProcessing,
    error,
    processActivities,
    clearResults,
  };
}
