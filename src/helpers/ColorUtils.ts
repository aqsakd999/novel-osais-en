export const baseFontColors = {
  primary: '#000000',
  secondary: '#202020',
  tertiary: '#404040',
  fieldLabel: '#404040de',
}

function getRGB(color: string) {
  const c = color.startsWith('#') ? color.substring(1) : color
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return [r, g, b]
}

function getReversalColor(color: string): string {
  const [r, g, b] = getRGB(color)

  if (!Number.isNaN(r + g + b)) {
    return `rgb(${255 - r}, ${255 - g}, ${255 - b})`
  }

  return `#${color}`
}

function getComplementaryColor(color: string): string {
  const [r, g, b] = getRGB(color)

  if (!Number.isNaN(r + g + b)) {
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const complement = max + min

    return `rgb(${complement - r}, ${complement - g}, ${complement - b})`
  }

  return `#${color}`
}

function getContrastingColor(color: string | undefined): string {
  if (!color) {
    return '#000000'
  }

  const [r, g, b] = getRGB(color)
  if (!Number.isNaN(r + g + b)) {
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? '#000000' : '#ffffff'
  }

  return '#000000'
}

export default {
  getReversalColor,
  getComplementaryColor,
  getContrastingColor,
}
