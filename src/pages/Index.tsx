import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { FileUploader } from '@/components/FileUploader';
import { EmissionsSummary } from '@/components/EmissionsSummary';
import { MappingResultsTable } from '@/components/MappingResultsTable';
import { EmissionsChart } from '@/components/EmissionsChart';
import { ApiConfigPanel } from '@/components/ApiConfigPanel';
import { useApiStatus } from '@/hooks/useApiStatus';
import { useEmissionsMapping } from '@/hooks/useEmissionsMapping';
import { ActivityInput } from '@/types/emissions';
import { AlertTriangle, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadResultsCsv } from '@/lib/exportResults';

const Index = () => {
  const { status, isChecking, checkConnection } = useApiStatus();
  const { results, summary, isProcessing, error, processActivities, clearResults } = useEmissionsMapping();
  const [hasProcessed, setHasProcessed] = useState(false);

  const handleUpload = useCallback((activities: ActivityInput[]) => {
    processActivities(activities, status.isConnected);
    setHasProcessed(true);
  }, [processActivities, status.isConnected]);

  const handleReset = useCallback(() => {
    clearResults();
    setHasProcessed(false);
  }, [clearResults]);

  return (
    <div className="min-h-screen bg-background">
      <Header apiConnected={status.isConnected} />
      
      <main>
        <div id="upload-section" className="container mx-auto px-4 py-8 space-y-8">
          {/* Error display */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm animate-fade-in">
              {error}
            </div>
          )}

          {!hasProcessed || !results.length ? (
            /* Upload Section */
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FileUploader onUpload={handleUpload} isProcessing={isProcessing} />
              </div>
              <div>
                <ApiConfigPanel 
                  status={status} 
                  isChecking={isChecking} 
                  onCheckConnection={checkConnection} 
                />
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-8 animate-fade-in">
              {/* Reset button */}
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => downloadResultsCsv(results)}>
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                  New Analysis
                </Button>
              </div>

              <div role="note" className="flex items-start gap-3 border-l-4 border-warning bg-warning/5 px-4 py-3 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p>Factor values are for demonstration. Verify each factor’s source, region, and reporting year before compliance use.</p>
              </div>

              {/* Summary Cards */}
              {summary && <EmissionsSummary summary={summary} />}

              {/* Charts */}
              <EmissionsChart results={results} />

              {/* Results Table */}
              <MappingResultsTable results={results} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Carbon Compass — Emissions Reporting for Manufacturing
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Built with React • Designed for your Python backend
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
