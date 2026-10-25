const SHAPES: Record<string, string> = {
  gold: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="12" cy="8.6" rx="6.9" ry="3" fill="#e8b84a"/><rect x="10.7" y="7" width="2.6" height="3.2" rx=".5" fill="#8a4b1e"/><path d="M5.1 14.2v1.6c0 1.7 3.1 3.1 6.9 3.1s6.9-1.4 6.9-3.1v-1.6" fill="#d29a2e"/><ellipse cx="12" cy="14.2" rx="6.9" ry="3" fill="#ffd75e"/><rect x="10.7" y="12.6" width="2.6" height="3.2" rx=".5" fill="#a8301f" stroke="none"/><ellipse cx="12" cy="14.2" rx="6.9" ry="3" fill="none"/></g>',
  jade: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round"><circle cx="12" cy="12" r="8.4" fill="#3ecf9a"/><circle cx="12" cy="12" r="3.1" fill="#166b4e"/><path d="M12 3.6a8.4 8.4 0 0 1 0 16.8" fill="none" stroke="#8ff3cc" stroke-width="1.5"/><circle cx="8.3" cy="7.9" r="1.7" fill="#fff" opacity=".42" stroke="none"/></g>',
  ticket: '<rect x="4" y="6" width="16" height="12" rx="2" fill="#ffb74d"/><path d="M9 6v12M4 10h5M4 14h5" stroke="#8a4a10" stroke-width="1" fill="none"/>',
  seal: '<rect x="5" y="4" width="14" height="16" rx="2" fill="#c43c28"/><path d="M8 9h8M8 12h8M8 15h5" stroke="#fff1c4" stroke-width="1.2"/>',
  pill: '<rect x="4" y="8" width="16" height="8" rx="4" fill="#e53935"/><path d="M12 8v8" stroke="#fff" stroke-width="1.2"/>',
  stone: '<path d="M12 3l8 5v8l-8 5-8-5V8z" fill="#90a4ae"/><path d="M12 3v18M4 8l8 5 8-5" fill="none" stroke="#37474f" stroke-width="1"/>',
  iron: '<path d="M4 9h16l-2 9H6z" fill="#78909c"/><path d="M7 9l2-4h6l2 4" fill="#455a64"/><path d="M8 13h8" stroke="#cfd8dc" stroke-width="1"/>',
  chest: '<rect x="3" y="8" width="18" height="12" rx="1.5" fill="#8d6e63"/><path d="M3 13h18" stroke="#e8c56a" stroke-width="1.2"/><rect x="10" y="11" width="4" height="3" rx="0.5" fill="#e8c56a"/>',
  soul: '<path d="M12 3c4 4 6 6 6 10a6 6 0 1 1-12 0c0-4 2-6 6-10z" fill="#ce93d8"/>',
  arena: '<path d="M6 18l4-8 2 3 2-6 4 11" fill="none" stroke="#e8c56a" stroke-width="1.8" stroke-linejoin="round"/>',
  city: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M2.6 12.4c2.5-.5 4.2-2.3 5.1-5.6h8.6c.9 3.3 2.6 5.1 5.1 5.6-1.2 1.5-2.8 1.9-4.5 1.7H7.1c-1.7.2-3.3-.2-4.5-1.7z" fill="#d8452f"/><path d="M12 3.9v2.9" fill="none" stroke="#ffd75e" stroke-width="1.3"/><circle cx="12" cy="3" r="1" fill="#ffd75e"/><rect x="7" y="15.6" width="10" height="5.8" rx=".8" fill="#f6e6c2"/><path d="M10.2 21.4v-2.6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v2.6" fill="#a8301f"/><path d="M8.2 17.6h1.4M14.4 17.6h1.4" stroke="#e8c56a" stroke-width="1"/></g>',
  roster: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M12 1.6l2.2 3.6h-4.4z" fill="#ffd75e"/><path d="M5.4 10.4c0-4 2.9-6.8 6.6-6.8s6.6 2.8 6.6 6.8v4.4H5.4z" fill="#a8301f"/><path d="M5.4 10.4h13.2" fill="none" stroke="#e8c56a" stroke-width="1.5"/><path d="M9.4 14.8h5.2v4.6H9.4z" fill="#3a2410"/><path d="M8 19.4l1.2 2.4 1-2.4m5.6 0l-1.2 2.4-1-2.4" fill="none" stroke="#e8c56a" stroke-width="1.1"/></g>',
  gacha: '<path d="M12 2l2.2 6.6H21l-5.4 4 2 6.4L12 15.8 6.4 19l2-6.4L3 8.6h6.8z" fill="#ffb74d"/>',
  drum: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round"><path d="M5.1 8.3v6.4c0 1.7 3.1 3.1 6.9 3.1s6.9-1.4 6.9-3.1V8.3" fill="#cc3a26"/><ellipse cx="12" cy="8.3" rx="6.9" ry="2.8" fill="#f6e6c2"/><ellipse cx="12" cy="8.3" rx="2.3" ry="1" fill="#d8452f"/><path d="M5.1 8.3c0 1.5 3.1 2.8 6.9 2.8s6.9-1.3 6.9-2.8" fill="none"/><circle cx="8" cy="14.7" r=".8" fill="#ffd75e" stroke="none"/><circle cx="16" cy="14.7" r=".8" fill="#ffd75e" stroke="none"/><path d="M3.4 3.4l3.8 2.4M20.6 3.4l-3.8 2.4" stroke="#8a4b1e" stroke-width="1.7"/><circle cx="3.2" cy="3.2" r=".9" fill="#e8c56a"/><circle cx="20.8" cy="3.2" r=".9" fill="#e8c56a"/></g>',
  war: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M5.4 21.6V2.6" fill="none" stroke-width="1.7"/><path d="M5.4 3.2c3-1 5.4 1.2 8 1.2 1.6 0 3-.5 4.6-1.2v9.2c-1.6.7-3 1.2-4.6 1.2-2.6 0-5-2.2-8-1.2z" fill="#d8452f"/><path d="M8.4 6.4c1.6.5 2.8 1.1 4 1.9" fill="none" stroke="#ffd75e" stroke-width="1.1"/><circle cx="5.4" cy="1.8" r="1.1" fill="#ffd75e"/></g>',
  more: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round"><rect x="6" y="5.2" width="12" height="13.6" rx="1.6" fill="#f6e6c2"/><rect x="3.6" y="3.2" width="16.8" height="3.4" rx="1.7" fill="#a8301f"/><rect x="3.6" y="17.4" width="16.8" height="3.4" rx="1.7" fill="#a8301f"/><circle cx="8.8" cy="12" r="1.25" fill="#cc3a26" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="#cc3a26" stroke="none"/><circle cx="15.2" cy="12" r="1.25" fill="#cc3a26" stroke="none"/></g>',
  team: '<path d="M12 2.6l7.4 3v6.2c0 4.6-3.1 7.8-7.4 9.6-4.3-1.8-7.4-5-7.4-9.6V5.6z" fill="#8a5a18"/><path d="M12 4.6l5.4 2.2v5c0 3.7-2.5 6.3-5.4 7.8-2.9-1.5-5.4-4.1-5.4-7.8v-5z" fill="#c43c28"/><path d="M12 7.4v9M8.2 10.6h7.6" stroke="#ffd54f" stroke-width="1.3"/>',
  mail: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><rect x="2.8" y="6" width="18.4" height="13" rx="2" fill="#f6e6c2"/><path d="M3.6 7.4L12 13l8.4-5.6" fill="none"/><circle cx="12" cy="14.6" r="2.5" fill="#cc3a26"/><circle cx="12" cy="14.6" r="1.1" fill="#ffd75e" stroke="none"/></g>',
  friends: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round"><circle cx="8.2" cy="8.2" r="3.1" fill="#ffd75e"/><path d="M2.8 19.4c.6-3.6 2.6-5.2 5.4-5.2s4.8 1.6 5.4 5.2z" fill="#e8c56a"/><circle cx="16.4" cy="9" r="2.7" fill="#f6e6c2"/><path d="M11.8 19.4c.5-3 2.2-4.4 4.6-4.4s4.1 1.4 4.6 4.4z" fill="#f0dca8"/></g>',
  eye: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M2.4 12.4C5 7.9 8.3 5.7 12 5.7s7 2.2 9.6 6.7C19 16.9 15.7 19 12 19s-7-2.1-9.6-6.6z" fill="#f6e6c2"/><circle cx="12" cy="12.3" r="3.4" fill="#ffd75e"/><circle cx="12" cy="12.3" r="1.7" fill="#3a2410" stroke="none"/><circle cx="13.2" cy="11.2" r=".7" fill="#fff" stroke="none"/><path d="M5.6 6.6L7.4 4M12 4.9V2.6M18.4 6.6l-1.8-2.6" fill="none"/></g>',
  codex: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round"><path d="M12 6.2C10 4.4 6.8 4.1 3.6 4.8v13.4c3.2-.7 6.4-.4 8.4 1.4 2-1.8 5.2-2.1 8.4-1.4V4.8C17.2 4.1 14 4.4 12 6.2z" fill="#f6e6c2"/><path d="M12 6.2v13.4" fill="none"/><path d="M5.8 8.2h3.6M5.8 11h3.6M14.6 8.2H18M14.6 11H18" fill="none" stroke="#cc3a26" stroke-width="1.2"/></g>',
  flag: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M6.2 21.4V3" fill="none" stroke-width="1.7"/><path d="M6.2 4.2L18.8 8 6.2 11.8z" fill="#d8452f"/><path d="M8.6 6.2L12 8l-3.4 1.8" fill="none" stroke="#ffd75e" stroke-width="1"/><circle cx="6.2" cy="2.1" r="1.1" fill="#ffd75e"/></g>',
  notice: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round"><rect x="4.4" y="3.2" width="15.2" height="2.8" rx="1.4" fill="#a8301f"/><path d="M6.8 6h10.4v13.8l-2.6-2-2.6 2-2.6-2-2.6 2z" fill="#f6e6c2"/><path d="M9.2 9.2h5.6M9.2 12.2h5.6M9.2 15.2h3.4" fill="none" stroke="#cc3a26" stroke-width="1.2"/></g>',
  equip: '<path d="M4 9h16v10H4z" fill="#8d6e63"/><path d="M8 9V7a4 4 0 0 1 8 0v2" fill="none" stroke="#e8c56a" stroke-width="1.4"/>',
  shop: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M4.2 9.4h15.6l-1.4 10.4H5.6z" fill="#f6e6c2"/><path d="M3.2 9.4L5.6 4.2h12.8l2.4 5.2z" fill="#cc3a26"/><path d="M9.4 9.4L10.8 4.2M14.6 9.4L13.2 4.2" fill="none" stroke="#ffd75e" stroke-width="1"/><path d="M8.6 13.6h6.8" fill="none" stroke="#a8301f" stroke-width="1.7"/></g>',
  gift: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><rect x="3.6" y="9.6" width="16.8" height="10.6" rx="1.4" fill="#cc3a26"/><rect x="2.4" y="6.2" width="19.2" height="3.6" rx="1" fill="#d8452f"/><path d="M12 6.2v14" fill="none" stroke="#ffd75e" stroke-width="1.8"/><path d="M12 6.2c-1.2-3-2.9-3.7-4.1-2.7-1.2 1 .3 2.7 4.1 2.7 3.8 0 5.3-1.7 4.1-2.7-1.2-1-2.9-.3-4.1 2.7z" fill="#ffd75e"/></g>',
  sword: '<path d="M6 18L16 4l2 2L8 20z" fill="#eceff1"/><path d="M6 18l-2 2 2-1zM14 8l2 2" stroke="#b0bec5" stroke-width="1"/>',
  armor: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" fill="#1e88e5"/><path d="M12 3v18" stroke="#90caf9" stroke-width="1"/>',
  ring: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><circle cx="12" cy="13.6" r="6" fill="none" stroke="#8a4b1e" stroke-width="4.2"/><circle cx="12" cy="13.6" r="6" fill="none" stroke="#e8c56a" stroke-width="2.8"/><path d="M12 3l3.4 4.2L12 11.2 8.6 7.2z" fill="#cc3a26"/><circle cx="10.9" cy="6.6" r=".85" fill="#fff" opacity=".85" stroke="none"/></g>',
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
  flame: '<g stroke="#4a2c12" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2.4c3.4 4.2 5.6 6.6 5.6 10.6a5.6 5.6 0 0 1-11.2 0c0-2.2 1-4 2.4-6 .1 2.2 1.1 3.4 2.8 3.6-1-3-.6-6.2.4-8.2z" fill="#ff6a1a"/><path d="M12 12.4c1.3 1.7 2 2.7 2 4a2 2 0 0 1-4 0c0-1.3.7-2.3 2-4z" fill="#ffd75e" stroke="none"/></g>',
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
  return `<img class="sk-photo" src="/skills/${name}.webp" alt="" />`
}
