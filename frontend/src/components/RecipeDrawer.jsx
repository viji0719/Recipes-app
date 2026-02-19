import React, { useState } from 'react'
import StarRating from './StarRating.jsx'
import { getRecipeImageUrl, getCuisineGradient } from '../utils/ImageMap.js'

const NUTRIENT_LABELS = {
  calories: 'Calories', carbohydrateContent: 'Carbohydrates',
  cholesterolContent: 'Cholesterol', fiberContent: 'Fiber',
  proteinContent: 'Protein', saturatedFatContent: 'Saturated Fat',
  sodiumContent: 'Sodium', sugarContent: 'Sugar', fatContent: 'Fat',
}

export default function RecipeDrawer({ recipe, onClose }) {
  const [timeExpanded, setTimeExpanded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!recipe) return null

  const imgUrl = getRecipeImageUrl(recipe.title, recipe.cuisine, 800, 400)
  const gradient = getCuisineGradient(recipe.cuisine)

  return (
    <>
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(31,27,23,0.4)',
        backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', zIndex:100,
        animation:'overlayFadeIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
      }} />
      <div style={{
        position:'fixed', top:0, right:0, bottom:0,
        width:'min(540px, 100vw)',
        background:'var(--paper)',
        borderLeft:'1px solid var(--cream4)',
        zIndex:101,
        display:'flex', flexDirection:'column',
        animation:'drawerGlideIn 0.45s var(--ease-out-expo) forwards',
        overflowY:'auto',
        boxShadow:'-12px 0 48px rgba(31,27,23,0.15), 0 0 0 1px rgba(226,219,208,0.5)',
      }}>
        {/* Hero image */}
        <div style={{
          height: 240, flexShrink:0, position:'relative',
          background: gradient, overflow:'hidden',
        }}>
          {!imgError && (
            <img src={imgUrl} alt={recipe.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{ width:'100%', height:'100%', objectFit:'cover',
                opacity: imgLoaded ? 1 : 0, transition:'opacity 0.5s ease' }}
            />
          )}
          <div style={{ position:'absolute', inset:0,
            background:'linear-gradient(to top, rgba(20,14,8,0.8) 0%, rgba(20,14,8,0.1) 60%, transparent 100%)' }} />
          <button onClick={onClose} style={{
            position:'absolute', top:18, right:18,
            width:40, height:40, borderRadius:'50%',
            background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)',
            color:'#fff', fontSize:18,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all var(--transition)',
            border:'1px solid rgba(255,255,255,0.25)',
            boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => { e.target.style.background='rgba(255,255,255,0.35)'; e.target.style.transform='scale(1.05)' }}
          onMouseLeave={e => { e.target.style.background='rgba(255,255,255,0.18)'; e.target.style.transform='scale(1)' }}
          >✕</button>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'28px 28px 24px' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em',
              textTransform:'uppercase', color:'rgba(255,255,255,0.8)', marginBottom:8 }}>
              {recipe.cuisine}
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700,
              color:'#fff', lineHeight:1.25, textShadow:'0 2px 12px rgba(0,0,0,0.35)', letterSpacing:'0.02em' }}>
              {recipe.title}
            </h2>
            <div style={{ marginTop:10 }}>
              <StarRating rating={recipe.rating} size={15} light />
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding:'28px 28px 32px', display:'flex', flexDirection:'column', gap:24, flex:1,
          animation:'drawerContentFade 0.4s cubic-bezier(0.4,0,0.2,1) 0.15s both',
        }}>

          <Section title="Description">
            <p style={{ color:'var(--text-secondary)', lineHeight:1.75, fontSize:15 }}>
              {recipe.description || 'No description available.'}
            </p>
          </Section>

          <Section title="Total Time">
            <div onClick={() => setTimeExpanded(!timeExpanded)}
              style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <span style={{ fontSize:17, fontWeight:600, color:'var(--charcoal)',
                fontFamily:'var(--font-display)' }}>
                {recipe.total_time != null ? `${recipe.total_time} minutes` : '—'}
              </span>
              <span style={{
                width:22, height:22, borderRadius:'50%',
                background:'var(--cream2)', border:'1px solid var(--cream4)',
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                fontSize:11, color:'var(--text-muted)',
                transition:'transform 0.2s',
                transform: timeExpanded ? 'rotate(180deg)' : 'none',
              }}>▾</span>
            </div>
            {timeExpanded && (
              <div style={{ marginTop:12, display:'flex', gap:12, animation:'fadeUp 0.2s ease' }}>
                {[{ label:'Prep', val:recipe.prep_time }, { label:'Cook', val:recipe.cook_time }].map(({ label, val }) => (
                  <div key={label} style={{
                    flex:1, padding:'16px 18px',
                    background:'var(--cream2)', borderRadius:'var(--radius-lg)',
                    border:'1px solid var(--cream4)',
                    boxShadow:'0 1px 0 rgba(255,255,255,0.5) inset',
                  }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.08em',
                      textTransform:'uppercase', color:'#7a736b', marginBottom:4 }}>{label}</div>
                    <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--font-display)',
                      color:'var(--terracotta)' }}>
                      {val != null ? `${val}m` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {recipe.serves && (
            <Section title="Serves">
              <span style={{ fontSize:16, fontWeight:600, fontFamily:'var(--font-display)',
                color:'var(--charcoal)' }}>{recipe.serves}</span>
            </Section>
          )}

          {recipe.nutrients && Object.keys(recipe.nutrients).length > 0 && (
            <Section title="Nutrition Facts">
              <div style={{ border:'1px solid var(--cream4)', borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'0 1px 3px rgba(31,27,23,0.04)' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'var(--cream2)' }}>
                      <th style={{ padding:'12px 18px', textAlign:'left', color:'var(--text-secondary)',
                        fontWeight:600, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }}>Nutrient</th>
                      <th style={{ padding:'12px 18px', textAlign:'right', color:'var(--text-secondary)',
                        fontWeight:600, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(NUTRIENT_LABELS).map(([key, label], i) => {
                      const val = recipe.nutrients[key]
                      if (!val) return null
                      return (
                        <tr key={key} style={{
                          background: i%2===0 ? 'var(--paper)' : 'var(--cream2)',
                          borderTop:'1px solid var(--cream3)',
                        }}>
                          <td style={{ padding:'11px 18px', color:'var(--text-secondary)', fontSize:14 }}>{label}</td>
                          <td style={{ padding:'11px 18px', textAlign:'right', color:'var(--brown)',
                            fontWeight:600, fontSize:13 }}>{val}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </div>
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="section-header">
        {title}
      </div>
      {children}
    </div>
  )
}