const prepareDocument = require('../lib/prepare-document')
const generateDocumentData = require('../lib/generate-document-data')

module.exports = async function (context, request) {
  if (request.body) {
    let body = request.body
    const data = await prepareDocument(body)
    const document = await generateDocumentData(context, data)
    body.recipients = data.recipients
    body.document = document
    context.response = {
      body: body
    }
  } else {
    context.response = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    }
  }
  return context
}
