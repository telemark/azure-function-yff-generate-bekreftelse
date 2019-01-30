const generateDocument = require('generate-docx')

function getTemplateName (input) {
  return input ? input.toString().split('/').slice(-1)[0] : false
}

module.exports = (context, document) => {
  context.log(`generate-document-data - template - ${getTemplateName(document.template)}`)
  return new Promise(async (resolve, reject) => {
    const options = {
      template: {
        filePath: document.template,
        data: document.data
      }
    }

    const buffer = await generateDocument(options)

    context.log(`generate-document-data - document-generated`)

    resolve(buffer.toString('base64'))
  })
}
