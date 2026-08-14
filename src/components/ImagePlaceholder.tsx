interface ImagePlaceholderProps {
  label: string
  className?: string
}

export default function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div className={`img-placeholder ${className ?? ''}`}>
      <span>{label}</span>
    </div>
  )
}
