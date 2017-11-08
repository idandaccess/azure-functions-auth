# azure-functions-auth
Authentication and Authorization for Azure Functions (with OAuth 2.0 and JWT)

## Configuration

```js
const validateJwt = require('azure-functions-auth')({
  clientId: '<client id>',
  clientSecret: '<client secret or IDP\'s public key / signing certificate>',
  domain: '<your IDP>',
  algorithms: ['RS256'],
});

module.exports = validateJwt(function(context, req) {
  if (req.user) {
    context.res = {
      body: req.user
    };
  }
  else {
    context.res = {
      status: 400,
      body: "The user property is missing"
    };
  }
  context.done();
});
```

## Usage

Now when you make a call to the Http endpoint you'll need to add an Authorization header, e.g.:

```bash
GET https://functionsad5bb49d.azurewebsites.net/api/my-http-function?...
Authorization: Bearer the-access-token
```

## Attribution

This code is based on [https://github.com/sandrinodimattia/azure-functions-auth0](https://github.com/sandrinodimattia/azure-functions-auth0)