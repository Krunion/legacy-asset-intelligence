import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { MicrosoftOAuthService } from "./microsoftOAuth";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Microsoft OAuth login initiation
  app.get("/api/oauth/microsoft/login", (req: Request, res: Response) => {
    try {
      const redirectUri = `${req.protocol}://${req.get("host")}/api/oauth/microsoft/callback`;
      const state = btoa(redirectUri);

      const microsoftOAuth = new MicrosoftOAuthService(redirectUri);
      const authUrl = microsoftOAuth.getAuthorizationUrl(state);

      res.redirect(302, authUrl);
    } catch (error) {
      console.error("[Microsoft OAuth] Login initiation failed", error);
      res.status(500).json({ error: "Failed to initiate Microsoft OAuth login" });
    }
  });

  // Microsoft OAuth callback
  app.get("/api/oauth/microsoft/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const error = getQueryParam(req, "error");

    if (error) {
      console.error("[Microsoft OAuth] Error from Microsoft:", error);
      res.status(400).json({ error: `Microsoft OAuth error: ${error}` });
      return;
    }

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      // Decode the redirect URI from state
      const redirectUri = atob(state);
      const microsoftOAuth = new MicrosoftOAuthService(redirectUri);

      // Exchange code for token
      const tokenResponse = await microsoftOAuth.exchangeCodeForToken(code);

      // Get user info
      const userInfo = await microsoftOAuth.getUserInfo(tokenResponse.access_token);

      // Use Microsoft ID as the unique identifier
      const openId = `microsoft_${userInfo.id}`;

      // Upsert user in database
      await db.upsertUser({
        openId,
        name: userInfo.displayName || null,
        email: userInfo.mail || null,
        loginMethod: "microsoft",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await sdk.createSessionToken(openId, {
        name: userInfo.displayName || "",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      // Redirect to employee portal
      res.redirect(302, "/employee-portal");
    } catch (error) {
      console.error("[Microsoft OAuth] Callback failed", error);
      res.status(500).json({ error: "Microsoft OAuth callback failed" });
    }
  });

  // Original Manus OAuth callback
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
