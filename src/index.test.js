const createValidateJwt = require('./index.js');

const idAndAccessPublicKey = `-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----
`;
const idAndAccessIssuer = 'https://idandaccess.eu.auth0.com/';

const options = {
  algorithms: [ 'RS256' ],
  domain: idAndAccessIssuer
};


test('clientId and clientSecret parameters', () => {
  options.clientId = 'bar';
  options.clientSecret = idAndAccessPublicKey;

  const validateJwt = createValidateJwt(options);
  result = validateJwt();
  
  expect(result).toBeTruthy();
});

test('audience and publicKey parameters sync', () => {
  options.audience = 'bar';
  options.publicKey = idAndAccessPublicKey;

  const validateJwt = createValidateJwt(options);

  result = validateJwt(undefined, false);
  expect(typeof result).toBe('function');
  expect(() => { result(); } ).toThrow();

  result = validateJwt();
  expect(typeof result).toBe('function');
  expect(() => { result(); } ).toThrow();
});

test('audience and publicKey parameters async', () => {
  const options = {
    algorithms: [ 'RS256' ],
    domain: 'foo',
    audience: 'bar',
    publicKey: `----BEGIN CERT
asdfasdfadfa`
  };
  const validateJwt = createValidateJwt(options);
  result = validateJwt(undefined, true);
  result2 = result();

  expect(typeof result).toBe('function');
  expect(typeof result2.then).toBe('function');
});
