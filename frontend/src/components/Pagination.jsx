import React from 'react'

export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.ceil(total / limit)

  const btn = (active, disabled) => ({
    padding: '10px 16px',
    borderRadius: 12,
    background: active ? 'var(--terracotta)' : 'var(--paper)',
    color: active ? '#fff' : disabled ? 'var(--ink-subtle)' : 'var(--text-secondary)',
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    border: '1.5px solid ' + (active ? 'var(--terracotta)' : 'var(--cream4)'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    minWidth: 40, textAlign: 'center',
    transition: 'all var(--transition)',
    boxShadow: active ? '0 2px 12px rgba(168,92,58,0.25)' : 'none',
  })

  const delta = 2
  const pages = []
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i)

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '28px 24px',
      borderTop: '1px solid var(--cream4)',
      background: 'var(--cream2)',
      flexWrap: 'wrap', gap: 16,
      boxShadow: '0 -1px 0 rgba(255,255,255,0.4) inset',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em' }}>
        {total === 0 ? 'No results' : `Showing ${(page-1)*limit+1}–${Math.min(page*limit,total)} of ${total.toLocaleString()} recipes`}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 10 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Per page:</span>
          <select value={limit} onChange={e => onLimitChange(Number(e.target.value))}
            style={{ background:'var(--paper)', color:'var(--charcoal)', border:'1.5px solid var(--cream4)',
              borderRadius:'var(--radius)', padding:'7px 32px 7px 12px', fontSize:13, cursor:'pointer', minWidth:60 }}>
            {[15,20,25,30,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button style={btn(false, page===1)} onClick={() => onPageChange(1)} disabled={page===1}>«</button>
        <button style={btn(false, page===1)} onClick={() => onPageChange(page-1)} disabled={page===1}>‹</button>
        {page > delta+1 && <><button style={btn(false,false)} onClick={() => onPageChange(1)}>1</button>{page>delta+2 && <span style={{color:'var(--text-muted)', padding:'0 2px'}}>…</span>}</>}
        {pages.map(p => <button key={p} style={btn(p===page,false)} onClick={() => onPageChange(p)}>{p}</button>)}
        {page < totalPages-delta && <>{page<totalPages-delta-1 && <span style={{color:'var(--text-muted)', padding:'0 2px'}}>…</span>}<button style={btn(false,false)} onClick={() => onPageChange(totalPages)}>{totalPages}</button></>}
        <button style={btn(false, page===totalPages)} onClick={() => onPageChange(page+1)} disabled={page===totalPages}
          onMouseEnter={e => { if (page<totalPages) { e.target.style.background='var(--cream3)'; e.target.style.transform='translateY(-1px)' } }}
          onMouseLeave={e => { e.target.style.background='var(--paper)'; e.target.style.transform='translateY(0)' }}
        >›</button>
        <button style={btn(false, page===totalPages)} onClick={() => onPageChange(totalPages)} disabled={page===totalPages}
          onMouseEnter={e => { if (page<totalPages) { e.target.style.background='var(--cream3)'; e.target.style.transform='translateY(-1px)' } }}
          onMouseLeave={e => { e.target.style.background='var(--paper)'; e.target.style.transform='translateY(0)' }}
        >»</button>
      </div>
      </div>
    </div>
  )
}