import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/s3";

const handler = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const fileData = formData.get('file');

    if (!fileData || !(fileData instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const originalName = (fileData as unknown as { name?: string }).name || 'unnamed-file';
    const mimeType = fileData.type || 'application/octet-stream';

    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${originalName}`;

    const blob = bucket.file(uniqueFileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mimeType
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