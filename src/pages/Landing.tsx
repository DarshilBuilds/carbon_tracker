import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowDown,
  Github,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Upload,
  RefreshCw,
  Cpu,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Server,
  Lock,
  Zap,
  Leaf,
  Database,
  Check,
  Menu,
  X,
  Play,
  Video,
  ExternalLink,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

/* =========================================================================
   CONFIG & COPY CONSTANTS
   ========================================================================= */

export const PLACEHOLDER_LINK = 'https://drive.google.com/file/d/1mJDx824gn51HnSGhMnw96GMj5L6xQry4/view?usp=sharing';
export const DEMO_VIDEO_SRC = 'https://drive.google.com/file/d/1RQpC3cbL8r9ILkGE85hUh91sbNSWXzsy/view?usp=sharing';

export const COPY = {
  tagline: 'Turn messy plant data into carbon reports.',
  hero: {
    eyebrow: 'Manufacturing Emissions Reporting',
    title: 'Automate Your Carbon Accounting',
    subtitle:
      'Upload activity data, review factor matches and units, and calculate CO₂e totals. Connect the backend for semantic matching; demo mode uses deterministic keyword rules.',
    primaryCta: 'Try the demo',
    secondaryCta: 'View on GitHub',
  },
  proofStrip: [
    { value: '20', label: 'EPA categories pre-configured' },
    { value: '384-dim', label: 'semantic embeddings' },
    { value: 'MIT', label: 'licensed open source' },
    { value: 'Zero', label: 'server-side data storage' },
    { value: '< 1 min', label: 'first result in under a minute' },
  ],
  problem: {
    headline: 'Carbon reporting breaks on messy data.',
    subheadline:
      'Manufacturing facilities capture activity records across disparate maintenance logs, meter readings, and ERP exports.',
    cards: [
      {
        title: 'Semantic inconsistency',
        description:
          'One plant writes "diesel for forklifts", another "off-road red diesel"; rule-based tools and regex fail on wording differences, so teams reconcile by hand.',
      },
      {
        title: 'Costly legacy platforms',
        description:
          'Enterprise ESG tools are built for corporate headquarters, requiring months of custom onboarding and expensive annual subscription contracts.',
      },
      {
        title: 'Data privacy concerns',
        description:
          'Industrial manufacturers cannot risk uploading proprietary facility throughput and operational energy logs to multi-tenant public cloud providers.',
      },
    ],
  },
  howItWorks: [
    {
      step: '01',
      title: 'Upload',
      description:
        'Drop a CSV. It is parsed entirely in-browser, byte order marks (BOM) stripped, column headers normalized, and positive quantities validated.',
    },
    {
      step: '02',
      title: 'Match',
      description:
        'Activity text is converted to 384-dim embeddings and compared to 20 EPA factor categories by cosine similarity; each row receives a 0-100 confidence score.',
    },
    {
      step: '03',
      title: 'Validate',
      description:
        'Units are normalized and validated against the matched factor definition. Mismatches generate explicit guardrail warnings instead of wrong numbers.',
    },
    {
      step: '04',
      title: 'Report',
      description:
        'kg CO2e is calculated (Quantity × EPA Factor), emission hotspots are charted, and reconcilable results export to audit-friendly CSV with UTF-8 BOM.',
    },
  ],
  features: [
    {
      title: 'Semantic activity resolution',
      desc: 'Matches varied plant phrasing to 20 official EPA categories using 384-dimensional vector embeddings.',
      icon: Sparkles,
    },
    {
      title: 'Fast batch processing',
      desc: 'Vectorized NumPy matrix multiplications execute thousands of activity comparisons in milliseconds on commodity CPU hardware.',
      icon: Zap,
    },
    {
      title: 'Cross-dimensional unit validation',
      desc: 'Checks uploaded units against category standards, flagging assumed units and preventing erroneous arithmetic.',
      icon: ShieldCheck,
    },
    {
      title: 'Hotspot and distribution analytics',
      desc: 'Instant visual breakdown of facility emissions by activity and fuel categories.',
      icon: BarChart3,
    },
    {
      title: 'Tri-tier confidence scoring',
      desc: 'Categorizes matches into High (≥80%), Medium (60–79%), and Low (<60%) so EHS reviewers prioritize ambiguous rows.',
      icon: CheckCircle2,
    },
    {
      title: 'Offline demo mode',
      desc: 'Integrated keyword-based local fallback engine functions even when the Python neural backend is unreachable (note: local fallback, not AI model).',
      icon: Server,
    },
    {
      title: 'One-click CSV export',
      desc: 'Generates RFC-compliant UTF-8 BOM CSV files ready for external compliance auditors and ERP reconciliation.',
      icon: FileSpreadsheet,
    },
    {
      title: 'Built-in test datasets',
      desc: 'Includes a 1,000-row multi-facility benchmark plus 4,500 real UCI electricity observations for immediate verification.',
      icon: Database,
    },
  ],
  privacy: {
    headline: 'Your data stays yours.',
    subheadline:
      'Engineered for security-conscious industrial environments with strict data governance mandates.',
    points: [
      'Stateless, in-memory processing with zero server-side persistence or database logging.',
      'Runs locally or in a private VPC on commodity CPU hardware (~80MB model, no expensive GPUs required).',
      'Works in air-gapped manufacturing environments via integrated offline fallback mode.',
      'Permissive MIT open-source license with zero vendor lock-in or proprietary hooks.',
    ],
  },
  personas: [
    {
      role: 'Plant EHS & Compliance Managers',
      pain: 'Hours lost looking up EPA emission factors and resolving unit discrepancies across plant logs.',
      solution:
        'Upload raw monthly meter logs and receive categorized CO2e summaries with full factor audit trails in seconds.',
    },
    {
      role: 'VPs of Operations & Plant GMs',
      pain: 'Enterprise customer requests for carbon intensity data without budget for six-figure corporate ESG software.',
      solution:
        'Generate audit-friendly carbon disclosures using self-hosted open-source software with zero per-seat fees.',
    },
    {
      role: 'ESG Auditors & Sustainability Consultants',
      pain: 'Cleaning and standardizing messy client CSV files with inconsistent phrasing and mixed units.',
      solution:
        'Standardize disparate client activity lines into reconciled EPA categories with transparent confidence ratings.',
    },
  ],
  regulatory: {
    banner:
      'Built for teams preparing data for frameworks like EU CSRD, EU CBAM, California SB 253/261 and the EPA GHG Reporting Program.',
    disclaimer:
      'Carbon Compass helps prepare emissions data. It does not certify compliance.',
  },
  roadmap: [
    {
      phase: 'Near-term',
      items: [
        'Additional emission registries: DEFRA, IPCC, and IEA factors',
        'eGRID sub-regional electricity factor resolution',
        'Editable match overrides with custom coefficient adjustments',
        'Direct .xlsx and JSON batch ingestion',
      ],
    },
    {
      phase: 'Mid-term',
      items: [
        'Direct SCADA, MQTT, and Modbus meter protocol ingestion',
        'PostgreSQL storage with multi-tenant role-based access control (RBAC)',
        'Scope 3 upstream supplier upload portal',
        'Automated regulatory reporting filing templates',
      ],
    },
    {
      phase: 'Long-term',
      items: [
        'Decarbonization pathway and capital equipment ROI copilot',
        'Mobile operational meter-scanning application',
        'Zero-knowledge compliance attestations for supply chain audits',
      ],
    },
  ],
  faq: [
    {
      q: 'Are the emission factors official?',
      a: 'The bundled 20 factors are demonstration values derived from standard references; always verify coefficients, vintage year, and geography against official EPA or local regulatory registries before submitting compliance reports.',
    },
    {
      q: 'Does it convert units (BTU, gallons)?',
      a: "Not yet. Carbon Compass validates and normalizes common unit aliases, but uploaded units must align dimensionally with the factor category's expected measurement unit (e.g. liters for mobile diesel).",
    },
    {
      q: 'What does the confidence score mean?',
      a: 'The confidence score is a cosine-similarity-based semantic ranking aid (scaled 0–100) to help reviewers prioritize ambiguous rows. It is an algorithmic proximity score, not a calibrated statistical probability.',
    },
    {
      q: 'Does my data leave my server?',
      a: 'No. Carbon Compass processes data entirely in-memory with zero server-side persistence. When self-hosted, all processing occurs within your own infrastructure or local workstation.',
    },
    {
      q: 'Is it free?',
      a: 'Yes. The core codebase is 100% open source under the permissive MIT license, allowing unrestricted commercial use and private deployment without per-seat or data-volume fees.',
    },
    {
      q: 'What if the backend is offline?',
      a: 'The application contains an offline fallback engine that maps activities using keyword matching directly inside the browser, allowing demonstration workflows to continue uninterrupted.',
    },
  ],
};

