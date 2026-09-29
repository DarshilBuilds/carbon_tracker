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
    <Card className="gradient-card shadow-card hover-lift card-glow transition-all duration-300">
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
        <div className="flex items-center justify-between p-3 bg-muted/70 rounded-lg border border-border/50">
          <div>
            <p className="text-sm font-medium text-foreground">API Endpoint</p>
            <code className="text-xs text-muted-foreground font-mono">
              {status.baseUrl}
            </code>
          </div>
          <div className="relative flex h-3 w-3 items-center justify-center">
            {status.isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted-foreground/60" />
            )}
          </div>
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
