[![Build Status](https://travis-ci.com/telemark/azure-function-yff-generate-bekreftelse.svg?branch=master)](https://travis-ci.com/telemarks/azure-function-yff-generate-bekreftelse)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# azure-function-yff-generate-bekreftelse

Generates document from data.

## Usage

POST json and receive a base64 encoded version of a docx-file in the document property.

```JavaScript
{
  ...json,
  document: '<base64>'
}
```

## Development

Install all tools needed for [local development](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-local).

Clone the repo. Install dependencies.

Start server

```
$ func start
```

POST testdata

```
$ curl http://localhost:7071/api/HttpHandler -d @test/data/input.json --header "Content-Type: application/json"
```

# License

[MIT](LICENSE)
