module.exports = {
  use: [
    '@neutrinojs/standardjs',
    [
      '@neutrinojs/library',
      {
        name: 'js-classnamer'
      }
    ],
    '@neutrinojs/jest'
  ]
};
