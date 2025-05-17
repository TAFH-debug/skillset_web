import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID!,
  credentials: {
    type: "service_account",
    project_id: "cogent-script-460109-k8",
    client_email: "serviceaccount@cogent-script-460109-k8.iam.gserviceaccount.com",
    client_id: "114156594866956768980",
    universe_domain: "googleapis.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
  }
});

const bucket = storage.bucket(process.env.BUCKET_NAME!);


export { bucket, storage };
