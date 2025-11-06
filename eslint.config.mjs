import antfu from '@antfu/eslint-config';

export default antfu({
  ignores: [
    'public/vite-dev/**',
    'node_modules/**',
  ],
  stylistic: {
    semi: true,
    overrides: {
      'style/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: true,
          },
          multilineDetection: 'brackets',
        },
      ],
    },
  },
});
