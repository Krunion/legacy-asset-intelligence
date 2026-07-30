import type { Express } from "express";
import { ENV } from "./env";

/**
 * Storage proxy that fetches file content from S3 via CloudFront presigned URLs
 * and streams it to the client.
 *
 * Key insight: Files uploaded via storagePut() with spaces in their names get stored
 * at %20-encoded S3 keys (because fetch() encodes spaces during PUT). To download them,
 * we must double-encode spaces (%2520) when requesting the presign URL so the API
 * decodes to %20, generating a CloudFront URL with %20 that fetch() can access.
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
      // Try downloading with the key as-is first (works for sanitized filenames)
      let fileResp = await tryDownload(key);

      // If 403 and key has spaces, try double-encoding (for legacy files uploaded before sanitization)
      if (!fileResp.ok && key.includes(" ")) {
        const doubleEncodedKey = key.replace(/ /g, "%2520");
        fileResp = await tryDownload(doubleEncodedKey);
      }

      if (!fileResp.ok) {
        res.status(fileResp.status === 403 ? 404 : 502).send("File not available");
        return;
      }

      // Stream the response to the client
      const contentType = fileResp.headers.get("content-type");
      const contentLength = fileResp.headers.get("content-length");

      if (contentType) res.set("Content-Type", contentType);
      if (contentLength) res.set("Content-Length", contentLength);
      res.set("Cache-Control", "private, max-age=300");
      res.set("Access-Control-Allow-Origin", "*");

      // Add content-disposition with clean filename
      const filename = key.split("/").pop() || "download";
      const cleanName = filename.replace(/_[a-f0-9]{8}(\.[^.]+)$/, "$1");
      res.set(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(cleanName)}"`,
      );

      // Pipe the response body
      if (fileResp.body) {
        const reader = (fileResp.body as ReadableStream<Uint8Array>).getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        } catch (err) {
          console.error("[StorageProxy] pipe error:", err);
        }
        res.end();
      } else {
        const buf = Buffer.from(await fileResp.arrayBuffer());
        res.send(buf);
      }
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      if (!res.headersSent) {
        res.status(502).send("Storage proxy error");
      }
    }
  });
}

async function tryDownload(key: string): Promise<Response> {
  const forgeUrl = new URL(
    "v1/storage/presign/get",
    ENV.forgeApiUrl!.replace(/\/+$/, "") + "/",
  );
  forgeUrl.searchParams.set("path", key);
  const forgeResp = await fetch(forgeUrl, {
    headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
  });
  if (!forgeResp.ok) {
    return new Response("Storage backend error", { status: 502 });
  }
  const { url } = (await forgeResp.json()) as { url: string };
  if (!url) {
    return new Response("Empty signed URL", { status: 502 });
  }
  return fetch(url);
}
