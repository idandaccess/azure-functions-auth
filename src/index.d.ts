declare function createValidateJwt(
  options: createValidateJwt.AuthOptions
): Function;

export = createValidateJwt;

declare namespace createValidateJwt {
  export interface AuthOptions {
    clientId: string;
    clientSecret: string;
    domain: string;
    algorithms: string[];
    audience?: string;
  }
}
