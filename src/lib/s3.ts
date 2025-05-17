import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID!,
  keyFilename: "credentials.json",
});

const bucket = storage.bucket(process.env.BUCKET_NAME!);


export { bucket, storage };
