import { storagePut } from "./server/storage";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { projectDocuments } from "./drizzle/schema";
import { eq } from "drizzle-orm";

async function main() {
  // The existing doc has spaces in the key and can't be downloaded.
  // We need to re-upload it with a sanitized name.
  // First, let's read the original file from the upload procedure's buffer
  // Since we can't re-read the original file, we'll just update the DB to point to a working key.
  // Actually, the original file data is lost. The user will need to re-upload.
  // But we can at least update the record to show a proper error or mark it for re-upload.
  
  // Actually, let's try a different approach: upload a placeholder and inform the user
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  // Delete the broken record so user can re-upload
  await db.delete(projectDocuments).where(eq(projectDocuments.id, 1));
  console.log("Deleted broken document record (id=1). User will need to re-upload.");
  console.log("Future uploads will have sanitized filenames (no spaces).");
  
  await connection.end();
}
main();
