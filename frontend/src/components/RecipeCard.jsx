import React, { useState } from 'react'
import StarRating from './StarRating.jsx'
import { getRecipeImageUrl, getCuisineGradient } from '../utils/ImageMap.js'

export default function RecipeCard({ recipe, onClick, index, size = 'normal' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [hasZoomed, setHasZoomed] = useState(false)

  const imgUrl = getRecipeImageUrl(recipe.title, recipe.cuisine, size === 'large' ? 800 : 400, size === 'large' ? 500 : 300)
  const gradient = getCuisineGradient(recipe.cuisine)

  const calStr = recipe.nutrients?.calories
  const calNum = calStr ? parseInt(calStr) : null

  const isLarge = size === 'large'
  const isTall  = size === 'tall'

  const handleClick = () => {
    if (isClicked) return
    setIsClicked(true)
    setHasZoomed(true)
    // Zoom/emboss animation, then open drawer
    setTimeout(() => onClick?.(), 280)
  }

  const handleAnimationEnd = () => {
    if (isClicked) setIsClicked(false)
  }

  const showInitialFade = !hasZoomed
  const showZoom = isClicked
  const showReturnTransition = hasZoomed && !isClicked

  return (
    <article
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      style={{
        position: 'relative',
        background: 'var(--paper)',
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: showReturnTransition ? 'var(--shadow-sm)' : 'var(--shadow-sm)',
        border: '1px solid var(--cream4)',
        transform: showReturnTransition ? 'scale(1) translateY(0)' : undefined,
        transition: 'transform 0.35s var(--ease-out-expo), box-shadow 0.35s ease, border-color 0.3s ease',
        animation: showZoom ? 'cardZoomEmboss 0.4s var(--ease-out-expo) forwards' : showInitialFade ? `fadeUp 0.5s ease both` : 'none',
        animationDelay: showInitialFade ? `${index * 60}ms` : undefined,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={e => {
        if (isClicked) return
        e.currentTarget.style.transform = 'translateY(-14px) scale(1.03)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card-lift)'
        e.currentTarget.style.borderColor = 'transparent'
      }}
      onMouseLeave={e => {
        if (isClicked) return
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.borderColor = 'var(--cream4)'
      }}
    >
      {/* Image area - increased border-radius */}
      <div style={{
        position: 'relative',
        height: isLarge ? 280 : isTall ? 220 : 180,
        background: gradient,
        overflow: 'hidden',
        flexShrink: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}>
        {!imgError && (
          <img
            src={imgUrl}
            alt={recipe.title}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease, transform 0.5s var(--ease-out-expo)',
              transform: 'scale(1.08)',
              display: 'block',
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.12)' }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1.08)' }}
          />
        )}

        {/* Gradient overlay for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,8,6,0.9) 0%, rgba(10,8,6,0.5) 35%, rgba(10,8,6,0.15) 65%, transparent 100%)',
        }} />

        {/* Cuisine badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          padding: '6px 14px',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-pill)',
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          boxShadow: '0 2px 8px rgba(31,27,23,0.1), 0 1px 0 rgba(255,255,255,0.8) inset',
          maxWidth: 'calc(100% - 28px)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.6)',
        }}>
          {recipe.cuisine || 'Recipe'}
        </div>

        {/* Rating badge */}
        {recipe.rating != null && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            padding: '8px 14px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-pill)',
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 700, color: '#ffd978',
            boxShadow: '0 2px 16px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.25) inset',
            letterSpacing: '0.04em',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            ★ {recipe.rating.toFixed(1)}
          </div>
        )}

        {/* Title overlay on image bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 16px 14px',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isLarge ? 25 : 18,
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.3,
            letterSpacing: '0.02em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)',
          }}>
            {recipe.title}
          </h3>
        </div>
      </div>

      {/* Card body - more padding */}
      <div style={{
        padding: '20px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: 12,
        flex: 1,
        background: 'var(--paper)',
      }}>
        {/* Description */}
        {recipe.description && (
          <p style={{
            fontSize: 13.5, color: 'var(--text-secondary)',
            lineHeight: 1.7,
            display: '-webkit-box',
            WebkitLineClamp: isLarge ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}>
            {recipe.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 14, flexWrap: 'wrap',
          paddingTop: 10,
          borderTop: '1px solid var(--cream3)',
        }}>
          {recipe.total_time != null && (
            <MetaPill icon="⏱" label={`${recipe.total_time}m`} />
          )}
          {calNum != null && (
            <MetaPill icon="🔥" label={`${calNum} cal`} />
          )}
          {recipe.serves && (
            <MetaPill icon="👥" label={recipe.serves.replace('servings','').replace('serving','').trim()} />
          )}
        </div>
      </div>
    </article>
  )
}

function MetaPill({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 12.5, color: 'var(--text-muted)',
      fontWeight: 400,
      letterSpacing: '0.02em',
    }}>
      <span style={{ fontSize: 13, opacity: 0.9 }}>{icon}</span>
      {label}
    </span>
  )
}