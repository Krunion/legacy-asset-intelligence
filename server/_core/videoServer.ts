import express, { Express } from "express";
import fs from "fs";
import path from "path";

const VIDEOS_DIR = path.join(process.cwd(), "..", "webdev-static-assets", "videos");

// Ensure videos directory exists
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

export function registerVideoRoutes(app: Express) {
  // Stream video by name
  app.get("/api/videos/:videoName", (req, res) => {
    try {
      const videoName = req.params.videoName;
      
      // Security: only allow alphanumeric, dash, underscore, and dot
      if (!/^[a-zA-Z0-9._-]+$/.test(videoName)) {
        return res.status(400).json({ error: "Invalid video name" });
      }

      const videoPath = path.join(VIDEOS_DIR, videoName);
      
      // Security: ensure the resolved path is within VIDEOS_DIR
      if (!videoPath.startsWith(VIDEOS_DIR)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Check if file exists
      if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: "Video not found" });
      }

      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      // Handle range requests for seeking
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
          res.status(416).send("Requested Range Not Satisfiable\n" + start + " >= " + fileSize);
          return;
        }

        const chunksize = end - start + 1;
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Length", chunksize);
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
        
        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);
      } else {
        res.setHeader("Content-Length", fileSize);
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
        res.setHeader("Accept-Ranges", "bytes");
        
        const stream = fs.createReadStream(videoPath);
        stream.pipe(res);
      }
    } catch (error) {
      console.error("[Video Server] Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // List available videos
  app.get("/api/videos", (req, res) => {
    try {
      if (!fs.existsSync(VIDEOS_DIR)) {
        return res.json([]);
      }

      const files = fs.readdirSync(VIDEOS_DIR);
      const videos = files
        .filter(f => /\.(mp4|webm|mov|avi)$/i.test(f))
        .map(f => ({
          name: f,
          size: fs.statSync(path.join(VIDEOS_DIR, f)).size,
        }));

      res.json(videos);
    } catch (error) {
      console.error("[Video Server] Error listing videos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

export { VIDEOS_DIR };
