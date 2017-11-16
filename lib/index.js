const expressJwt = require('express-jwt');

const getJwtValidationError = err => {
  return {
    status: err.status || 500,
    body: {
      message: err.message
    }
  };
};

const validateJwt = expressValidateJwt => (next, returnPromise) => {
  return (context, req, ...rest) => {
    if (returnPromise) {
      return new Promise(resolve => {
        expressValidateJwt(req, null, handleResult(resolve));
        // return undefined // done implicitly if you remove this line!
      });
    } else {
      expressValidateJwt(req, null, handleResultSync());
    }

    function handleResult(resolve) {
      return err => {
        if (err) {
          return resolve(getJwtValidationError(err));
        }
        resolve(next(context, req, ...rest));
      };
    }

    function handleResultSync() {
      return err => {
        if (err) {
          context.res = getJwtValidationError(err);
          return context.done();
        }
        next(context, req, ...rest);
      };
    }
  };
};

const createValidateJwt = options => {
  // guardOptions
  if (!options || !(options instanceof Object)) {
    throw new Error('The options must be an object.');
  }

  if (!options.clientId || options.clientId.length === 0) {
    throw new Error('The Client ID has to be provided.');
  }

  if (!options.clientSecret || options.clientSecret.length === 0) {
    throw new Error('The Client Secret has to be provided.');
  }

  if (!options.domain || options.domain.length === 0) {
    throw new Error('The Issuer Domain has to be provided.');
  }

  if (!options.algorithms || options.algorithms.length === 0) {
    throw new Error('The algorithms option has to be provided.');
  }

  if (!options.audience) {
    options.audience = options.clientId;
  }

  // createMiddleware
  const expressValidateJwt = expressJwt({
    secret: options.clientSecret,
    audience: options.audience,
    issuer: options.domain,
    algorithms: options.algorithms
  });

  return validateJwt(expressValidateJwt);
};

module.exports = createValidateJwt;