/* =========================================================================
   CLEAN, AUTHENTIC B2B LANDING PAGE
   ========================================================================= */

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isGoogleDrive = DEMO_VIDEO_SRC.includes('drive.google.com');
  const googleDrivePreview = isGoogleDrive
    ? DEMO_VIDEO_SRC.replace(/\/view(\?.*)?$/, '/preview')
    : '';

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans">
      {/* =========================================================================
          1. STICKY NAVBAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-card/95 border-b border-border backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/carbon-compass.svg" alt="Carbon Compass" className="h-9 w-9 rounded-xl shadow-xs" />
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground block leading-tight">
                Carbon Compass
              </span>
              <span className="text-[11px] text-primary font-medium">
                Emissions Reporting
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-primary transition-colors">
              How it works
            </button>
            <button onClick={() => scrollTo('features')} className="hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo('privacy')} className="hover:text-primary transition-colors">
              Privacy
            </button>
            <button onClick={() => scrollTo('compare')} className="hover:text-primary transition-colors">
              Compare
            </button>
            <button onClick={() => scrollTo('faq')} className="hover:text-primary transition-colors">
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={PLACEHOLDER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors shadow-xs"
            >
              <Github className="h-3.5 w-3.5 text-muted-foreground" />
              <span>GitHub</span>
            </a>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>Try the demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3">
            <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left text-sm font-medium text-foreground py-1.5">
              How it works
            </button>
            <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm font-medium text-foreground py-1.5">
              Features
            </button>
            <button onClick={() => scrollTo('privacy')} className="block w-full text-left text-sm font-medium text-foreground py-1.5">
              Privacy
            </button>
            <button onClick={() => scrollTo('compare')} className="block w-full text-left text-sm font-medium text-foreground py-1.5">
              Compare
            </button>
            <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm font-medium text-foreground py-1.5">
              FAQ
            </button>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <a
                href={PLACEHOLDER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-2 text-xs font-medium text-foreground"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <Link
                to="/app"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
              >
                <span>Try the demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================================================================
            2. HERO SECTION (Clean Light Sage Theme matching Screenshot 1)
            ========================================================================= */}
        <section className="relative gradient-hero py-16 md:py-24 border-b border-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary border border-primary/20 animate-float shadow-2xs">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span>{COPY.hero.eyebrow}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.15]">
                Automate Your <span className="text-primary text-gradient">Carbon</span>
                <br />
                <span className="text-primary text-gradient">Accounting</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {COPY.hero.subtitle}
              </p>

              {/* Pill Badges Row (Matches app theme) */}
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                {[
                  'Activity Mapping',
                  'Emission Factor Library',
                  'Unit Validation',
                  'Visual Analytics',
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border shadow-2xs text-sm font-medium text-foreground hover-lift card-glow transition-all duration-200 cursor-default"
                  >
                    <Leaf className="w-4 h-4 text-success" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Actions & Start Mapping Link */}
              <div className="flex flex-col items-center gap-4 pt-3">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{COPY.hero.primaryCta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href={PLACEHOLDER_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 hover-lift transition-all shadow-xs"
                  >
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span>{COPY.hero.secondaryCta}</span>
                  </a>
                </div>

                <button
                  onClick={() => scrollTo('demo-video')}
                  className="group inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium pt-1"
                >
                  <Play className="w-4 h-4 fill-primary/20 group-hover:scale-110 transition-transform" />
                  <span>Watch Demo Video</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>

            {/* Demo Video Section */}
            <div id="demo-video" className="mt-14 max-w-5xl mx-auto space-y-4">
              <div className="relative rounded-2xl border border-border bg-card shadow-card hover-lift card-glow transition-all duration-300 overflow-hidden">
                {/* Window Header Bar */}
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-warning/60" />
                    <div className="h-3 w-3 rounded-full bg-success/60" />
                    <span className="text-xs font-mono text-muted-foreground ml-2">Carbon Compass · Product Demo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isGoogleDrive && (
                      <a
                        href={DEMO_VIDEO_SRC}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-background px-2.5 py-0.5 rounded-full border border-border transition-colors hover:border-primary/40"
                        title="Open full video in Google Drive"
                      >
                        <span>Open Drive</span>
                        <ExternalLink className="w-3 h-3 text-primary" />
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-background px-2.5 py-0.5 rounded-full border border-border">
                      <Play className="w-3 h-3 text-primary fill-primary" />
                      Walkthrough
                    </span>
                  </div>
                </div>

                {/* Video Player or Placeholder */}
                <div className="relative aspect-video w-full bg-muted/20 flex items-center justify-center overflow-hidden">
                  {DEMO_VIDEO_SRC ? (
                    isGoogleDrive ? (
                      <iframe
                        src={googleDrivePreview}
                        title="Carbon Compass Product Demo"
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    ) : !videoError ? (
                      <video
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                        src={DEMO_VIDEO_SRC}
                        onError={() => setVideoError(true)}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow hover:scale-105 transition-transform duration-300 animate-pulse-glow cursor-pointer">
                          <Play className="w-8 h-8 ml-1 fill-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            Product Demo Video
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            Watch how Carbon Compass maps messy shop-floor CSV logs to EPA emission factors and calculates CO₂e totals.
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow hover:scale-105 transition-transform duration-300 animate-pulse-glow cursor-pointer">
                        <Play className="w-8 h-8 ml-1 fill-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          Product Demo Video
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          Watch how Carbon Compass maps messy shop-floor CSV logs to EPA emission factors and calculates CO₂e totals.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. PROOF STRIP (Clean Card Surface)
            ========================================================================= */}
        <section className="border-b border-border bg-card py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 text-center">
              {COPY.proofStrip.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-2">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {item.value}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PROBLEM SECTION
            ========================================================================= */}
        <section className="py-16 md:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {COPY.problem.headline}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {COPY.problem.subheadline}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COPY.problem.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-7 shadow-xs hover-lift card-glow transition-all duration-300"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary mb-4 font-mono text-xs font-bold shadow-2xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. HOW IT WORKS
            ========================================================================= */}
        <section id="how-it-works" className="py-16 md:py-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Four-Stage Pipeline
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                How Carbon Compass Works
              </h2>
              <p className="text-muted-foreground text-sm">
                From raw operational logs to verifiable emission totals in four deterministic stages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COPY.howItWorks.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-background p-6 space-y-3 shadow-xs hover-lift card-glow transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-primary">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">
                      Stage {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. INTERACTIVE DEMO TEASER
            ========================================================================= */}
        <section className="py-16 md:py-24 border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Inspection &amp; Analytics
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Verifiable confidence scores and unit guardrails
              </h2>
              <p className="text-muted-foreground text-sm">
                Inspect AI similarity scores before reporting and rely on dimensional guardrails to block incorrect conversions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Primary Card: Table Preview */}
              <div className="lg:col-span-8 rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-border gap-2">
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      Reconciled Results Table
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Review activity matches, confidence tiers, and calculated totals
                    </p>
                  </div>
                  <Badge variant="outline" className="border-border text-muted-foreground text-xs w-fit">
                    Sample data
                  </Badge>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border text-muted-foreground font-mono">
                      <tr>
                        <th className="py-2.5 px-3">Your Activity</th>
                        <th className="py-2.5 px-3">EPA Category</th>
                        <th className="py-2.5 px-3 text-right">Quantity</th>
                        <th className="py-2.5 px-3 text-center">Confidence</th>
                        <th className="py-2.5 px-3 text-right">kg CO₂e</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono">
                      <tr>
                        <td className="py-3 px-3 font-medium text-foreground">diesel for forklifts</td>
                        <td className="py-3 px-3 text-muted-foreground">Diesel fuel combustion - mobile</td>
                        <td className="py-3 px-3 text-right text-muted-foreground">1,000 L</td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            High · 89%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-primary font-bold">2,680.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-medium text-foreground">substation grid electricity</td>
                        <td className="py-3 px-3 text-muted-foreground">Electricity generation - grid average</td>
                        <td className="py-3 px-3 text-right text-muted-foreground">4,500 kWh</td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            High · 82%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-primary font-bold">1,890.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-medium text-foreground">plant natural gas burn</td>
                        <td className="py-3 px-3 text-muted-foreground">Natural gas combustion - industrial</td>
                        <td className="py-3 px-3 text-right text-muted-foreground">650 m³</td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-warning/20 text-warning-foreground border border-warning/30">
                            Med · 68%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-primary font-bold">1,313.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-medium text-foreground">general refinery flare line</td>
                        <td className="py-3 px-3 text-muted-foreground">Industrial process venting</td>
                        <td className="py-3 px-3 text-right text-muted-foreground">120 m³</td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                            Low · 45%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-primary font-bold">242.40</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">High: ≥80% · Medium: 60–79% · Low: &lt;60%</span>
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-semibold"
                  >
                    <span>Launch interactive tool</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Secondary Column: Guardrail Card & Mini Distribution */}
              <div className="lg:col-span-4 space-y-5">
                {/* Unit Guardrail Card */}
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-destructive text-xs font-bold uppercase tracking-wider">
                    <XCircle className="h-4 w-4" />
                    <span>Unit Guardrail Triggered</span>
                  </div>
                  <p className="text-xs font-mono text-foreground bg-card p-2.5 rounded border border-destructive/20">
                    "diesel for forklifts expects L, but the uploaded unit is kg."
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dimensional guardrails halt arithmetic on unit mismatches instead of computing incorrect emissions.
                  </p>
                </div>

                {/* Distribution Card */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Emission Distribution (Sample)
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-muted-foreground">
                        <span>Diesel combustion</span>
                        <span>43.7%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '43.7%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-muted-foreground">
                        <span>Purchased electricity</span>
                        <span>30.8%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: '30.8%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-muted-foreground">
                        <span>Natural gas</span>
                        <span>21.4%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: '21.4%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. FEATURES GRID
            ========================================================================= */}
        <section id="features" className="py-16 md:py-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Core Capabilities
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Engineered for industrial accounting workflows
              </h2>
              <p className="text-muted-foreground text-sm">
                Everything required to transform messy operational logs into verifiable carbon disclosure rows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {COPY.features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-background p-5 hover:border-primary/40 transition-colors space-y-2.5 shadow-xs"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. PRIVACY AND DEPLOYMENT
            ========================================================================= */}
        <section id="privacy" className="py-16 md:py-24 border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Lock className="h-3.5 w-3.5" />
                  Stateless Security Architecture
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  {COPY.privacy.headline}
                </h2>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {COPY.privacy.subheadline}
                </p>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-foreground">
                  {COPY.privacy.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture Diagram */}
              <div className="lg:col-span-6">
                <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
                      Deployment Architecture
                    </span>
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-[10px]">
                      In-Memory Only
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-2 font-mono text-xs">
                    {/* Node 1 */}
                    <div className="p-3 rounded-lg border border-border bg-secondary/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <FileSpreadsheet className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">React Client (Browser)</div>
                          <div className="text-[10px] text-muted-foreground">In-browser CSV parsing &amp; BOM sanitization</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-primary font-semibold">Local Memory</span>
                    </div>

                    <div className="flex justify-center">
                      <div className="h-4 w-0.5 bg-border" />
                    </div>

                    {/* Node 2 */}
                    <div className="p-3 rounded-lg border border-border bg-secondary/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">FastAPI Backend (CPU)</div>
                          <div className="text-[10px] text-muted-foreground">Stateless REST API, zero persistent database</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-primary font-semibold">No Storage</span>
                    </div>

                    <div className="flex justify-center">
                      <div className="h-4 w-0.5 bg-border" />
                    </div>

                    {/* Node 3 */}
                    <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">all-MiniLM-L6-v2 + EPA Factors</div>
                          <div className="text-[10px] text-muted-foreground">384-dim CPU embeddings &amp; cosine matrix operations</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-primary font-semibold">~80MB Model</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. WHO IT'S FOR
            ========================================================================= */}
        <section className="py-16 md:py-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Tailored Workflows
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Built for manufacturing and compliance professionals
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COPY.personas.map((persona, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-background p-6 space-y-4 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {persona.role}
                    </h3>
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">The Problem:</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {persona.pain}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-border">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">With Carbon Compass:</span>
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {persona.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            10. REGULATORY CONTEXT
            ========================================================================= */}
        <section className="border-y border-border bg-secondary/60 py-6">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-1.5">
            <p className="text-sm font-semibold text-foreground">
              {COPY.regulatory.banner}
            </p>
            <p className="text-xs text-primary font-mono italic">
              {COPY.regulatory.disclaimer}
            </p>
          </div>
        </section>

        {/* =========================================================================
            11. COMPARISON TABLE
            ========================================================================= */}
        <section id="compare" className="py-16 md:py-24 border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Category Comparison
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                How Carbon Compass Compares
              </h2>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-secondary/40 border-b border-border text-foreground font-display">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Criteria</th>
                      <th className="py-3.5 px-4 text-primary font-bold bg-primary/10 border-x border-primary/20">Carbon Compass</th>
                      <th className="py-3.5 px-4 font-semibold">Enterprise SaaS platforms</th>
                      <th className="py-3.5 px-4 font-semibold">Legacy EHS suites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-muted-foreground">
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Primary Target</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">Manufacturing plants</td>
                      <td className="py-3 px-4">Corporate ESG offices</td>
                      <td className="py-3 px-4">Enterprise risk departments</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Deployment</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">Self-hosted / Local VPC</td>
                      <td className="py-3 px-4">Multi-tenant public cloud</td>
                      <td className="py-3 px-4">On-premises server license</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Activity Matching</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">Semantic vector AI (MiniLM)</td>
                      <td className="py-3 px-4">Rigid keyword rules / manual</td>
                      <td className="py-3 px-4">Manual lookup tables</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Confidence Score</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">Yes (0–100 per row)</td>
                      <td className="py-3 px-4">Opaque or absent</td>
                      <td className="py-3 px-4">Not available</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Air-gapped Support</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">Supported via demo mode</td>
                      <td className="py-3 px-4">No (cloud required)</td>
                      <td className="py-3 px-4">Complex custom setup</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Time to First Result</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">Under 1 minute</td>
                      <td className="py-3 px-4">3 to 6 months onboarding</td>
                      <td className="py-3 px-4">Weeks of configuration</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Vendor Lock-in</td>
                      <td className="py-3 px-4 bg-primary/5 border-x border-primary/15 font-semibold text-primary">None (MIT open source)</td>
                      <td className="py-3 px-4">Annual subscription lock-in</td>
                      <td className="py-3 px-4">Proprietary server lock-in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-secondary/30 border-t border-border text-right text-[11px] text-muted-foreground italic">
                Comparison reflects general category characteristics.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            12. ROADMAP
            ========================================================================= */}
        <section className="py-16 md:py-24 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Future Development
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Project Roadmap
              </h2>
              <p className="text-muted-foreground text-sm">
                Transparent milestones for open-source industrial emissions reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COPY.roadmap.map((stage, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-background p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-border">
                    <span className="font-display text-sm font-bold text-foreground">
                      {stage.phase}
                    </span>
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 text-[10px]">
                      Planned
                    </Badge>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {stage.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          {item}{' '}
                          <span className="text-[10px] text-muted-foreground/70 font-mono">[Planned]</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            13. TECH STACK STRIP
            ========================================================================= */}
        <section className="border-y border-border bg-secondary/40 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Engineered With Proven Open-Source Foundations
            </span>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 font-mono text-xs font-medium text-muted-foreground">
              <span>React 18</span>
              <span>TypeScript</span>
              <span>Vite</span>
              <span>Tailwind CSS</span>
              <span>FastAPI</span>
              <span>Pydantic</span>
              <span>SentenceTransformers</span>
              <span>NumPy</span>
              <span>Recharts</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            14. FAQ
            ========================================================================= */}
        <section id="faq" className="py-16 md:py-24 border-t border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Clear Answers
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-sm">
                Transparent details about capabilities, boundaries, and data architecture.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {COPY.faq.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="rounded-lg border border-border bg-background px-5 py-1"
                >
                  <AccordionTrigger className="text-left font-display text-sm sm:text-base font-semibold text-foreground hover:text-primary hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-3">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* =========================================================================
            15. FINAL CTA BAND
            ========================================================================= */}
        <section className="py-16 border-t border-border gradient-hero">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              See your first report in under a minute.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Drop your plant's operational CSV into Carbon Compass and inspect EPA-matched carbon calculations immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <span>Try the demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={PLACEHOLDER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors shadow-xs"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          16. FOOTER
          ========================================================================= */}
      <footer className="border-t border-border bg-card py-10 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/carbon-compass.svg" alt="Carbon Compass" className="h-7 w-7 rounded-lg shadow-xs" />
            <div>
              <span className="font-display font-bold text-foreground text-sm">Carbon Compass</span>
              <p className="text-[11px] text-muted-foreground">
                Turn messy plant data into carbon reports.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
            <a href={PLACEHOLDER_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              GitHub
            </a>
            <a href={PLACEHOLDER_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Docs
            </a>
            <a href={PLACEHOLDER_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              License: MIT
            </a>
            <a href={PLACEHOLDER_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          <div className="text-muted-foreground/70 text-[11px]">
            © 2026 Carbon Compass. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
