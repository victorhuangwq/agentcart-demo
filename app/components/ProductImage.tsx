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
        target.src = `https://via.placeholder.com/500x600/9CA3AF/FFFFFF?text=${encodeURIComponent(name)}`;
      }}
    />
  )
}