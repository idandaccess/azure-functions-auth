[![Build Status](https://idandaccess.visualstudio.com/azure-functions-auth/_apis/build/status/idandaccess.azure-functions-auth?branchName=master)](https://idandaccess.visualstudio.com/azure-functions-auth/_build/latest?definitionId=2&branchName=master)

# azure-functions-auth

Authentication and Authorization for Azure Functions (with OAuth 2.0 and JWT)

## Configuration

```js
const validateJwt = require("azure-functions-auth")({
  clientId: "<client id>",
  clientSecret: "<client secret or IDP's public key / signing certificate>",
  domain: "<your IDP>",
  algorithms: ["RS256"]
});
```

## Usage

### Callback Style

```js
module.exports = validateJwt(function(context, req) {
  if (req.user) {
    context.res = {
      body: req.user
    };
  } else {
    context.res = {
      status: 400,
      body: "The user property is missing"
    };
  }
  context.done();
});
```

In case of an invalid JWT `context.res` gets populated accordingly and `context.done()` gets called.

### Async Style

```js
const main = (context, req) => {
  context.log(
    "token is valid. (you shouldn't log like that in production code)"
  );

  return new Promise(resolve => {
    resolve(
      "the function will return this exact string as body with a status code of 200"
    );
  }).then(asyncResult => {
    return asyncResult;
  });
};
module.exports = validateJwt(main, true);
```

In case of an invalid JWT a specific error and status code get returned. Make sure to have your function host is configured to use function's return value.

```json
{
  "bindings": [
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

Regarding the http output your `function.json` should look like the above.

```js
module.exports = {
  run: validateJwt(main, true),
  main
};
```

In order to do tests, of course you still can export your functions.

### Calling your function

Now when you make a call to the Http endpoint you'll need to add an Authorization header, e.g.:

```bash
GET https://functionsad5bb49d.azurewebsites.net/api/my-http-function?...
Authorization: Bearer the-access-token
```

## Attribution

This code is based on [https://github.com/sandrinodimattia/azure-functions-auth0](https://github.com/sandrinodimattia/azure-functions-auth0)

temp edit
