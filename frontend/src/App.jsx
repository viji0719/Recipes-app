import React, { useState, useEffect, useCallback, useRef } from 'react'
import { fetchRecipes, searchRecipes } from './utils/api.js'
import RecipeCard from './components/RecipeCard.jsx'
import RecipeDrawer from './components/RecipeDrawer.jsx'
import FilterBar from './components/FilterBar.jsx'
import Pagination from './components/Pagination.jsx'

const INITIAL_FILTERS = { title:'', cuisine:'', calories:'', total_time:'', rating:'' }

function useDebounce(value, delay=450) {
  const [d, setD] = useState(value)
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t) }, [value, delay])
  return d
}

function hasFilters(f) { return Object.values(f).some(v => v.trim() !== '') }

// Assigns tile sizes in a visually interesting pattern
function getSizeForIndex(i) {
  // Every 7 cards: first is large, mix of tall and normal
  const pos = i % 7
  if (pos === 0) return 'large'
  if (pos === 3) return 'tall'
  return 'normal'
}

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selected, setSelected] = useState(null)
  const debouncedFilters = useDebounce(filters)
  const prevFilters = useRef(debouncedFilters)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const result = hasFilters(debouncedFilters)
        ? await searchRecipes({ ...debouncedFilters, page, limit })
        : await fetchRecipes({ page, limit })
      setData(result)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }, [page, limit, debouncedFilters])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (prevFilters.current !== debouncedFilters) { setPage(1); prevFilters.current = debouncedFilters }
  }, [debouncedFilters])

  const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))
  const clearFilters = () => { setFilters(INITIAL_FILTERS); setPage(1) }

  const recipes = data?.data || []
  const total = data?.total || 0

  const [taglineIndex, setTaglineIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('recipe-dark') === '1' }
    catch { return false }
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '')
    try { localStorage.setItem('recipe-dark', darkMode ? '1' : '0') }
    catch { /* ignore */ }
  }, [darkMode])

  const taglines = [
    'Every recipe tells a story.',
    'Discover flavors from around the world.',
    'Cook something unforgettable tonight.',
    'Great meals start with great ingredients.',
  ]
  useEffect(() => {
    const t = setInterval(() => setTaglineIndex(i => (i + 1) % 4), 4000)
    return () => clearInterval(t)
  }, [])

  const containerStyle = { maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 24px', boxSizing: 'border-box' }

  return (
    <div className="app-root" style={{
      minHeight:'100vh', display:'flex', flexDirection:'column', background:'transparent',
      position:'relative', zIndex:1, animation:'pageLoadFade 0.5s ease',
    }}>

      {/* Header - sticky navbar, more vertical padding */}
      <header style={{
        padding:'36px 24px 32px',
        background:'var(--cream)',
        backdropFilter:'blur(12px)',
        WebkitBackdropFilter:'blur(12px)',
        borderBottom:'1px solid var(--cream4)',
        position:'sticky', top:0, zIndex:50,
        boxShadow:'0 1px 0 rgba(255,255,255,0.4) inset',
      }}>
        <div style={{ ...containerStyle, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
        <div>
          {/* Decorative rule */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
            <div style={{ width:48, height:4, background:'linear-gradient(90deg, var(--terracotta) 0%, var(--terracotta-light) 50%, var(--accent) 100%)', borderRadius:2, opacity:0.9 }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.22em',
              textTransform:'uppercase', color:'var(--terracotta)', opacity:0.95 }}>
              Curated Collection
            </span>
          </div>
          <h1 style={{
            fontFamily:'var(--font-display)',
            fontSize:52, fontWeight:800, letterSpacing:'-0.03em',
            color:'var(--charcoal)', lineHeight:1.05,
            fontStyle:'italic',
            textShadow:'0 1px 0 rgba(255,255,255,0.3)',
          }}>
            Recipe Explorer
          </h1>
          <p style={{ color:'#5c5448', fontSize:15, marginTop:14, fontWeight:400, letterSpacing:'0.02em', lineHeight:1.5 }}>
            {total > 0 ? `${total.toLocaleString()} recipes from across the United States` : 'Discover exceptional recipes'}
          </p>
        </div>

        {/* Dark mode + stats */}
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <button
            onClick={() => setDarkMode(d => !d)}
            className="theme-toggle-btn"
            style={{
              padding:'10px 16px', borderRadius:12, border:'1px solid rgba(255,255,255,0.3)',
              background:'rgba(255,255,255,0.4)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
              color:'var(--text-secondary)', fontSize:20, cursor:'pointer', transition:'all var(--transition)',
              boxShadow:'0 0 0 1px rgba(255,255,255,0.2) inset, 0 2px 8px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => { e.target.style.background='rgba(255,255,255,0.6)'; e.target.style.transform='scale(1.05)'; e.target.style.boxShadow='0 0 20px rgba(212,168,83,0.15), 0 0 0 1px rgba(255,255,255,0.3) inset' }}
            onMouseLeave={e => { e.target.style.background='rgba(255,255,255,0.4)'; e.target.style.transform='scale(1)'; e.target.style.boxShadow='0 0 0 1px rgba(255,255,255,0.2) inset, 0 2px 8px rgba(0,0,0,0.06)' }}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          {hasFilters(filters) && (
            <div style={{
              padding:'8px 18px',
              background:'var(--terracotta-dim)',
              border:'1px solid rgba(168,92,58,0.25)',
              borderRadius:'var(--radius-pill)',
              fontSize:12, color:'var(--terracotta)', fontWeight:600,
              display:'inline-flex', alignItems:'center', gap:8,
              boxShadow:'0 1px 2px rgba(168,92,58,0.08)',
            }}>
              <span>Filtered</span>
              <span style={{ opacity:0.5, fontWeight:400 }}>·</span>
              <span>{total.toLocaleString()}</span>
            </div>
          )}
        </div>
        </div>
      </header>

      {/* Inspiration strip - smoother gradient, divider */}
      <div style={{
        padding: '24px 24px',
        background: 'linear-gradient(180deg, rgba(168,92,58,0.02) 0%, rgba(168,92,58,0.05) 30%, rgba(168,92,58,0.04) 70%, rgba(168,92,58,0.02) 100%)',
        borderBottom: '1px solid var(--cream4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
        minHeight: 56,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        {/* Rotating tagline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 24,
        }}>
          <span style={{ fontSize: 20, opacity: 0.6 }}>✨</span>
          <p key={taglineIndex} style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'var(--text-secondary)',
            margin: 0,
            letterSpacing: '0.01em',
            animation: 'taglineFade 0.6s ease',
          }}>
            {taglines[taglineIndex]}
          </p>
        </div>
        {/* Quick hints */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[
            { icon: '🥘', label: 'Cuisines' },
            { icon: '⏱', label: 'Time' },
            { icon: '⭐', label: 'Rating' },
            { icon: '🔥', label: 'Calories' },
          ].map(({ icon, label }) => (
            <span key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <span style={{ fontSize: 14, opacity: 0.8 }}>{icon}</span>
              {label}
            </span>
          ))}
        </div>
        </div>
      </div>

      {/* Filter bar - gap from hero */}
      <div style={{ marginTop: 16 }}>
      <FilterBar
        filters={filters}
        onChange={updateFilter}
        onClear={clearFilters}
        hasFilters={hasFilters(filters)}
      />
      </div>

      {/* Content - max-width container */}
      <main style={{ flex:1, padding:'48px 24px 64px' }}>
        <div className="recipe-container" style={containerStyle}>

        {/* Error */}
        {error && (
          <div style={{
            padding:'48px 40px', textAlign:'center', maxWidth:420, margin:'0 auto',
            background:'var(--paper)', borderRadius:'var(--radius-xl)',
            border:'1px solid var(--cream4)', boxShadow:'var(--shadow)',
          }}>
            <div style={{ fontSize:40, marginBottom:16, opacity:0.9 }}>⚠️</div>
            <div style={{ color:'var(--terracotta)', fontWeight:600, fontSize:17, marginBottom:8, letterSpacing:'0.02em' }}>
              Could not connect to the API
            </div>
            <div style={{ color:'var(--text-secondary)', fontSize:14 }}>{error}</div>
            <div style={{ color:'var(--text-muted)', fontSize:13, marginTop:10 }}>
              Ensure the backend is running on <code style={{ background:'var(--cream2)', padding:'3px 10px', borderRadius:6, color:'var(--charcoal)', fontWeight:500, fontSize:12 }}>http://localhost:8000</code>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && recipes.length === 0 && (
          <div style={{
            padding:'100px 24px', textAlign:'center',
            display:'flex', flexDirection:'column', alignItems:'center', gap:20,
          }}>
            <div style={{ fontSize:72, opacity:0.9, filter:'grayscale(0.1)' }}>🍽️</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:30, color:'var(--charcoal)', fontStyle:'italic', fontWeight:600 }}>
              No recipes found
            </h2>
            <p style={{ color:'var(--text-secondary)', fontSize:15, maxWidth:340, lineHeight:1.6 }}>
              Try adjusting your filters — no results matched your current search criteria.
            </p>
            <button onClick={clearFilters} style={{
              padding:'12px 32px',
              background:'var(--terracotta)', color:'#fff',
              borderRadius:'var(--radius)', fontWeight:600, fontSize:14,
              transition:'all var(--transition)', boxShadow:'0 2px 8px rgba(168,92,58,0.25)',
            }}
            onMouseEnter={e => { e.target.style.background='var(--terracotta-light)'; e.target.style.transform='translateY(-1px)'; e.target.style.boxShadow='0 4px 16px rgba(168,92,58,0.3)' }}
            onMouseLeave={e => { e.target.style.background='var(--terracotta)'; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 2px 8px rgba(168,92,58,0.25)' }}
            >Clear all filters</button>
          </div>
        )}

        {/* Loading skeleton grid */}
        {loading && (
          <div style={{ columns:'3 320px', gap:28, animation:'fadeUp 0.4s ease' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                breakInside:'avoid', marginBottom:28,
                borderRadius:20, overflow:'hidden',
                background:'var(--paper)', boxShadow:'var(--shadow-sm)',
                border:'1px solid var(--cream4)',
              }}>
                <div style={{
                  height: getSizeForIndex(i) === 'large' ? 280 : getSizeForIndex(i) === 'tall' ? 220 : 180,
                  background:'linear-gradient(110deg, var(--cream2) 25%, var(--cream3) 45%, var(--cream2) 70%)',
                  backgroundSize:'200% 100%',
                  animation:'shimmer 1.8s ease-in-out infinite',
                }} />
                <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ height:16, width:'70%', borderRadius:8, background:'var(--cream2)',
                    animation:'shimmer 1.8s ease-in-out infinite', backgroundSize:'200% 100%',
                    backgroundImage:'linear-gradient(110deg, var(--cream2) 25%, var(--cream3) 45%, var(--cream2) 70%)' }} />
                  <div style={{ height:12, width:'90%', borderRadius:8, background:'var(--cream2)',
                    animation:'shimmer 1.8s ease-in-out infinite', backgroundSize:'200% 100%',
                    backgroundImage:'linear-gradient(110deg, var(--cream2) 25%, var(--cream3) 45%, var(--cream2) 70%)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Masonry tile grid - increased row gap */}
        {!loading && !error && recipes.length > 0 && (
          <div style={{
            columns: '3 320px',
            gap: 32,
          }}>
            {recipes.map((recipe, i) => (
              <div key={recipe.id} style={{ breakInside:'avoid', marginBottom:32 }}>
                <RecipeCard
                  recipe={recipe}
                  index={i}
                  size={getSizeForIndex(i)}
                  onClick={() => setSelected(recipe)}
                />
              </div>
            ))}
          </div>
        )}
        </div>
      </main>

      {/* Pagination */}
      {!loading && !error && total > 0 && (
        <Pagination
          page={page} limit={limit} total={total}
          onPageChange={setPage}
          onLimitChange={l => { setLimit(l); setPage(1) }}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding:'32px 24px',
        background:'var(--cream2)',
        borderTop:'1px solid var(--cream4)',
        marginTop:'auto',
      }}>
        <div style={{ ...containerStyle, textAlign:'center' }}>
          <p style={{ color:'var(--text-muted)', fontSize:13, margin:0, letterSpacing:'0.02em' }}>
            Recipe Explorer · Discover exceptional recipes from across the United States
          </p>
          <p style={{ color:'var(--ink-subtle)', fontSize:12, marginTop:8, marginBottom:0 }}>
            © {new Date().getFullYear()} · Made with care
          </p>
        </div>
      </footer>

      {/* Drawer */}
      {selected && <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}