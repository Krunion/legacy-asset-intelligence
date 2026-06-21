import axios from "axios";
import { ENV } from "./env";

export interface MicrosoftTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

export interface MicrosoftUserInfo {
  id: string;
  userPrincipalName: string;
  displayName: string;
  mail: string;
  givenName?: string;
  surname?: string;
}

export class MicrosoftOAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tenantId: string;
  private readonly redirectUri: string;

  constructor(redirectUri: string) {
    this.clientId = ENV.microsoftOAuthClientId;
    this.clientSecret = ENV.microsoftOAuthClientSecret;
    this.tenantId = ENV.microsoftOAuthTenantId;
    this.redirectUri = redirectUri;

    if (!this.clientId || !this.clientSecret || !this.tenantId) {
      console.error(
        "[Microsoft OAuth] Missing required environment variables: MICROSOFT_OAUTH_CLIENT_ID, MICROSOFT_OAUTH_CLIENT_SECRET, or MICROSOFT_OAUTH_TENANT_ID"
      );
    }
  }

  /**
   * Get the authorization URL for Microsoft login
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      response_mode: "query",
      scope: "openid profile email",
      state,
    });

    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<MicrosoftTokenResponse> {
    try {
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("client_secret", this.clientSecret);
      params.append("code", code);
      params.append("redirect_uri", this.redirectUri);
      params.append("grant_type", "authorization_code");
      params.append("scope", "openid profile email");

      const response = await axios.post<MicrosoftTokenResponse>(
        `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`,
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Microsoft OAuth] Token exchange failed:", error);
      throw new Error("Failed to exchange code for token");
    }
  }

  /**
   * Get user information using access token
   */
  async getUserInfo(accessToken: string): Promise<MicrosoftUserInfo> {
    try {
      const response = await axios.get<MicrosoftUserInfo>(
        "https://graph.microsoft.com/v1.0/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Microsoft OAuth] Failed to get user info:", error);
      throw new Error("Failed to get user information");
    }
  }
}
