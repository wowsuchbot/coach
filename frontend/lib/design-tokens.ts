export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  status: {
    high: { bg: 'bg-red-900/30', text: 'text-red-300', dot: 'bg-red-500' },
    medium: { bg: 'bg-yellow-900/30', text: 'text-yellow-300', dot: 'bg-yellow-500' },
    low: { bg: 'bg-gray-800', text: 'text-gray-300', dot: 'bg-gray-500' },
  },
  task: {
    pending: { bg: 'bg-yellow-900/30', text: 'text-yellow-300', dot: 'bg-yellow-500' },
    in_progress: { bg: 'bg-blue-900/30', text: 'text-blue-300', dot: 'bg-blue-500' },
    blocked: { bg: 'bg-red-900/30', text: 'text-red-300', dot: 'bg-red-500' },
    done: { bg: 'bg-green-900/30', text: 'text-green-300', dot: 'bg-green-500' },
  },
} as const;

export const spacing = {
  card: 'p-6',
  section: 'mb-8',
  gap: 'gap-4',
  gapSm: 'gap-2',
} as const;

export const typography = {
  h1: 'text-3xl font-bold text-white',
  h2: 'text-xl font-semibold text-white',
  h3: 'text-lg font-medium text-white',
  body: 'text-base text-gray-300',
  caption: 'text-sm text-gray-400',
  label: 'text-sm font-medium text-gray-300',
} as const;

export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900';

export const transitions = {
  colors: 'transition-colors',
  all: 'transition-all',
} as const;

export const card = {
  base: 'rounded-lg border border-gray-800 bg-gray-900/50',
  interactive: 'rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors',
  padding: 'p-6',
} as const;

export const button = {
  primary: 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors',
  secondary: 'rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors',
  ghost: 'text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded',
} as const;

export const input = {
  base: 'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  error: 'border-red-500',
} as const;
