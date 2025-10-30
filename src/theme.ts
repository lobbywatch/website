import { Potency } from '../lib/types'

export const POTENCY_COLORS: Record<Potency, string> = {
  HIGH: 'var(--colorPotencyHigh)',
  MEDIUM: 'var(--colorPotencyMedium)',
  LOW: 'var(--colorPotencyLow)',
}

export const POTENCY_COLORS_KEYS: Array<Potency> = ['LOW', 'MEDIUM', 'HIGH']
