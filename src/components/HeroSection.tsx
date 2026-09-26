import { Leaf, Sparkles, ArrowDown } from 'lucide-react';

export function HeroSection() {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative gradient-hero py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-success/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Manufacturing Emissions Reporting</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Automate Your{' '}
            <span className="text-gradient">Carbon Accounting</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Upload activity data, review factor matches and units, and calculate CO₂e totals. 
            Connect the backend for semantic matching; demo mode uses deterministic keyword rules.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {[
              'Activity Mapping',
              'Emission Factor Library',
              'Unit Validation',
              'Visual Analytics',
            ].map((feature) => (
              <div 
                key={feature}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-sm"
              >
                <Leaf className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button 
            onClick={scrollToUpload}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            <span className="text-sm font-medium">Start Mapping</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
