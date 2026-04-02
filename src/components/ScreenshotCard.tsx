interface ScreenshotCardProps {
  src: string
  alt: string
  caption?: string
}

export default function ScreenshotCard({ src, alt, caption }: ScreenshotCardProps) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-xl border border-white/[0.10] block"
      />
      {caption && (
        <figcaption className="mt-2 text-xs text-[#FCF4EB]/50 text-center leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
