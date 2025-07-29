'use client'

interface ProductImageProps {
  src: string
  alt: string
  name: string
}

export default function ProductImage({ src, alt, name }: ProductImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // Fallback to a solid color placeholder if local image fails
        target.src = `data:image/svg+xml,%3Csvg width='500' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(name)}%3C/text%3E%3C/svg%3E`;
      }}
    />
  )
}