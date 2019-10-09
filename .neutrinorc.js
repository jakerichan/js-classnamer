const standardjs = require('@neutrinojs/standardjs');
const library = require('@neutrinojs/library');
const jest = require('@neutrinojs/jest');

module.exports = {
  use: [
    standardjs(),
    library({
      name: 'js-classnamer'
    }),
    jest()
  ]
};
