import { Copy } from 'lucide-react'
import { Button } from './button'
import { toast } from 'sonner';

interface CopyToClipboardProps {
  data: string;
  title?: string;
  successMessage: string;
  errorMessage: string;
}

export default function CopyToClipboard({
  title = "Copy Code",
  data,
  errorMessage,
  successMessage
}: CopyToClipboardProps) {

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(data)
      toast.success(successMessage)
    } catch (err) {
      toast.error(errorMessage)
    }
  }

  return (
    <Button onClick={handleCopy} variant="outline"  >
      <Copy className="w-3.5 h-3.5" />
      {title}
    </Button>
  )
}