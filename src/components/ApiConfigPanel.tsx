import { RefreshCw, Server, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiStatus } from '@/types/emissions';

interface ApiConfigPanelProps {
  status: ApiStatus;
  isChecking: boolean;
  onCheckConnection: () => void;
}

export function ApiConfigPanel({ status, isChecking, onCheckConnection }: ApiConfigPanelProps) {
  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-lg">
          <Server className="w-5 h-5 text-primary" />
          Backend Configuration
        </CardTitle>
        <CardDescription>
          Connect to your Carbon Compass backend for full ML capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">API Endpoint</p>
            <code className="text-xs text-muted-foreground font-mono">
              {status.baseUrl}
            </code>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            status.isConnected ? 'bg-success animate-pulse' : 'bg-muted-foreground'
          }`} />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCheckConnection}
            disabled={isChecking}
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
          {status.lastCheck && (
            <span className="text-xs text-muted-foreground">
              Last checked: {status.lastCheck.toLocaleTimeString()}
            </span>
          )}
        </div>

        {!status.isConnected && (
          <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg space-y-2">
            <p className="text-sm font-medium text-warning">Demo Mode Active</p>
            <p className="text-xs text-muted-foreground">
              The app is running with simulated data. Deploy your Python backend and set 
              <code className="mx-1 px-1 py-0.5 bg-muted rounded text-xs">VITE_API_BASE_URL</code>
              to enable full TF-IDF matching.
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              View Python Backend Setup
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
