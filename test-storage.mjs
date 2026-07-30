import 'dotenv/config';

const forgeUrl = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

// Step 1: Get a presigned PUT URL
const putPresignUrl = new URL('v1/storage/presign/put', forgeUrl + '/');
putPresignUrl.searchParams.set('path', 'test-verify/hello.txt');
putPresignUrl.searchParams.set('contentType', 'text/plain');

console.log('Getting PUT presign URL...');
const putResp = await fetch(putPresignUrl, {
  headers: { Authorization: `Bearer ${forgeKey}` }
});
const putData = await putResp.json();
console.log('PUT presign response:', JSON.stringify(putData));

// Step 2: Upload the file
console.log('Uploading file...');
const uploadResp = await fetch(putData.url, {
  method: 'PUT',
  headers: { 'Content-Type': 'text/plain' },
  body: 'Hello World Test'
});
console.log('Upload status:', uploadResp.status);

// Step 3: Get a presigned GET URL
const getPresignUrl = new URL('v1/storage/presign/get', forgeUrl + '/');
getPresignUrl.searchParams.set('path', 'test-verify/hello.txt');

console.log('Getting GET presign URL...');
const getResp = await fetch(getPresignUrl, {
  headers: { Authorization: `Bearer ${forgeKey}` }
});
const getData = await getResp.json();
console.log('GET presign response:', JSON.stringify(getData));

// Step 4: Download the file
console.log('Downloading file...');
const dlResp = await fetch(getData.url);
console.log('Download status:', dlResp.status);
if (dlResp.ok) {
  const text = await dlResp.text();
  console.log('Content:', text);
} else {
  const errText = await dlResp.text();
  console.log('Error:', errText.substring(0, 200));
}
