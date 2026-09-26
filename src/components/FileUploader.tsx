import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X, Leaf } from 'lucide-react';
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

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);

    if (!validateFileType(file)) {
      setValidation({
        isValid: false,
        errors: [{ row: 0, field: 'file', message: 'Please upload a CSV file' }],
        validRows: [],
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseCSV(content);
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
  }, []);

  return (
    <Card className="gradient-card shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Upload Activity Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file with your business activities for emission mapping
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
            accept=".csv"
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
                Drop your CSV file here
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
              <div className="flex items-center gap-2 p-3 bg-success/10 text-success rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {validation.validRows.length} valid activities ready for processing
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Validation failed - please check errors below
                </span>
              </div>
            )}

            {/* Show errors */}
            {validation.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1">
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
          <p className="text-xs text-muted-foreground mb-2">Expected CSV format:</p>
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
            activity_name, quantity
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
