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
  city: '<path d="M4 20V10l8-6 8 6v10z" fill="#e8c56a"/><path d="M10 20v-6h4v6" fill="#6a4010"/>',
  roster: '<circle cx="12" cy="8" r="3" fill="#e8c56a"/><path d="M6 19c1-4 3.2-5 6-5s5 1 6 5" fill="#e8c56a"/>',
  gacha: '<path d="M12 2l2.2 6.6H21l-5.4 4 2 6.4L12 15.8 6.4 19l2-6.4L3 8.6h6.8z" fill="#ffb74d"/>',
  war: '<path d="M6 21V4h2l8 3-8 3h-2" fill="#c43c28"/><path d="M6 21H4" stroke="#e8c56a" stroke-width="1.6"/>',
  more: '<circle cx="6" cy="12" r="1.7" fill="#e8c56a"/><circle cx="12" cy="12" r="1.7" fill="#e8c56a"/><circle cx="18" cy="12" r="1.7" fill="#e8c56a"/>',
  team: '<circle cx="8" cy="9" r="2.2" fill="#e8c56a"/><circle cx="16" cy="9" r="2.2" fill="#e8c56a"/><path d="M3 18c.6-3 2.2-4 5-4s4.4 1 5 4M11 18c.6-3 2.2-4 5-4s4.4 1 5 4" fill="#e8c56a"/>',
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

export function skillIcon(fx: string): string {
  const name = SKILL_ART.has(fx) ? fx : 'strike'
  return `<img class="sk-photo" src="/skills/${name}.jpg" alt="" />`
}
