const prepareDocument = require('../lib/prepare-document')
const generateDocumentData = require('../lib/generate-document-data')

module.exports = async function (context, request) {
  if (request.body) {
    const data = await prepareDocument(request.body)
    const document = await generateDocumentData(context, data)
    context.response = {
      body: {
        document: document
      }
    }
  } else {
    context.response = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    }
  }
  return context
}
