import { Button } from './button';
import { RotateCw, TriangleAlert } from 'lucide-react'

export default function ErrorAlert({ errorMsg }: { errorMsg: string | null | undefined }) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      {errorMsg && (
        <div className="p-4 border border-destructive/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-destructive/10 text-destructive-foreground rounded-lg text-sm w-full">
          <div className="flex items-center gap-3">
            <TriangleAlert size={20} className="text-red-500 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>

          <Button
            onClick={handleRetry}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 self-end sm:self-auto" // Added flex layout for icon & alignment
          >
            <RotateCw size={14} />
            <span>Retry</span>
          </Button>
        </div>
      )}
    </>
  )
}
