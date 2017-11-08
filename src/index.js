const jwt = require('express-jwt');

module.exports = options => {
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

  const middleware = jwt({
    secret: options.clientSecret,
    audience: options.audience,
    issuer: options.domain,
    algorithms: options.algorithms,
  });

  return (next) => {
    return (context, req, ...args) => {
      middleware(req, null, (err) => {
        if (err) {
          context.res = {
            status: err.status || 500,
            body: {
              message: err.message
            }
          };

          return context.done();
        }

        return next(context, req, ...args);
      });
    };
  };
};
