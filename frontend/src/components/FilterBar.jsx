import React from 'react'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

export default function FilterBar({ filters, onChange, onClear, hasFilters }) {
  const fields = [
    { key: 'title',      label: 'Search',     placeholder: 'Search recipes...', type: 'text', icon: true },
    { key: 'cuisine',    label: 'Cuisine',    placeholder: 'e.g. Italian',      type: 'text' },
    { key: 'rating',     label: 'Rating',     placeholder: 'e.g. >=4.5',        type: 'op'   },
    { key: 'total_time', label: 'Time (min)', placeholder: 'e.g. <=30',         type: 'op'   },
    { key: 'calories',   label: 'Calories',   placeholder: 'e.g. <=500',        type: 'op'   },
  ]

  return (
    <div style={{
      padding: '28px 24px',
      background: 'var(--cream2)',
      borderBottom: '1px solid var(--cream4)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 2px 12px rgba(31,27,23,0.04)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '24px 20px',
        background: 'var(--paper)',
        borderRadius: 16,
        border: '1px solid var(--cream4)',
        boxShadow: '0 2px 12px rgba(31,27,23,0.04)',
      }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 24,
        alignItems: 'end',
      }}>
      {fields.map(f => (
        <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--text-secondary)',
            marginBottom: 2,
          }}>{f.label}</label>
          <div style={{ position: 'relative' }}>
            {f.icon && (
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', opacity: 0.8, pointerEvents: 'none',
              }}>
                <SearchIcon />
              </span>
            )}
          <input
            type="text"
            placeholder={f.placeholder}
            value={filters[f.key]}
            onChange={e => onChange(f.key, e.target.value)}
            style={{
              padding: f.icon ? '12px 14px 12px 44px' : '12px 16px',
              background: 'var(--paper)',
              border: '2px solid ' + (filters[f.key] ? 'rgba(168,92,58,0.5)' : '#c4bcb0'),
              borderRadius: 12,
              fontSize: 14,
              color: 'var(--charcoal)',
              fontFamily: f.type === 'op' ? 'ui-monospace, monospace' : 'var(--font-body)',
              transition: 'all var(--transition)',
              width: '100%',
              boxShadow: filters[f.key] ? '0 0 0 4px rgba(168,92,58,0.1), inset 0 1px 2px rgba(255,255,255,0.5)' : 'inset 0 1px 2px rgba(0,0,0,0.02)',
              cursor: 'text',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--terracotta)'; e.target.style.boxShadow = '0 0 0 4px rgba(168,92,58,0.15), inset 0 0 12px rgba(168,92,58,0.05)' }}
            onBlur={e => { e.target.style.boxShadow = filters[f.key] ? '0 0 0 4px rgba(168,92,58,0.1), inset 0 1px 2px rgba(255,255,255,0.5)' : 'inset 0 1px 2px rgba(0,0,0,0.02)'; e.target.style.borderColor = e.target.value.trim() ? 'rgba(168,92,58,0.5)' : '#c4bcb0' }}
            onMouseEnter={e => { if (document.activeElement !== e.target) e.target.style.borderColor = e.target.value.trim() ? 'rgba(168,92,58,0.45)' : '#b8aea0' }}
            onMouseLeave={e => { if (document.activeElement !== e.target) { e.target.style.borderColor = e.target.value.trim() ? 'rgba(168,92,58,0.5)' : '#c4bcb0' } }}
          />
          </div>
        </div>
      ))}
      {hasFilters && (
        <button
          onClick={onClear}
          style={{
            padding: '12px 24px',
            background: 'var(--terracotta-dim)',
            border: '1.5px solid rgba(168,92,58,0.3)',
            color: 'var(--terracotta)',
            borderRadius: 12, fontSize: 13, fontWeight: 600,
            alignSelf: 'flex-end',
            transition: 'all var(--transition)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => { e.target.style.background = 'var(--terracotta)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--terracotta)'; e.target.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.target.style.background = 'var(--terracotta-dim)'; e.target.style.color = 'var(--terracotta)'; e.target.style.borderColor = 'rgba(168,92,58,0.3)'; e.target.style.transform = 'translateY(0)' }}
        >
          ✕ Clear
        </button>
      )}
      </div>
      </div>
    </div>
  )
}