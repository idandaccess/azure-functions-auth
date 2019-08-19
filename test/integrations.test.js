const env = process.env;
require("dotenv").config();
const rp = require("request-promise");

const apiUrl = env.API_URL;
const tokenEndpoint = env.AUTH_TOKEN_ENDPOINT_AUTH0;
const audience = env.API_ID;
const clientId = env.AUTH_M2M_CLIENT_ID_AUTH0;
const clientSecret = env.AUTH_M2M_CLIENT_SECRET_AUTH0;
const functionsKey = env.AUTH_FUNCTIONS_KEY;

async function getNewToken() {
  const options = {
    url: tokenEndpoint,
    headers: { "content-type": "application/json" },
    body:
      `{"client_id":"${clientId}","client_secret":"${clientSecret}"` +
      `,"audience":"${audience}","grant_type":"client_credentials"}`
  };
  try {
    return rp.post(options).then(res => JSON.parse(res)["access_token"]);
  } catch (error) {
    // don't "console.log(error)" to prevent logging of secrets

    throw new Error(
      `error while getting a new access_token for client ${clientId}.`
    );
  }
}

async function accessApi() {
  try {
    const options = {
      uri: apiUrl,
      headers: {
        Authorization: `Bearer ${await getNewToken()}`,
        ["x-functions-key"]: functionsKey
      }
    };
    try {
      return await rp(options);
    } catch (error) {
      // don't "console.log(error)" to prevent logging of secrets
      throw new Error(`an error occured requesting "${apiUrl}".`);
    }
  } catch (error) {
    // don't "console.log(error)" to prevent logging of secrets
    throw new Error(`error while accessing the API`);
  }
}

const waitTimeToWarmUpFunctionApp = 45 * 1000;
test(
  "call API with fresh access_token",
  async () => {
    expect(await accessApi()).toEqual("Authentication successful 🎉");
  },
  waitTimeToWarmUpFunctionApp
);
