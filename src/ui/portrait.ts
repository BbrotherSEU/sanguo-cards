import type { HeroDef, Rarity } from '../data/types'

/**
 * 卡牌立绘（程序化 SVG）
 * 半身立绘构图：大头、清晰五官、肩甲/披风层次、角色专属武器与品质外框。
 */
export function portraitSvg(hero: HeroDef, size = 160): string {
  const { id, color, faction, role, name, rarity } = hero
  const ink = shade(color, -48)
  const mid = shade(color, -8)
  const light = shade(color, 42)
  const skin = femaleHero(id) ? '#f7d4c0' : '#f0c4a0'
  const hair = hairFor(id, faction)
  const seed = hash(id)
  const lean = ((seed % 5) - 2) * 1.2
  const h = Math.round((size * 240) / 160)
  const uid = id.replace(/[^a-z0-9]/gi, '')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 240" width="${size}" height="${h}" class="portrait-svg rarity-${rarity}" aria-hidden="true">
  <defs>
    <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${raritySky(rarity, light)}"/>
      <stop offset="45%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="#060402"/>
    </linearGradient>
    <linearGradient id="cloth-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="45%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${ink}"/>
    </linearGradient>
    <linearGradient id="metal-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff3c4"/>
      <stop offset="55%" stop-color="#c9a227"/>
      <stop offset="100%" stop-color="#6a4a10"/>
    </linearGradient>
    <radialGradient id="aura-${uid}" cx="50%" cy="32%" r="58%">
      <stop offset="0%" stop-color="${rarityGlow(rarity)}" stop-opacity="0.62"/>
      <stop offset="55%" stop-color="${color}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cheek-${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e8a090" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#e8a090" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="160" height="240" fill="url(#sky-${uid})"/>
  <ellipse cx="80" cy="88" rx="78" ry="92" fill="url(#aura-${uid})"/>
  ${factionDecor(faction, color)}
  ${raritySparkles(rarity)}

  <g transform="translate(${lean},8)">
    ${cape(role, color, ink)}
    ${shoulderArmor(role, uid, color, light, ink)}
    ${body(role, uid, ink, light, color)}
    ${arms(role, id, color, ink, light)}
    ${head(id, faction, role, skin, hair, ink, color, light, uid)}
  </g>

  ${uniqueGear(id, color, light, ink)}
  ${rarityFrame(rarity)}

  <rect x="8" y="204" width="144" height="28" rx="5" fill="rgba(6,3,1,0.78)" stroke="${rarityStroke(rarity)}" stroke-width="1.8"/>
  <text x="80" y="223" text-anchor="middle" fill="#f8ecd0" font-size="14" font-family="serif" font-weight="700" letter-spacing="2.5">${name}</text>

  <rect x="7" y="7" width="38" height="18" rx="3" fill="${rarityStroke(rarity)}"/>
  <text x="26" y="20" text-anchor="middle" fill="#120a04" font-size="11" font-weight="800">${rarity}</text>
  <rect x="115" y="7" width="38" height="18" rx="3" fill="rgba(0,0,0,0.58)" stroke="${factionStroke(faction)}" stroke-width="1.2"/>
  <text x="134" y="20" text-anchor="middle" fill="${factionStroke(faction)}" font-size="11" font-weight="700">${factionLabel(faction)}</text>
</svg>`
}

function femaleHero(id: string): boolean {
  return ['diaochan', 'xiaoqiao', 'huangyueying', 'daqiao', 'zhenji', 'sunshangxiang', 'caiwenji'].includes(id)
}

function hairFor(id: string, faction: string): string {
  if (id === 'diaochan') return '#2a1018'
  if (id === 'xiaoqiao') return '#5a3010'
  if (id === 'huangyueying') return '#3a2810'
  if (id === 'zhouyu') return '#2a1810'
  if (id === 'zhangfei') return '#0c0c10'
  if (faction === 'wu') return '#3a2418'
  if (faction === 'wei') return '#141018'
  return '#120c08'
}

function raritySky(rarity: string, light: string): string {
  if (rarity === 'SSR') return shade(light, 36)
  if (rarity === 'SR') return shade(light, 14)
  if (rarity === 'R') return shade(light, 6)
  return light
}

function rarityGlow(rarity: string): string {
  if (rarity === 'SSR') return '#ffd54f'
  if (rarity === 'SR') return '#e040fb'
  if (rarity === 'R') return '#40c4ff'
  return '#90a4ae'
}

function rarityStroke(rarity: string): string {
  if (rarity === 'SSR') return '#ffb74d'
  if (rarity === 'SR') return '#ce93d8'
  if (rarity === 'R') return '#4fc3f7'
  return '#9aa0a6'
}

function raritySparkles(rarity: string): string {
  const c = rarityGlow(rarity)
  if (rarity === 'SSR') {
    return `
    <circle cx="28" cy="48" r="1.6" fill="${c}" opacity="0.9"/>
    <circle cx="132" cy="62" r="1.4" fill="#fff" opacity="0.75"/>
    <circle cx="40" cy="150" r="1.2" fill="${c}" opacity="0.7"/>
    <circle cx="122" cy="140" r="1.5" fill="#fff8e0" opacity="0.8"/>
    <circle cx="80" cy="36" r="1.8" fill="${c}" opacity="0.65"/>`
  }
  if (rarity === 'SR') {
    return `
    <circle cx="30" cy="55" r="1.3" fill="${c}" opacity="0.75"/>
    <circle cx="128" cy="70" r="1.2" fill="#fff" opacity="0.55"/>
    <circle cx="118" cy="145" r="1.1" fill="${c}" opacity="0.6"/>`
  }
  if (rarity === 'R') {
    return `
    <circle cx="32" cy="60" r="1.1" fill="${c}" opacity="0.55"/>
    <circle cx="126" cy="75" r="1" fill="#fff" opacity="0.4"/>`
  }
  return ''
}

function rarityFrame(rarity: string): string {
  const stroke = rarityStroke(rarity)
  if (rarity === 'SSR') {
    return `
    <rect x="2.5" y="2.5" width="155" height="235" rx="9" fill="none" stroke="${stroke}" stroke-width="3.2"/>
    <rect x="7" y="7" width="146" height="226" rx="6" fill="none" stroke="#fff3c4" stroke-width="1.1" opacity="0.55"/>
    <path d="M14 14 L30 14 L14 30 Z" fill="${stroke}" opacity="0.9"/>
    <path d="M146 14 L130 14 L146 30 Z" fill="${stroke}" opacity="0.9"/>
    <path d="M14 226 L30 226 L14 210 Z" fill="${stroke}" opacity="0.9"/>
    <path d="M146 226 L130 226 L146 210 Z" fill="${stroke}" opacity="0.9"/>`
  }
  if (rarity === 'SR') {
    return `
    <rect x="2.5" y="2.5" width="155" height="235" rx="9" fill="none" stroke="${stroke}" stroke-width="2.8"/>
    <rect x="8" y="8" width="144" height="224" rx="5" fill="none" stroke="${stroke}" stroke-width="1.1" opacity="0.4"/>
    <circle cx="16" cy="16" r="2.2" fill="${stroke}" opacity="0.85"/>
    <circle cx="144" cy="16" r="2.2" fill="${stroke}" opacity="0.85"/>
    <circle cx="16" cy="224" r="2.2" fill="${stroke}" opacity="0.85"/>
    <circle cx="144" cy="224" r="2.2" fill="${stroke}" opacity="0.85"/>`
  }
  return `
  <rect x="2.5" y="2.5" width="155" height="235" rx="9" fill="none" stroke="${stroke}" stroke-width="2.4"/>
  <rect x="8" y="8" width="144" height="224" rx="5" fill="none" stroke="${stroke}" stroke-width="0.9" opacity="0.28"/>`
}

function factionLabel(f: string): string {
  return ({ shu: '蜀', wei: '魏', wu: '吴', qun: '群' } as Record<string, string>)[f] ?? ''
}

function factionStroke(f: string): string {
  return ({ shu: '#66bb6a', wei: '#64b5f6', wu: '#4dd0e1', qun: '#f48fb1' } as Record<string, string>)[f] ?? '#e8c56a'
}

function factionDecor(faction: string, color: string): string {
  if (faction === 'shu') {
    return `<path d="M0 175 Q80 130 160 175 L160 240 L0 240 Z" fill="${color}" opacity="0.14"/>
    <path d="M70 28 L80 12 L90 28 L84 26 L80 34 L76 26 Z" fill="${color}" opacity="0.22"/>`
  }
  if (faction === 'wei') {
    return `<polygon points="80,20 104,58 80,48 56,58" fill="${color}" opacity="0.2"/>
    <path d="M0 185 L160 185 L160 240 L0 240 Z" fill="${color}" opacity="0.1"/>`
  }
  if (faction === 'wu') {
    return `<path d="M0 160 Q40 138 80 162 Q120 186 160 155 L160 240 L0 240 Z" fill="${color}" opacity="0.13"/>
    <path d="M20 50 Q40 30 55 48" fill="none" stroke="${color}" stroke-width="2" opacity="0.25"/>`
  }
  return `<circle cx="80" cy="110" r="68" fill="${color}" opacity="0.1"/>
  <path d="M0 190 L160 190 L160 240 L0 240 Z" fill="${color}" opacity="0.1"/>`
}

function cape(role: string, color: string, ink: string): string {
  if (role === 'mage') {
    return `<path d="M28 95 Q80 58 132 95 L142 200 Q80 222 18 200 Z" fill="${color}" opacity="0.48" stroke="${ink}" stroke-width="1.2"/>
    <path d="M42 105 Q80 78 118 105" fill="none" stroke="${shade(color, 50)}" stroke-width="2.2" opacity="0.5"/>
    <path d="M48 130 Q80 112 112 130" fill="none" stroke="${shade(color, 30)}" stroke-width="1.4" opacity="0.35"/>`
  }
  if (role === 'tank') {
    return `<path d="M34 98 L80 82 L126 98 L134 195 L80 214 L26 195 Z" fill="${color}" opacity="0.36" stroke="${ink}"/>
    <path d="M48 110 L80 98 L112 110" fill="none" stroke="${shade(color, 40)}" stroke-width="2" opacity="0.4"/>`
  }
  if (role === 'heal' || role === 'support') {
    return `<ellipse cx="80" cy="150" rx="62" ry="58" fill="${color}" opacity="0.14"/>
    <path d="M36 102 Q80 80 124 102 L130 190 Q80 172 30 190 Z" fill="${color}" opacity="0.34"/>`
  }
  return `<path d="M32 92 Q80 62 128 92 L140 198 Q80 178 20 198 Z" fill="${color}" opacity="0.4" stroke="${ink}"/>
  <path d="M46 108 Q80 88 114 108" fill="none" stroke="${shade(color, 45)}" stroke-width="2" opacity="0.4"/>`
}

function shoulderArmor(role: string, uid: string, color: string, light: string, ink: string): string {
  if (role === 'tank' || role === 'warrior' || role === 'dps' || role === 'atk') {
    return `
    <ellipse cx="46" cy="108" rx="16" ry="11" fill="url(#metal-${uid})" stroke="${ink}" stroke-width="1.2"/>
    <ellipse cx="114" cy="108" rx="16" ry="11" fill="url(#metal-${uid})" stroke="${ink}" stroke-width="1.2"/>
    <path d="M36 105 L46 98 L56 105" fill="none" stroke="${light}" stroke-width="1.2" opacity="0.6"/>
    <path d="M104 105 L114 98 L124 105" fill="none" stroke="${light}" stroke-width="1.2" opacity="0.6"/>`
  }
  if (role === 'mage') {
    return `
    <path d="M38 104 Q48 96 58 106" fill="none" stroke="${light}" stroke-width="3" opacity="0.5"/>
    <path d="M102 106 Q112 96 122 104" fill="none" stroke="${light}" stroke-width="3" opacity="0.5"/>`
  }
  return `
  <ellipse cx="48" cy="110" rx="12" ry="8" fill="${color}" opacity="0.45" stroke="${ink}"/>
  <ellipse cx="112" cy="110" rx="12" ry="8" fill="${color}" opacity="0.45" stroke="${ink}"/>`
}

function body(role: string, uid: string, ink: string, light: string, color: string): string {
  const torso = `<path d="M46 100 Q80 86 114 100 L124 178 Q80 198 36 178 Z" fill="url(#cloth-${uid})" stroke="${ink}" stroke-width="1.5"/>`
  if (role === 'tank') {
    return `${torso}
    <path d="M56 108 L80 98 L104 108 L102 152 L80 164 L58 152 Z" fill="url(#metal-${uid})" stroke="#c9a227" stroke-width="1.3"/>
    <path d="M68 118 L80 110 L92 118 L90 140 L80 148 L70 140 Z" fill="#fff8e0" opacity="0.32"/>
    <rect x="72" y="128" width="16" height="10" rx="2" fill="${color}" opacity="0.5"/>`
  }
  if (role === 'mage') {
    return `${torso}
    <path d="M58 110 L80 100 L102 110 L100 158 L80 168 L60 158 Z" fill="${light}" opacity="0.32"/>
    <circle cx="80" cy="132" r="9" fill="url(#metal-${uid})" stroke="${ink}"/>
    <circle cx="80" cy="132" r="4" fill="#fff8e0" opacity="0.5"/>
    <path d="M54 168 Q80 182 106 168" fill="none" stroke="${light}" stroke-width="2" opacity="0.45"/>`
  }
  if (role === 'heal' || role === 'support') {
    return `${torso}
    <path d="M54 112 Q80 102 106 112 L104 152 Q80 162 56 152 Z" fill="${light}" opacity="0.28"/>
    <path d="M68 128 Q80 138 92 128" fill="none" stroke="#e8c56a" stroke-width="1.8"/>
    <circle cx="80" cy="142" r="3" fill="#e8c56a"/>`
  }
  return `${torso}
  <path d="M54 108 L80 98 L106 108 L104 156 L80 168 L56 156 Z" fill="${light}" opacity="0.28"/>
  <path d="M70 122 L80 114 L90 122" fill="none" stroke="#e8c56a" stroke-width="1.8"/>
  <rect x="56" y="158" width="48" height="10" rx="2" fill="#c9a227" stroke="${ink}"/>
  <circle cx="80" cy="163" r="4" fill="#f0e2c8"/>
  <path d="M62 140 L98 140" stroke="${ink}" stroke-width="1" opacity="0.25"/>`
}

function arms(role: string, id: string, color: string, ink: string, light: string): string {
  if (role === 'mage') {
    return `
    <path d="M112 110 Q136 128 124 168" fill="none" stroke="${shade(color, -22)}" stroke-width="12" stroke-linecap="round"/>
    <path d="M48 112 Q28 134 42 166" fill="none" stroke="${shade(color, -28)}" stroke-width="11" stroke-linecap="round"/>
    <ellipse cx="124" cy="170" rx="7" ry="5" fill="${light}" opacity="0.5"/>`
  }
  if (role === 'tank') {
    return `
    <path d="M46 112 Q22 138 36 172" fill="none" stroke="${shade(color, -22)}" stroke-width="13" stroke-linecap="round"/>
    <path d="M114 112 Q138 130 126 168" fill="none" stroke="${shade(color, -18)}" stroke-width="12" stroke-linecap="round"/>
    <rect x="10" y="112" width="26" height="46" rx="3" fill="${light}" stroke="${ink}" stroke-width="2"/>
    <rect x="14" y="120" width="18" height="30" rx="2" fill="${color}" opacity="0.5"/>
    <path d="M16 128 H30 M16 140 H30" stroke="${ink}" stroke-width="1.2" opacity="0.4"/>`
  }
  if (role === 'heal' || role === 'support' || femaleHero(id)) {
    return `
    <path d="M46 114 Q26 136 46 168" fill="none" stroke="${shade(color, -22)}" stroke-width="10" stroke-linecap="round"/>
    <path d="M114 112 Q136 130 120 166" fill="none" stroke="${shade(color, -18)}" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="46" cy="170" rx="6" ry="4" fill="${light}" opacity="0.45"/>
    <ellipse cx="120" cy="168" rx="6" ry="4" fill="${light}" opacity="0.45"/>`
  }
  return `
  <path d="M46 112 Q24 140 40 172" fill="none" stroke="${shade(color, -25)}" stroke-width="12" stroke-linecap="round"/>
  <path d="M114 106 Q144 88 150 52" fill="none" stroke="${shade(color, -20)}" stroke-width="11" stroke-linecap="round"/>
  <ellipse cx="40" cy="174" rx="7" ry="5" fill="${light}" opacity="0.4"/>`
}

function head(
  id: string,
  faction: string,
  role: string,
  skin: string,
  hair: string,
  ink: string,
  color: string,
  light: string,
  uid: string,
): string {
  const female = femaleHero(id)
  const headW = female ? 30 : 32
  const headH = female ? 34 : 36
  return `
  <rect x="73" y="78" width="14" height="20" rx="4" fill="${skin}"/>
  <ellipse cx="80" cy="52" rx="${headW}" ry="${headH}" fill="${skin}" stroke="${ink}" stroke-width="1.3"/>
  ${hairStyle(id, faction, hair, ink)}
  <ellipse cx="66" cy="58" rx="8" ry="5" fill="url(#cheek-${uid})"/>
  <ellipse cx="94" cy="58" rx="8" ry="5" fill="url(#cheek-${uid})"/>
  <path d="M60 44 Q70 38 78 44" fill="none" stroke="#2a1810" stroke-width="2" stroke-linecap="round"/>
  <path d="M82 44 Q90 38 100 44" fill="none" stroke="#2a1810" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="68" cy="52" rx="4.2" ry="4.8" fill="#fff"/>
  <ellipse cx="92" cy="52" rx="4.2" ry="4.8" fill="#fff"/>
  <circle cx="68.6" cy="52.6" r="2.3" fill="${eyeColor(id, faction)}"/>
  <circle cx="92.6" cy="52.6" r="2.3" fill="${eyeColor(id, faction)}"/>
  <circle cx="69.4" cy="51.5" r="0.85" fill="#fff"/>
  <circle cx="93.4" cy="51.5" r="0.85" fill="#fff"/>
  ${faceExtra(id, role)}
  <path d="M74 60 Q80 64 86 60" fill="none" stroke="#d49868" stroke-width="1.2"/>
  ${mouth(id)}
  ${headwear(id, faction, role, color, light, ink)}`
}

function eyeColor(id: string, faction: string): string {
  if (id === 'zhaoyun') return '#1565c0'
  if (id === 'zhouyu' || id === 'luxun') return '#bf360c'
  if (id === 'diaochan') return '#6a1b9a'
  if (faction === 'wei') return '#1a237e'
  if (faction === 'wu') return '#004d40'
  return '#2a1810'
}

function hairStyle(id: string, faction: string, hair: string, ink: string): string {
  if (id === 'diaochan') {
    return `<path d="M46 44 Q80 -4 114 44 L112 90 Q80 70 48 90 Z" fill="${hair}"/>
    <path d="M44 62 Q34 110 52 148" fill="${hair}"/><path d="M116 62 Q126 110 108 148" fill="${hair}"/>
    <circle cx="42" cy="96" r="6" fill="#e8c56a"/><circle cx="118" cy="96" r="6" fill="#e8c56a"/>
    <path d="M56 38 Q80 18 104 38" fill="none" stroke="#e8c56a" stroke-width="1.5" opacity="0.5"/>`
  }
  if (id === 'xiaoqiao' || id === 'huangyueying') {
    return `<path d="M48 40 Q80 0 112 40 L108 82 Q80 64 52 82 Z" fill="${hair}"/>
    <path d="M50 68 Q42 118 58 150" fill="${hair}" opacity="0.92"/>
    <path d="M110 68 Q118 118 102 150" fill="${hair}" opacity="0.92"/>
    <path d="M58 36 Q80 16 102 36" fill="${shade(hair, 30)}" opacity="0.35"/>`
  }
  if (id === 'zhangfei') {
    return `<path d="M44 36 Q80 -8 116 36 L110 78 Q80 54 50 78 Z" fill="${hair}"/>
    <path d="M54 70 Q80 92 106 70" fill="${hair}"/>
    <path d="M58 48 Q80 28 102 48" fill="none" stroke="${ink}" stroke-width="1.2" opacity="0.3"/>`
  }
  if (id === 'guanyu') {
    return `<path d="M46 34 Q80 -6 114 34 L108 76 Q80 52 52 76 Z" fill="${hair}"/>
    <path d="M50 55 Q40 95 48 120" fill="${hair}" opacity="0.85"/>
    <path d="M110 55 Q120 95 112 120" fill="${hair}" opacity="0.85"/>`
  }
  if (faction === 'wei') {
    return `<path d="M46 30 Q80 -8 114 30 L108 74 Q80 48 52 74 Z" fill="${hair}"/>
    <rect x="62" y="18" width="36" height="14" rx="2" fill="${shade(hair, 28)}" opacity="0.55"/>
    <path d="M58 40 Q80 22 102 40" fill="none" stroke="${ink}" stroke-width="1" opacity="0.3"/>`
  }
  if (faction === 'wu') {
    return `<path d="M46 38 Q80 0 114 38 Q100 24 80 22 Q60 24 46 38 Z" fill="${hair}"/>
    <path d="M52 50 Q80 30 108 50" fill="${shade(hair, 22)}" opacity="0.42"/>
    <path d="M48 70 Q40 110 55 130" fill="${hair}" opacity="0.5"/>
    <path d="M112 70 Q120 110 105 130" fill="${hair}" opacity="0.5"/>`
  }
  return `<path d="M46 34 Q80 -6 114 34 L108 76 Q80 52 52 76 Z" fill="${hair}"/>
  <path d="M54 42 Q80 16 106 42" fill="none" stroke="${ink}" stroke-width="1.1" opacity="0.35"/>
  <path d="M50 60 Q42 100 55 125" fill="${hair}" opacity="0.55"/>
  <path d="M110 60 Q118 100 105 125" fill="${hair}" opacity="0.55"/>`
}

function faceExtra(id: string, role: string): string {
  if (id === 'zhangfei') {
    return `<path d="M58 64 Q80 90 102 64" fill="#1a2038"/><path d="M62 62 Q80 78 98 62" fill="#2a3048"/>
    <path d="M64 58 Q70 62 74 58" fill="none" stroke="#1a2038" stroke-width="1.5"/>
    <path d="M86 58 Q90 62 96 58" fill="none" stroke="#1a2038" stroke-width="1.5"/>`
  }
  if (id === 'guanyu') {
    return `<path d="M72 66 Q80 76 88 66" fill="none" stroke="#5a2010" stroke-width="2.4"/>
    <path d="M74 68 Q80 74 86 68" fill="#8d3a28" opacity="0.35"/>`
  }
  if (id === 'xiahoudun') {
    return `<path d="M62 50 L76 54" stroke="#c62828" stroke-width="2.2"/><circle cx="68" cy="52" r="2.5" fill="#b71c1c"/>`
  }
  if (role === 'warrior' || role === 'dps' || role === 'atk' || role === 'tank') {
    return `<path d="M70 66 Q80 74 90 66" fill="none" stroke="#5a3018" stroke-width="1.7"/>`
  }
  return ''
}

function mouth(id: string): string {
  if (femaleHero(id)) {
    return `<path d="M74 68 Q80 74 86 68" fill="none" stroke="#c06070" stroke-width="1.6"/>
    <path d="M76 69 Q80 72 84 69" fill="#e8919a" opacity="0.45"/>`
  }
  if (id === 'zhangfei') {
    return `<ellipse cx="80" cy="78" rx="7" ry="3.5" fill="#4a2030"/>`
  }
  if (id === 'caocao' || id === 'simayi') {
    return `<path d="M74 68 Q80 70 86 68" fill="none" stroke="#8a6050" stroke-width="1.4"/>`
  }
  return `<path d="M73 68 Q80 72 87 68" fill="none" stroke="#a06050" stroke-width="1.4"/>`
}

function headwear(id: string, faction: string, role: string, _color: string, light: string, ink: string): string {
  if (id === 'zhugeliang' || (role === 'mage' && id !== 'guojia' && id !== 'simayi')) {
    return `<path d="M50 32 Q80 4 110 32 L100 44 Q80 30 60 44 Z" fill="${light}" stroke="${ink}"/>
    <rect x="75" y="10" width="10" height="20" fill="${light}" stroke="${ink}"/>
    <circle cx="80" cy="10" r="3" fill="#fff8e0"/>`
  }
  if (id === 'simayi' || id === 'guojia') {
    return `<path d="M52 34 Q80 10 108 34 L100 46 Q80 34 60 46 Z" fill="${shade(light, -20)}" stroke="${ink}" opacity="0.9"/>
    <path d="M70 28 H90" stroke="#e8c56a" stroke-width="1.5"/>`
  }
  if (id === 'caocao' || (faction === 'wei' && role !== 'mage' && id !== 'guojia')) {
    return `<path d="M48 30 L80 8 L112 30 L102 44 L80 34 L58 44 Z" fill="${light}" stroke="${ink}" opacity="0.95"/>
    <path d="M64 28 L80 16 L96 28" fill="none" stroke="#fff8e0" stroke-width="1.2" opacity="0.5"/>`
  }
  if (id === 'liubei') {
    return `<ellipse cx="80" cy="26" rx="22" ry="8" fill="${light}" opacity="0.45"/>
    <path d="M62 28 Q80 18 98 28" fill="none" stroke="#e8c56a" stroke-width="1.5" opacity="0.6"/>`
  }
  if (id === 'sunquan') {
    return `<path d="M52 34 Q80 14 108 34 L100 46 Q80 36 60 46 Z" fill="${light}" stroke="${ink}" opacity="0.8"/>
    <circle cx="80" cy="28" r="3" fill="#26a69a"/>`
  }
  if (id === 'diaochan') {
    return `<circle cx="80" cy="22" r="7" fill="#e8c56a" stroke="${ink}"/><path d="M74 22 H86" stroke="#fff" stroke-width="1.2"/>
    <circle cx="80" cy="22" r="2.5" fill="#fff3c4"/>`
  }
  if (id === 'lvbu') {
    return `<path d="M50 28 L80 6 L110 28 L100 42 L80 32 L60 42 Z" fill="${light}" stroke="${ink}"/>
    <path d="M72 18 L80 10 L88 18" fill="#c62828" opacity="0.7"/>`
  }
  if (id === 'zhaoyun') {
    return `<path d="M54 32 Q80 12 106 32 L98 42 Q80 32 62 42 Z" fill="${light}" stroke="${ink}" opacity="0.7"/>`
  }
  return ''
}

function uniqueGear(id: string, _color: string, light: string, ink: string): string {
  switch (id) {
    case 'guanyu':
      return `<g transform="translate(0,6)"><line x1="124" y1="118" x2="154" y2="22" stroke="#0d3d1a" stroke-width="9"/><line x1="124" y1="118" x2="154" y2="22" stroke="#2e7d32" stroke-width="4"/><path d="M148 30 L158 8 L152 38 Z" fill="#c62828"/><path d="M120 116 L130 110 L126 126 Z" fill="#5d4037"/><circle cx="152" cy="18" r="2" fill="#ff8a80"/></g>`
    case 'zhangfei':
      return `<g><line x1="16" y1="180" x2="16" y2="58" stroke="#37474f" stroke-width="7"/><circle cx="16" cy="52" r="10" fill="#90a4ae" stroke="${ink}"/><path d="M6 58 L26 58 L16 82 Z" fill="#546e7a"/><circle cx="16" cy="52" r="4" fill="#cfd8dc"/></g>`
    case 'zhaoyun':
      return `<g transform="translate(0,4)"><line x1="128" y1="148" x2="152" y2="28" stroke="#eceff1" stroke-width="5.5"/><line x1="128" y1="148" x2="152" y2="28" stroke="#90caf9" stroke-width="2.2"/><circle cx="152" cy="24" r="5.5" fill="#fff"/><path d="M124 146 L134 138 L130 156 Z" fill="#546e7a"/></g>`
    case 'zhugeliang':
      return `<g><path d="M122 112 L152 48" stroke="${ink}" stroke-width="3.2"/><path d="M134 72 Q156 50 154 88 Q138 96 134 72" fill="${light}" stroke="${ink}"/><circle cx="144" cy="66" r="2.5" fill="#fff8e0"/><path d="M140 78 Q148 72 150 82" fill="none" stroke="#ffe082" stroke-width="1"/></g>`
    case 'zhouyu':
      return `<g><path d="M14 120 Q36 80 58 120 Q36 155 14 120" fill="#ef5350" opacity="0.9"/><circle cx="36" cy="112" r="7" fill="#ffd54f"/><path d="M28 102 Q36 90 44 102" fill="none" stroke="#ff8a65" stroke-width="2.2"/><path d="M22 118 Q36 108 50 118" fill="none" stroke="#ffcc02" stroke-width="1.2" opacity="0.6"/></g>`
    case 'lvbu':
      return `<g><line x1="18" y1="188" x2="18" y2="42" stroke="#4a1515" stroke-width="7"/><path d="M4 50 L32 50 L18 22 Z" fill="${light}" stroke="${ink}"/><path d="M10 58 L26 58" stroke="#c62828" stroke-width="3.5"/><circle cx="18" cy="70" r="3" fill="#ff8a80"/></g>`
    case 'machao':
      return `<g><line x1="130" y1="138" x2="150" y2="42" stroke="#1b5e20" stroke-width="5.5"/><path d="M146 48 L156 30 L150 56 Z" fill="#66bb6a"/><path d="M126 136 L136 128 L132 146 Z" fill="#5d4037"/></g>`
    case 'huangzhong':
      return `<g><path d="M18 128 L18 62" stroke="#5d4037" stroke-width="3.5"/><path d="M8 62 Q18 44 28 62" fill="none" stroke="#ffe082" stroke-width="2.2"/><line x1="18" y1="62" x2="4" y2="40" stroke="#ffe082" stroke-width="1.8"/><circle cx="18" cy="128" r="4" fill="#8d6e63"/></g>`
    case 'dianwei':
      return `<g><line x1="130" y1="128" x2="150" y2="62" stroke="#455a64" stroke-width="8"/><line x1="18" y1="128" x2="4" y2="62" stroke="#455a64" stroke-width="8"/><circle cx="150" cy="58" r="5" fill="#78909c"/><circle cx="4" cy="58" r="5" fill="#78909c"/></g>`
    case 'taishici':
      return `<g><path d="M16 138 L16 72" stroke="#5d4037" stroke-width="3.5"/><path d="M6 74 Q16 58 26 74" fill="none" stroke="#90caf9" stroke-width="2.2"/><line x1="16" y1="72" x2="6" y2="52" stroke="#bbdefb" stroke-width="1.5"/></g>`
    case 'diaochan':
      return `<g><path d="M20 116 Q38 88 54 116 Q38 140 20 116" fill="#f8bbd0" opacity="0.85"/><circle cx="66" cy="40" r="4.5" fill="#ec407a"/><circle cx="94" cy="40" r="4.5" fill="#ec407a"/><path d="M72 38 Q80 48 88 38" fill="none" stroke="#f8bbd0" stroke-width="1.2" opacity="0.6"/></g>`
    case 'xiaoqiao':
      return `<g><path d="M18 114 Q34 90 50 114 Q34 134 18 114" fill="#ffe082" opacity="0.8"/><circle cx="80" cy="96" r="3.5" fill="#fff59d"/><circle cx="70" cy="108" r="2" fill="#fff59d" opacity="0.7"/><circle cx="90" cy="108" r="2" fill="#fff59d" opacity="0.7"/></g>`
    case 'huatuo':
      return `<g><rect x="14" y="108" width="18" height="24" rx="2" fill="#e8f5e9" stroke="#2e7d32"/><path d="M19 118 H27 M23 114 V126" stroke="#c62828" stroke-width="2.2"/><circle cx="23" cy="108" r="3" fill="#81c784"/></g>`
    case 'caocao':
      return `<g><path d="M128 118 L152 62" stroke="${ink}" stroke-width="3.2"/><circle cx="152" cy="58" r="6" fill="${light}"/><circle cx="152" cy="58" r="2.5" fill="#fff8e0"/></g>`
    case 'simayi':
      return `<g><path d="M124 112 L150 58" stroke="#4a148c" stroke-width="3.2"/><path d="M140 72 Q156 54 154 84 Q140 90 140 72" fill="#b39ddb" stroke="${ink}"/><circle cx="147" cy="66" r="2" fill="#fff"/></g>`
    case 'guojia':
      return `<g><path d="M124 114 L148 62" stroke="#6a1b9a" stroke-width="2.8"/><circle cx="148" cy="58" r="5" fill="#ce93d8"/><path d="M144 54 Q148 48 152 54" fill="none" stroke="#fff" stroke-width="1"/></g>`
    case 'liubei':
      return `<g><path d="M18 122 Q34 98 50 122" fill="none" stroke="#ffe082" stroke-width="2.2"/><circle cx="34" cy="110" r="5" fill="#fff59d"/><path d="M28 106 Q34 100 40 106" fill="none" stroke="#ff8f00" stroke-width="1"/></g>`
    case 'sunquan':
      return `<g><path d="M14 128 Q14 84 14 58" stroke="#00695c" stroke-width="4.5"/><circle cx="14" cy="52" r="7" fill="#26a69a"/><circle cx="14" cy="52" r="3" fill="#b2dfdb"/></g>`
    case 'luxun':
      return `<g><path d="M16 118 Q38 90 56 118" fill="#ff7043" opacity="0.75"/><circle cx="36" cy="108" r="5" fill="#ffcc02"/><path d="M28 100 Q36 90 44 100" fill="none" stroke="#ff8a65" stroke-width="1.5"/></g>`
    case 'ganning':
      return `<g><circle cx="22" cy="96" r="10" fill="#1b5e20" stroke="#a5d6a7" stroke-width="2"/><circle cx="22" cy="96" r="3.5" fill="#fff"/><path d="M14 88 L18 84" stroke="#a5d6a7" stroke-width="1.5"/></g>`
    case 'xiahoudun':
      return `<g><path d="M64 48 L76 52" stroke="#c62828" stroke-width="2.4"/><circle cx="68" cy="50" r="2.5" fill="#b71c1c"/></g>`
    case 'huangyueying':
      return `<g><rect x="14" y="112" width="16" height="16" rx="2" fill="#ffe0b2" stroke="#ef6c00"/><circle cx="22" cy="120" r="2.5" fill="#ef6c00"/><path d="M18 116 H26 M22 114 V126" stroke="#ef6c00" stroke-width="1" opacity="0.5"/></g>`
    default:
      return `<g><line x1="130" y1="128" x2="150" y2="48" stroke="${ink}" stroke-width="5.5"/><line x1="130" y1="128" x2="150" y2="48" stroke="${light}" stroke-width="2.2"/><circle cx="150" cy="44" r="4" fill="${light}"/></g>`
  }
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function shade(hex: string, amt: number): string {
  const n = hex.replace('#', '')
  const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n
  const num = parseInt(full || '888888', 16)
  if (Number.isNaN(num)) return '#888888'
  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + amt))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amt))
  const b = Math.min(255, Math.max(0, (num & 255) + amt))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/** 卡面、名册、养成都用同一套 Q 版全身立绘 */
export function portraitHtml(hero: HeroDef, size = 120): string {
  const src = `/sprites/${hero.id}.png`
  return `<div class="portrait portrait-photo rarity-${hero.rarity}" style="width:${size}px;--accent:${hero.color};--rarity-color:${rarityStroke(hero.rarity as Rarity)}">
    <img src="${src}" alt="${hero.name}" draggable="false" onerror="this.style.display='none';this.nextElementSibling.hidden=false" />
    <div class="portrait-fallback" hidden>${portraitSvg(hero, size)}</div>
  </div>`
}
