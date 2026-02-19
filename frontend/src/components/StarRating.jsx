import React from 'react'

export default function StarRating({ rating, size = 14, light = false }) {
  const starColor = light ? '#ffd166' : 'var(--accent)'
  const emptyColor = light ? 'rgba(255,255,255,0.4)' : 'var(--border-light)'
  const textColor = light ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)'
  const noRatingColor = light ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'

  if (rating == null) return <span style={{ color: noRatingColor, fontSize: Math.max(11, size - 1) }}>No rating</span>

  const full = Math.floor(rating)
  const partial = rating - full
  const empty = 5 - Math.ceil(rating)
  const gradientId = `star-grad-${rating}-${light}-${size}`

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[...Array(full)].map((_, i) => (
        <svg key={`f${i}`} width={size} height={size} viewBox="0 0 20 20" fill={starColor}>
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
      {partial > 0 && (
        <svg key="partial" width={size} height={size} viewBox="0 0 20 20">
          <defs>
            <linearGradient id={gradientId}>
              <stop offset={`${partial * 100}%`} stopColor={starColor} />
              <stop offset={`${partial * 100}%`} stopColor={emptyColor} />
            </linearGradient>
          </defs>
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" fill={`url(#${gradientId})`} />
        </svg>
      )}
      {[...Array(empty)].map((_, i) => (
        <svg key={`e${i}`} width={size} height={size} viewBox="0 0 20 20" fill={emptyColor}>
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
      <span style={{ marginLeft: 4, color: textColor, fontSize: Math.max(11, size - 1), fontWeight: 600 }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}
