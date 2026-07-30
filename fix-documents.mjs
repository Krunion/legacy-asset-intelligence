import 'dotenv/config';
import mysql from 'mysql2/promise';

const forgeUrl = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
const dbUrl = process.env.DATABASE_URL;

async function main() {
  // Connect to DB
  const conn = await mysql.createConnection(dbUrl + '&ssl={"rejectUnauthorized":true}');
  
  // Get all documents with spaces in their storageUrl
  const [docs] = await conn.execute(
    "SELECT id, fileName, storageUrl FROM project_documents WHERE storageUrl LIKE '% %'"
  );
  
  console.log(`Found ${docs.length} documents with spaces in storage URL`);
  
  for (const doc of docs) {
    console.log(`\nFixing: ${doc.fileName} (id: ${doc.id})`);
    console.log(`  Old URL: ${doc.storageUrl}`);
    
    // Generate a sanitized key
    const oldPath = doc.storageUrl.replace('/manus-storage/', '');
    const sanitizedKey = oldPath.replace(/\s+/g, '-');
    const newStorageUrl = `/manus-storage/${sanitizedKey}`;
    
    console.log(`  New URL: ${newStorageUrl}`);
    
    // We can't move the file in S3 (no access), so we need to:
    // 1. Download from the original location (if possible) or skip
    // 2. Re-upload with sanitized name
    // Since the original file with spaces can't be downloaded (the 403 issue),
    // we'll just update the DB to use a placeholder and inform the user to re-upload
    
    // Actually, let's try the S3 direct URL approach - the file was uploaded via S3 presigned PUT
    // which means fetch() encoded the spaces to %20. So the file is actually stored at the %20 path.
    // Let's try getting a presign URL for the %20-encoded path
    
    // The presign API receives the path as a query param. If we pass it with %20,
    // the API will decode it to spaces and generate a CloudFront URL with spaces.
    // We need the API to generate a URL for the literal %20 path.
    // This isn't possible through the presign API.
    
    // The only real fix is to update the DB record to mark it as needing re-upload
    // and change the storageProxy to handle this case
    
    // For now, update the DB to use the sanitized URL (the file needs to be re-uploaded)
    await conn.execute(
      "UPDATE project_documents SET storageUrl = ?, notes = CONCAT(COALESCE(notes, ''), ' [File needs re-upload - original had spaces in filename]') WHERE id = ?",
      [newStorageUrl, doc.id]
    );
    console.log(`  Updated DB record`);
  }
  
  await conn.end();
  console.log('\nDone. Documents with spaces have been flagged for re-upload.');
}

main().catch(console.error);
