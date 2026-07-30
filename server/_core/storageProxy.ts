import type { Express } from "express";
import { ENV } from "./env";

/**
 * Storage proxy that generates a presigned CloudFront URL and redirects the client to it.
 * This is the simplest and most reliable approach - the browser follows the 307 redirect
 * and downloads directly from CloudFront.
 *
 * For programmatic downloads (e.g., from the frontend via tRPC), use the
 * assets.getDocumentDownloadUrl procedure instead.
 */
export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        console.error("[StorageProxy] presign failed:", forgeResp.status);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL");
        return;
      }

      // 307 redirect - browser follows this and downloads from CloudFront directly
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      if (!res.headersSent) {
        res.status(502).send("Storage proxy error");
      }
    }
  });
}
