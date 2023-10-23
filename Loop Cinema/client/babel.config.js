// babel.config.js
module.exports = {
  presets: [
    [
      'next/babel', // Added Next.js babel preset
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
};
