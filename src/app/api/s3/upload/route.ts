import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/s3";

const handler = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.name}`;

    const blob = bucket.file(uniqueFileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type
      },
      public: true
    });

    const promise: Promise<NextResponse> = new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('Error uploading to GCS:', error);
        resolve(NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        ));
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        
        resolve(NextResponse.json({ 
          success: true,
          downloadUrl: publicUrl
        }));
      });

      blobStream.end(buffer);
    });

    return promise;

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export { handler as POST };