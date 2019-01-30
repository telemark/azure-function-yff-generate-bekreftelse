const translate = require('minelev-tilbakemelding-nynorsk')

module.exports = data => {
  const translated = data.split('\n').map(translate)
  return translated.join('\n')
}
