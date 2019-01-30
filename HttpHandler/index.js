const prepareDocument = require('../lib/prepare-document')
const generateDocumentData = require('../lib/generate-document-data')

function base64ToObj (base64) {
  return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
}

module.exports = async function (context, request) {
  if (request.body && request.body.ContentData) {
    let body = base64ToObj(request.body.ContentData)
    const data = await prepareDocument(body)
    const document = await generateDocumentData(context, data)
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
