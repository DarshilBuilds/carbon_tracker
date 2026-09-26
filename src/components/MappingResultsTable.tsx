import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MappingResult } from '@/types/emissions';
import { ListChecks } from 'lucide-react';

interface MappingResultsTableProps {
  results: MappingResult[];
}

function getConfidenceBadge(score: number) {
  if (score >= 80) {
    return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">High · {score}%</Badge>;
  } else if (score >= 60) {
    return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20">Medium · {score}%</Badge>;
  }
  return <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20">Low · {score}%</Badge>;
}

export function MappingResultsTable({ results }: MappingResultsTableProps) {
  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" />
          Emission Factor Mapping Results
        </CardTitle>
        <CardDescription>
          Review activity matches, units, and match scores before using results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Your Activity</TableHead>
                  <TableHead className="font-semibold">Facility</TableHead>
                  <TableHead className="font-semibold">Reporting Period</TableHead>
                  <TableHead className="font-semibold">EPA Match</TableHead>
                  <TableHead className="font-semibold text-right">Quantity</TableHead>
                  <TableHead className="font-semibold text-right">Factor</TableHead>
                  <TableHead className="font-semibold text-right">CO₂e</TableHead>
                  <TableHead className="font-semibold text-center">Match Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium max-w-[200px] truncate" title={result.userActivity}>
                      {result.userActivity}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{result.facility || '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">{result.reportingPeriod || '—'}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[250px] truncate" title={result.matchedEpaActivity}>
                      {result.matchedEpaActivity}
                    </TableCell>
                    <TableCell className="text-right font-mono whitespace-nowrap">
                      {result.quantity.toLocaleString()} {result.quantityUnit}
                      {result.unitAssumed && <span className="text-xs text-muted-foreground"> (assumed)</span>}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground whitespace-nowrap">
                      {result.emissionFactor} {result.emissionFactorUnit}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-primary whitespace-nowrap">
                      {result.calculatedEmissions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {getConfidenceBadge(result.confidenceScore)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
