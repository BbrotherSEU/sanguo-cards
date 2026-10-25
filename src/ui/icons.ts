const SHAPES: Record<string, string> = {
  gold: '<circle cx="12" cy="12" r="8" fill="#e8c56a"/><circle cx="12" cy="12" r="5" fill="none" stroke="#8a5a18" stroke-width="1.4"/>',
  jade: '<path d="M12 3l7 6-7 12L5 9z" fill="#3ecf9a"/><path d="M12 3v18M5 9h14" fill="none" stroke="#0e5a40" stroke-width="1"/>',
  ticket: '<rect x="4" y="6" width="16" height="12" rx="2" fill="#ffb74d"/><path d="M9 6v12M4 10h5M4 14h5" stroke="#8a4a10" stroke-width="1" fill="none"/>',
  seal: '<rect x="5" y="4" width="14" height="16" rx="2" fill="#c43c28"/><path d="M8 9h8M8 12h8M8 15h5" stroke="#fff1c4" stroke-width="1.2"/>',
  pill: '<rect x="4" y="8" width="16" height="8" rx="4" fill="#e53935"/><path d="M12 8v8" stroke="#fff" stroke-width="1.2"/>',
  stone: '<path d="M12 3l8 5v8l-8 5-8-5V8z" fill="#90a4ae"/><path d="M12 3v18M4 8l8 5 8-5" fill="none" stroke="#37474f" stroke-width="1"/>',
  iron: '<path d="M4 9h16l-2 9H6z" fill="#78909c"/><path d="M7 9l2-4h6l2 4" fill="#455a64"/><path d="M8 13h8" stroke="#cfd8dc" stroke-width="1"/>',
  chest: '<rect x="3" y="8" width="18" height="12" rx="1.5" fill="#8d6e63"/><path d="M3 13h18" stroke="#e8c56a" stroke-width="1.2"/><rect x="10" y="11" width="4" height="3" rx="0.5" fill="#e8c56a"/>',
  soul: '<path d="M12 3c4 4 6 6 6 10a6 6 0 1 1-12 0c0-4 2-6 6-10z" fill="#ce93d8"/>',
  arena: '<path d="M6 18l4-8 2 3 2-6 4 11" fill="none" stroke="#e8c56a" stroke-width="1.8" stroke-linejoin="round"/>',
  city: '<path d="M4.5 20.5v-7h15v7z" fill="#e8c56a"/><path d="M12 3.2L2.6 11h18.8z" fill="#c43c28"/><path d="M2.6 11l1.6 1.6h15.6L21.4 11" fill="#8a1f14"/><path d="M10.2 20.5v-4.6h3.6v4.6" fill="#5a3410"/><path d="M12 3.2V1.6" stroke="#e8c56a" stroke-width="1.2"/>',
  roster: '<path d="M12 4.2c-4.4 0-7.2 3-7.2 7.2v2h14.4v-2c0-4.2-2.8-7.2-7.2-7.2z" fill="#c43c28"/><path d="M12 4.2v9.2" stroke="#ffd54f" stroke-width="1.1"/><path d="M4.2 13.4h15.6v2.2H4.2z" fill="#e8c56a"/><path d="M10.7 15.6h2.6v5h-2.6z" fill="#e8c56a"/><path d="M12 1l1.3 1.8L12 4.6l-1.3-1.8z" fill="#e8c56a"/>',
  gacha: '<path d="M12 2l2.2 6.6H21l-5.4 4 2 6.4L12 15.8 6.4 19l2-6.4L3 8.6h6.8z" fill="#ffb74d"/>',
  drum: '<path d="M5.2 9.2v5.6c0 1.8 3 3.2 6.8 3.2s6.8-1.4 6.8-3.2V9.2" fill="#c43c28"/><ellipse cx="12" cy="9.2" rx="6.8" ry="3" fill="#f3e3bd" stroke="#8a5a18" stroke-width="1.1"/><path d="M5.2 9.2c0 1.8 3 3.2 6.8 3.2s6.8-1.4 6.8-3.2" fill="none" stroke="#8a5a18" stroke-width="0.9"/><circle cx="8.6" cy="14.6" r="0.9" fill="#ffd54f"/><circle cx="15.4" cy="14.6" r="0.9" fill="#ffd54f"/><path d="M4.8 3.4l4 2.8M19.2 3.4l-4 2.8" stroke="#e8c56a" stroke-width="1.5" fill="none"/>',
  war: '<path d="M5 21.2V2.4" stroke="#7a4a1a" stroke-width="1.7" fill="none"/><path d="M5 1.2l1.4 1.4L5 4 3.6 2.6z" fill="#e8c56a"/><path d="M5 4.6h13.8l-3.4 3.7 3.4 3.7H5z" fill="#c43c28"/><path d="M5 4.6h13.8l-3.4 3.7 3.4 3.7H5z" fill="none" stroke="#ffd54f" stroke-width="0.9"/><path d="M7.6 6.9h4M7.6 9.6h2.8" stroke="#ffd54f" stroke-width="0.9"/>',
  more: '<rect x="3.4" y="7" width="17.2" height="10" rx="5" fill="#f3e3bd" stroke="#8a5a18" stroke-width="1.1"/><path d="M8.6 10.4h6.8M8.6 13.4h6.8" stroke="#c43c28" stroke-width="1.2"/><circle cx="3.6" cy="12" r="1.7" fill="#8a5a18"/><circle cx="20.4" cy="12" r="1.7" fill="#8a5a18"/>',
  team: '<path d="M12 2.6l7.4 3v6.2c0 4.6-3.1 7.8-7.4 9.6-4.3-1.8-7.4-5-7.4-9.6V5.6z" fill="#8a5a18"/><path d="M12 4.6l5.4 2.2v5c0 3.7-2.5 6.3-5.4 7.8-2.9-1.5-5.4-4.1-5.4-7.8v-5z" fill="#c43c28"/><path d="M12 7.4v9M8.2 10.6h7.6" stroke="#ffd54f" stroke-width="1.3"/>',
  mail: '<rect x="3" y="6" width="18" height="13" rx="1.6" fill="#f3e3bd" stroke="#8a5a18"/><path d="M3.5 7.5L12 13l8.5-5.5" fill="none" stroke="#8a5a18" stroke-width="1.4"/><circle cx="12" cy="13.4" r="2.3" fill="#c43c28"/><circle cx="12" cy="13.4" r="2.3" fill="none" stroke="#ffd54f" stroke-width="0.7"/>',
  friends: '<circle cx="8.4" cy="8" r="2.6" fill="#e8c56a"/><path d="M3.4 18.8c.7-3.4 2.4-4.8 5-4.8s4.3 1.4 5 4.8z" fill="#e8c56a"/><circle cx="15.9" cy="8.6" r="2.3" fill="#c43c28"/><path d="M11.6 18.8c.6-2.9 2.1-4.1 4.3-4.1s3.7 1.2 4.3 4.1z" fill="#c43c28"/>',
  eye: '<path d="M2.4 12C5 7.6 8.3 5.6 12 5.6s7 2 9.6 6.4C19 16.4 15.7 18.4 12 18.4S5 16.4 2.4 12z" fill="none" stroke="#e8c56a" stroke-width="1.7"/><circle cx="12" cy="12" r="3.1" fill="#e8c56a"/><circle cx="12" cy="12" r="1.3" fill="#3a2410"/>',
  codex: '<path d="M12 5.6C10.2 4.2 7.2 4 4.4 4.6v13.2c2.8-.6 5.8-.4 7.6 1 1.8-1.4 4.8-1.6 7.6-1V4.6c-2.8-.6-5.8-.4-7.6 1z" fill="#f3e3bd" stroke="#8a5a18"/><path d="M12 5.6v13.2" stroke="#8a5a18" stroke-width="1"/><path d="M6.8 8h2.9M6.8 10.6h2.9M14.3 8h2.9M14.3 10.6h2.9" stroke="#c43c28" stroke-width="1.1"/>',
  flag: '<path d="M6.5 21V3" stroke="#8a5a18" stroke-width="1.7" fill="none"/><circle cx="6.5" cy="2.6" r="1.2" fill="#c43c28"/><path d="M6.5 4.4L18.5 8 6.5 11.6z" fill="#e8c56a" stroke="#8a5a18" stroke-width="0.9"/>',
  notice: '<rect x="4.6" y="2.8" width="14.8" height="2.6" rx="1.2" fill="#8a5a18"/><path d="M7 5.4h10v13.4l-2.5-1.8-2.5 1.8-2.5-1.8L7 18.8z" fill="#f3e3bd" stroke="#8a5a18"/><path d="M9.2 8.4h5.6M9.2 11.2h5.6M9.2 14h3.6" stroke="#c43c28" stroke-width="1.1"/>',
  equip: '<path d="M4 9h16v10H4z" fill="#8d6e63"/><path d="M8 9V7a4 4 0 0 1 8 0v2" fill="none" stroke="#e8c56a" stroke-width="1.4"/>',
  shop: '<path d="M5 9h14l-1.2 10H6.2z" fill="#e8c56a"/><path d="M8 9c0-3 8-3 8 0" fill="none" stroke="#8a5a18" stroke-width="1.4"/>',
  gift: '<rect x="4" y="10" width="16" height="9" rx="1" fill="#c43c28"/><path d="M4 10h16M12 10v9M8 10c0-3 4-3 4 0 0-3 4-3 4 0" fill="none" stroke="#ffd54f" stroke-width="1.3"/>',
  sword: '<path d="M6 18L16 4l2 2L8 20z" fill="#eceff1"/><path d="M6 18l-2 2 2-1zM14 8l2 2" stroke="#b0bec5" stroke-width="1"/>',
  armor: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" fill="#1e88e5"/><path d="M12 3v18" stroke="#90caf9" stroke-width="1"/>',
  ring: '<circle cx="12" cy="12" r="5" fill="none" stroke="#e8c56a" stroke-width="2.4"/><circle cx="12" cy="7" r="1.6" fill="#c43c28"/>',
  helm: '<path d="M5 13a7 7 0 0 1 14 0v3H5z" fill="#c43c28"/><path d="M8 16h8v2H8z" fill="#e8c56a"/><path d="M12 6v4" stroke="#ffe082" stroke-width="1.2"/>',
  boot: '<path d="M8 4h5v9l5 3v3H6v-4l2-2z" fill="#8d6e63"/><path d="M6 17h12" stroke="#e8c56a" stroke-width="1.2"/>',
  book: '<path d="M5 5h6v14H6a2 2 0 0 1-1-2z" fill="#c43c28"/><path d="M19 5h-6v14h5a2 2 0 0 0 1-2z" fill="#e53935"/><path d="M12 5v14" stroke="#ffe082" stroke-width="1"/>',
  atk: '<path d="M14 3l7 7-8 8-4-1-1-4z" fill="#ff8a65"/><path d="M4 20l6-6" stroke="#ffccbc" stroke-width="1.6"/>',
  hp: '<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" fill="#ef5350"/>',
  def: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" fill="#66bb6a"/>',
  up: '<path d="M12 5l7 8H5z" fill="#e8c56a"/><path d="M9 14h6v5H9z" fill="#e8c56a"/>',
  break: '<path d="M13 2l-2 8h6l-8 12 2-8H5z" fill="#ffb74d"/>',
  awaken: '<circle cx="12" cy="12" r="3" fill="#ce93d8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="#e1bee7" stroke-width="1.4"/>',
  refresh: '<path d="M19 12a7 7 0 1 1-2-5" fill="none" stroke="#e8c56a" stroke-width="1.8"/><path d="M17 3v5h-5" fill="none" stroke="#e8c56a" stroke-width="1.8"/>',
  back: '<path d="M15 5L8 12l7 7" fill="none" stroke="#e8c56a" stroke-width="2"/>',
  flame: '<path d="M12 3c3 4 5 6 5 10a5 5 0 1 1-10 0c0-2 1-3 2-5 0 2 1 3 3 3-1-3-0-6 0-8z" fill="#ff6a1a"/>',
  drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z" fill="#c6ff4a"/>',
  lock: '<rect x="6" y="11" width="12" height="8" rx="1.5" fill="#b39ddb"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#e1bee7" stroke-width="1.6"/>',
  burst: '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="#ffd54f"/>',
}

