import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '.github/**',
  ],
  rules: {
    'no-console': 'warn',
  },
})
