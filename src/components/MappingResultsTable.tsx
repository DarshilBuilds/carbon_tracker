import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MappingResult } from '@/types/emissions';
import { ListChecks, ChevronDown, ChevronUp, ChevronsDown, Search, X, MapPin } from 'lucide-react';

interface MappingResultsTableProps {
  results: MappingResult[];
}

const PAGE_CHUNK = 50;

function getConfidenceBadge(score: number) {
  if (score >= 80) {
    return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20 font-medium">High · {score}%</Badge>;
  } else if (score >= 60) {
    return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20 font-medium">Medium · {score}%</Badge>;
  }
  return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20 font-medium">Low · {score}%</Badge>;
}

export function MappingResultsTable({ results }: MappingResultsTableProps) {
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_CHUNK);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return results;
    const q = searchQuery.toLowerCase().trim();
    return results.filter(r =>
      r.userActivity.toLowerCase().includes(q) ||
      r.matchedEpaActivity.toLowerCase().includes(q) ||
      (r.facility && r.facility.toLowerCase().includes(q)) ||
      (r.zipCode && r.zipCode.toLowerCase().includes(q)) ||
      (r.reportingPeriod && r.reportingPeriod.toLowerCase().includes(q))
    );
  }, [results, searchQuery]);

  const displayedResults = useMemo(() => {
    return filteredResults.slice(0, visibleCount);
  }, [filteredResults, visibleCount]);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + PAGE_CHUNK, filteredResults.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredResults.length);
  };

  const handleShowLess = () => {
    setVisibleCount(PAGE_CHUNK);
  };

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              Emission Factor Mapping Results
            </CardTitle>
            <CardDescription className="mt-1">
              Review activity matches, facilities, zip codes, and emissions data. Table supports horizontal and vertical scrolling.
            </CardDescription>
          </div>

          {/* Quick Filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Filter activities, facilities, zip code..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setVisibleCount(PAGE_CHUNK);
              }}
              className="pl-9 pr-8 text-sm h-9 bg-background/80"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVisibleCount(PAGE_CHUNK);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scrollable Viewport: Clean single scroll container with fixed header and proportional column widths */}
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="max-h-[580px] overflow-x-auto overflow-y-auto relative">
            <table className="min-w-[1260px] w-full caption-bottom text-sm border-collapse text-left">
              <thead className="sticky top-0 bg-muted/95 backdrop-blur z-20 shadow-sm border-b border-border">
                <tr className="border-b transition-colors bg-muted/70">
                  <th className="w-12 min-w-[48px] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
                  <th className="min-w-[190px] max-w-[240px] px-4 py-3 font-semibold text-foreground">Your Activity</th>
                  <th className="min-w-[160px] max-w-[220px] px-4 py-3 font-semibold text-foreground">Facility</th>
                  <th className="w-[100px] min-w-[90px] max-w-[110px] px-2 py-3 font-semibold text-foreground text-center">Zip Code</th>
                  <th className="w-[85px] min-w-[80px] max-w-[90px] px-2 py-3 font-semibold text-foreground text-center" title="Reporting Period / Year">Period</th>
                  <th className="min-w-[250px] max-w-[330px] px-4 py-3 font-semibold text-foreground">EPA Match</th>
                  <th className="w-[150px] min-w-[135px] px-4 py-3 font-semibold text-foreground text-right">Quantity</th>
                  <th className="w-[130px] min-w-[115px] px-4 py-3 font-semibold text-foreground text-right">Factor</th>
                  <th className="w-[145px] min-w-[130px] px-4 py-3 font-semibold text-foreground text-right">CO₂e</th>
                  <th className="w-[115px] min-w-[105px] px-3 py-3 font-semibold text-foreground text-center">Match Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedResults.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-muted-foreground text-sm">
                      {searchQuery ? 'No activities match your filter.' : 'No mapping records available.'}
                    </td>
                  </tr>
                ) : (
                  displayedResults.map((result, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-muted/40 transition-colors border-b border-border/50"
                    >
                      <td className="text-xs text-muted-foreground font-mono text-center w-12 min-w-[48px] px-3 py-3.5">
                        {index + 1}
                      </td>
                      <td className="min-w-[190px] max-w-[240px] px-4 py-3.5 font-medium text-foreground break-words leading-snug">
                        {result.userActivity}
                      </td>
                      <td className="min-w-[160px] max-w-[220px] px-4 py-3.5 text-muted-foreground break-words leading-snug">
                        {result.facility || '—'}
                      </td>
                      <td className="w-[100px] min-w-[90px] max-w-[110px] px-2 py-3.5 text-center font-mono text-xs whitespace-nowrap">
                        {result.zipCode ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border/60 font-mono text-xs font-medium">
                            <MapPin className="w-3 h-3 text-primary shrink-0" />
                            {result.zipCode}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="w-[85px] min-w-[80px] max-w-[90px] px-2 py-3.5 whitespace-nowrap text-muted-foreground text-center font-mono text-xs">
                        {result.reportingPeriod || '—'}
                      </td>
                      <td className="min-w-[250px] max-w-[330px] px-4 py-3.5 text-muted-foreground break-words leading-snug">
                        {result.matchedEpaActivity}
                      </td>
                      <td className="w-[150px] min-w-[135px] px-4 py-3.5 text-right font-mono">
                        <div className="font-semibold text-foreground text-sm">{result.quantity.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground font-sans truncate" title={result.quantityUnit}>
                          {result.quantityUnit}
                          {result.unitAssumed && <span className="italic ml-1">(assumed)</span>}
                        </div>
                      </td>
                      <td className="w-[130px] min-w-[115px] px-4 py-3.5 text-right font-mono">
                        <div className="text-xs text-foreground font-medium">{result.emissionFactor}</div>
                        <div className="text-[11px] text-muted-foreground font-sans truncate" title={result.emissionFactorUnit}>
                          {result.emissionFactorUnit}
                        </div>
                      </td>
                      <td className="w-[145px] min-w-[130px] px-4 py-3.5 text-right font-mono">
                        <div className="font-semibold text-primary text-sm whitespace-nowrap">
                          {result.calculatedEmissions.toLocaleString()} kg
                        </div>
                        {result.calculatedEmissions >= 1000 && (
                          <div className="text-[11px] text-muted-foreground font-sans">
                            ≈ {(result.calculatedEmissions / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} MT
                          </div>
                        )}
                      </td>
                      <td className="w-[115px] min-w-[105px] px-3 py-3.5 text-center whitespace-nowrap">
                        {getConfidenceBadge(result.confidenceScore)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Load More & Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-sm text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{displayedResults.length.toLocaleString()}</span> of{' '}
            <span className="font-semibold text-foreground">{filteredResults.length.toLocaleString()}</span> activities
            {searchQuery && filteredResults.length !== results.length && (
              <span className="text-xs italic ml-1"> (filtered from {results.length.toLocaleString()} total)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {visibleCount < filteredResults.length && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShowMore}
                  className="gap-1.5"
                >
                  <ChevronDown className="w-4 h-4" />
                  Show More (+{Math.min(PAGE_CHUNK, filteredResults.length - visibleCount)})
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleShowAll}
                  className="gap-1.5"
                >
                  <ChevronsDown className="w-4 h-4" />
                  Show All ({filteredResults.length.toLocaleString()})
                </Button>
              </>
            )}

            {visibleCount > PAGE_CHUNK && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShowLess}
                className="gap-1.5 text-xs"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                Collapse to {PAGE_CHUNK}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