export function icon(name: string): string {
  const body = SHAPES[name] ?? SHAPES.more
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`
}

export function offerIcon(title: string): string {
  if (title.includes('元宝')) return icon('jade')
  if (title.includes('令')) return icon('ticket')
  if (title.includes('符')) return icon('seal')
  if (title.includes('丹')) return icon('pill')
  if (title.includes('石')) return icon('stone')
  if (title.includes('饷') || title.includes('银')) return icon('gold')
  return icon('equip')
}

const SKILL_ART = new Set([
  'heal',
  'regen',
  'heal-all',
  'regen-all',
  'burn',
  'poison',
  'control',
  'aoe',
  'execute',
  'passive-atk',
  'passive-def',
  'passive-hp',
  'strike',
])

/** 新机制效果的内联 SVG 图标（古风描金配色） */
const FX_SVG: Record<string, string> = {
  shield: '<path d="M12 2.6l7.6 3v6.1c0 4.9-3.2 8.3-7.6 10-4.4-1.7-7.6-5.1-7.6-10V5.6z" fill="#3f6fa8" stroke="#e8c56a" stroke-width="1.6"/><path d="M12 6.4v11M8.4 9.2h7.2M9.6 12.6h4.8" stroke="#ffe082" stroke-width="1.2" fill="none"/>',
  taunt: '<path d="M3 11h4l4-5v12l-4-5H3z" fill="#c43c28" stroke="#e8c56a" stroke-width="1.4"/><path d="M14 8.6c1.8 1 2.6 2 2.6 3.4S15.8 14.4 14 15.4M17.4 6.2c2.6 1.6 3.8 3.4 3.8 5.8" fill="none" stroke="#e8c56a" stroke-width="1.5" stroke-linecap="round"/>',
  pierce: '<path d="M5 19l9-9" stroke="#cfd8dc" stroke-width="2" stroke-linecap="round"/><path d="M13 4l7 7-2 2-7-7z" fill="#8d9aa5" stroke="#e8c56a" stroke-width="1.2"/><path d="M6 15l3 3-3 3-3-3z" fill="#c43c28" stroke="#ffd54f" stroke-width="1"/>',
  sunder: '<path d="M12 2.6l7.6 3v6.1c0 4.9-3.2 8.3-7.6 10-4.4-1.7-7.6-5.1-7.6-10V5.6z" fill="none" stroke="#e8c56a" stroke-width="1.6"/><path d="M9 12l6-5M9 7l6 5" stroke="#e53935" stroke-width="1.8" stroke-linecap="round"/>',
  mark: '<circle cx="12" cy="12" r="6" fill="none" stroke="#c43c28" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="#e53935"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#e8c56a" stroke-width="1.4"/>',
  chain: '<path d="M9.4 14.6a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.2 1.2" fill="none" stroke="#e8c56a" stroke-width="1.8" stroke-linecap="round"/><path d="M14.6 9.4a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.2-1.2" fill="none" stroke="#c43c28" stroke-width="1.8" stroke-linecap="round"/>',
  absorb: '<path d="M12 2.6c3.4 4 5.4 6.4 5.4 9.6a5.4 5.4 0 0 1-10.8 0c0-3.2 2-5.6 5.4-9.6z" fill="#ce93d8" stroke="#e8c56a" stroke-width="1.2"/><path d="M9.6 13.2l1.8 1.8 3.6-3.6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
  weaken: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="#b39ddb" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="3.4" fill="#b39ddb"/>',
  haste: '<path d="M13.6 2.4L5.4 13.2h5L9.2 21.6l8.6-11.2h-5.4z" fill="#ffd54f" stroke="#c43c28" stroke-width="1.2"/>',
  cleanse: '<path d="M12 2.6c3.4 4 5.4 6.4 5.4 9.6a5.4 5.4 0 0 1-10.8 0c0-3.2 2-5.6 5.4-9.6z" fill="#a5d6a7" stroke="#e8c56a" stroke-width="1.2"/><path d="M9 12.4l2.2 2.2 4-4.4" fill="none" stroke="#2e7d32" stroke-width="1.6" stroke-linecap="round"/>',
  drain: '<path d="M12 3c3.2 4 5 6.2 5 9.2a5 5 0 0 1-10 0c0-3 1.8-5.2 5-9.2z" fill="#e53935" stroke="#ffd54f" stroke-width="1.2"/><path d="M12 17.6v3.2M9.4 19.2h5.2" stroke="#e53935" stroke-width="1.5" stroke-linecap="round"/>',
}

export function skillIcon(fx: string): string {
  const svg = FX_SVG[fx]
  if (svg) return `<svg class="sk-photo sk-svg" viewBox="0 0 24 24" aria-hidden="true">${svg}</svg>`
  const name = SKILL_ART.has(fx) ? fx : 'strike'
  return `<img class="sk-photo" src="/skills/${name}.jpg" alt="" />`
}
