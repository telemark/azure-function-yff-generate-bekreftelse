const translate = require('minelev-tilbakemelding-nynorsk')

module.exports = data => {
  const translated = data.split('\r\n').map(translate)
  return translated.join('\r\n')
}
