require("dotenv").config({ path: "./../../.env" });
const env = process.env;
const options = {
  algorithms: ["RS256"],
  domain: "https://idandaccess.eu.auth0.com/",
  audience: "api://tests.repo.azure-functions-auth.idandaccess.com",
  publicKey: `-----BEGIN CERTIFICATE-----
MIIDCzCCAfOgAwIBAgIJBraIuU0JYA+9MA0GCSqGSIb3DQEBCwUAMCMxITAfBgNV
BAMTGGlkYW5kYWNjZXNzLmV1LmF1dGgwLmNvbTAeFw0xOTA3MzExOTE5MzZaFw0z
MzA0MDgxOTE5MzZaMCMxITAfBgNVBAMTGGlkYW5kYWNjZXNzLmV1LmF1dGgwLmNv
bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKSKY5SlOEHRihdx83Gp
speLZpa8leOB4TN/XDutPc6IGJoadLFJv2HLlFBbmVUaq2buhpL02K3NzMHgBHL/
892RtACrld0HE9FAsyVGd1KlKuhBj94h/wB2+oLwQ7NgOya854/VUoH5Q9l1qmNu
OlHTE0PkEfXLxCvVcvpjMzpAAN6iB+KOzz34rdQtge6M5tuCTgfigY5dy2H8+z4t
qV7HDN3Xatwq3Dn5oJN2egA6/dTK0j6RYSAqStbWn9phPe7iHlB6BzhlhX2J+APM
/e1e9FDGL4igBZfbzqQrEFXsAd4TzqtbMtolVcahH4S+L96t4WEORtNvkXlGjgU7
QJECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU50E6vJe86nAh
LhHphjdfoM4m9wowDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCH
4G0IRPgITM+QMDzdR8N+xl8S9IK2SC9iMZ5S5emuJa78ofBFx48mMHpjSvi93dQU
nNIm6si9zghArhUjFYICpiKhGza8mSilmTuIGcTR/1iJj61GWekc89aqQ6uGGzIP
/f0XzdaNBKKSRfvIm85SNyQ+YQKvCPtcSwLPpDR980U3u4x++gEuXeR85p6DrC6z
dieexJ5POf0YaXGLN4WgEVK73VATApwSHf5LjWllLlPwILC9MkxWF8Wszsc98ATw
jmJvkxBaRdQNUltryfgW1cWqlcFSO895s5rP4QNyVMEBGn3x5jTO4TufcgG0hYNR
nwMPN8hFOPwOF8zQp2YA
-----END CERTIFICATE-----`
};
const libLocation = env.LIB_FILEPATH || "./../../../lib/index";

// if on CICD, use artifact dir instead
const createValidateJwt = require(libLocation);
const validateJwt = createValidateJwt(options);

// to test against the deployed package
//const validateJwt = require('azure-functions-auth')(options);

const main = async function(context, req) {
  context.log('Function "test-jwt-validation" processed a request.');

  if (req.user) {
    context.res = {
      body: "Authentication successful 🎉"
    };
  } else {
    context.res = {
      status: 400,
      body: "Authentication failed 👎"
    };
  }
  context.done();
};

module.exports = validateJwt(main);
