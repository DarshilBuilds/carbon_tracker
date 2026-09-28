import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X, Leaf, Eye, EyeOff, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCSV, validateFileType } from '@/lib/csvParser';
import { UploadValidation, ActivityInput } from '@/types/emissions';

interface FileUploaderProps {
  onUpload: (activities: ActivityInput[]) => void;
  isProcessing: boolean;
}

export function FileUploader({ onUpload, isProcessing }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [validation, setValidation] = useState<UploadValidation | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCount, setPreviewCount] = useState(5);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setShowPreview(false);
    setPreviewCount(5);

    if (!validateFileType(file)) {
      setValidation({
        isValid: false,
        errors: [{ row: 0, field: 'file', message: 'Please upload a CSV or Excel (.xlsx/.xls) file' }],
        validRows: [],
      });
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isExcel = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(buffer, { type: 'array' });

          // Pick the best data sheet (ignore sheets named FAQ, readme, about if other sheets exist)
          let chosenSheetName = workbook.SheetNames[0];
          for (const name of workbook.SheetNames) {
            const lower = name.toLowerCase();
            if (!lower.includes('faq') && !lower.includes('readme') && !lower.includes('about')) {
              chosenSheetName = name;
              break;
            }
          }

          const sheet = workbook.Sheets[chosenSheetName];
          const csvContent = XLSX.utils.sheet_to_csv(sheet);
          const result = parseCSV(csvContent, file.name);
          setValidation(result);
        } catch (err: any) {
          setValidation({
            isValid: false,
            errors: [{ row: 0, field: 'file', message: `Could not parse Excel spreadsheet: ${err.message}` }],
            validRows: [],
          });
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseCSV(content, file.name);
      setValidation(result);
    };
    reader.readAsText(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleSubmit = useCallback(() => {
    if (validation?.validRows) {
      onUpload(validation.validRows);
    }
  }, [validation, onUpload]);

  const clearFile = useCallback(() => {
    setFileName(null);
    setValidation(null);
    setShowPreview(false);
    setPreviewCount(5);
  }, []);

  return (
    <Card className="gradient-card shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Upload Activity Data
        </CardTitle>
        <CardDescription>
          Upload a CSV or Excel spreadsheet (.xlsx) with your business activities for emission mapping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${dragActive 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <input
            type="file"
            accept=".csv, .tsv, .txt, .xlsx, .xls"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              dragActive ? 'bg-primary/20' : 'bg-muted'
            }`}>
              <FileText className={`w-6 h-6 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drop your CSV or Excel (.xlsx) file here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </div>
        </div>

        {/* File Info */}
        {fileName && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Validation Results */}
        {validation && (
          <div className="space-y-3 animate-fade-in">
            {validation.isValid ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-success/10 text-success rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">
                      {validation.validRows.length.toLocaleString()} valid activities ready for processing
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(prev => !prev)}
                    className="h-7 px-2.5 text-xs font-normal text-success hover:text-success hover:bg-success/20 gap-1.5"
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        Preview Data
                      </>
                    )}
                  </Button>
                </div>

                {/* Collapsible Scrollable Preview Table */}
                {showPreview && (
                  <div className="rounded-lg border border-border bg-card p-3 space-y-2 animate-fade-in text-xs">
                    <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-border">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        Parsed Data Preview
                      </span>
                      <span>
                        Showing {Math.min(previewCount, validation.validRows.length)} of {validation.validRows.length.toLocaleString()} rows
                      </span>
                    </div>

                    <div className="max-h-44 overflow-y-auto overflow-x-auto rounded border border-border">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/80 sticky top-0 border-b border-border">
                          <tr>
                            <th className="p-1.5 font-semibold text-muted-foreground">#</th>
                            <th className="p-1.5 font-semibold">Activity</th>
                            <th className="p-1.5 font-semibold text-right">Quantity</th>
                            <th className="p-1.5 font-semibold">Unit</th>
                            <th className="p-1.5 font-semibold">Facility</th>
                            <th className="p-1.5 font-semibold text-center">Zip</th>
                            <th className="p-1.5 font-semibold">Period</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {validation.validRows.slice(0, previewCount).map((row, idx) => (
                            <tr key={idx} className="hover:bg-muted/30">
                              <td className="p-1.5 text-muted-foreground font-mono">{idx + 1}</td>
                              <td className="p-1.5 font-medium max-w-[160px] truncate" title={row.activityName}>
                                {row.activityName}
                              </td>
                              <td className="p-1.5 text-right font-mono">{row.quantity.toLocaleString()}</td>
                              <td className="p-1.5 text-muted-foreground">{row.unit || '—'}</td>
                              <td className="p-1.5 text-muted-foreground max-w-[120px] truncate">{row.facility || '—'}</td>
                              <td className="p-1.5 text-center font-mono text-muted-foreground">{row.zipCode || '—'}</td>
                              <td className="p-1.5 text-muted-foreground">{row.reportingPeriod || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {previewCount < validation.validRows.length && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewCount(c => Math.min(c + 10, validation.validRows.length))}
                          className="h-6 text-[11px] px-2 gap-1"
                        >
                          <ChevronDown className="w-3 h-3" />
                          Show 10 More Preview Rows
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewCount(validation.validRows.length)}
                          className="h-6 text-[11px] px-2"
                        >
                          Show All ({validation.validRows.length.toLocaleString()})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Validation failed - please check errors below
                </span>
              </div>
            )}

            {/* Show errors or skipped rows */}
            {validation.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {validation.isValid ? (
                  <p className="text-xs text-muted-foreground italic">
                    Note: {validation.errors.length} non-activity rows were skipped.
                  </p>
                ) : (
                  <>
                    {validation.errors.slice(0, 5).map((error, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        Row {error.row}: {error.message}
                      </p>
                    ))}
                    {validation.errors.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        ...and {validation.errors.length - 5} more errors
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Submit Button */}
            {validation.isValid && (
              <Button 
                onClick={handleSubmit} 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4" />
                    Map to EPA Factors
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Format Guide */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Supported formats & column auto-detection:</p>
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
            activity_name / facility_name, quantity / emissions, [unit], [reporting_period]
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Auto-detects delimiters (comma, semicolon, tab) and headers in EPA GHGRP filings, summary spreadsheets, utility data, and industrial reports.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
