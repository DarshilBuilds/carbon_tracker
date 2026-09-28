import { Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  apiConnected: boolean;
}

export function Header({ apiConnected }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src="/carbon-compass.svg" alt="" className="w-10 h-10 rounded-xl shadow-glow" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Carbon Compass
              </h1>
              <p className="text-xs text-muted-foreground">
                Emissions Reporting
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              apiConnected
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
            }`}
          >
            <Zap className="w-3 h-3" />
            {apiConnected ? 'API Connected' : 'Demo Mode'}
          </div>
        </div>
      </div>
    </header>
  );
}
