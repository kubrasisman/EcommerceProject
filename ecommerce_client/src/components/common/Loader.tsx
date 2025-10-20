import { Spinner } from '@/components/ui/spinner'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  text?: string
}

export default function Loader({ size = 'md', fullScreen = false, text }: LoaderProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size={size} />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size={size} />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  )
}

