import fs from 'fs';
import mysql from 'mysql2/promise';

const videoPath = '/home/ubuntu/upload/InitialLAIIntroductionVideoforPhase1_1080p.mp4';
const videoData = fs.readFileSync(videoPath);
const base64Video = videoData.toString('base64');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'legacy_asset_intelligence',
});

try {
  await connection.execute(
    `INSERT INTO videos (name, description, phaseNumber, videoData, mimeType, fileSize) 
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE videoData = VALUES(videoData), fileSize = VALUES(fileSize)`,
    [
      'LAI Phase 1 Introduction',
      'Initial LAI Introduction Video for Phase 1 - Discovery & Executive Assessments',
      1,
      base64Video,
      'video/mp4',
      videoData.length
    ]
  );
  console.log('Video inserted successfully');
} catch (error) {
  console.error('Error inserting video:', error);
} finally {
  await connection.end();
}
