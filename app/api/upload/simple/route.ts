import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  console.log("=== POST /api/upload/simple START ===");

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.log("No file provided in request");
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log("File received:", file.name, file.size, file.type);

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Try Cloudinary upload first
      try {
        console.log("Trying Cloudinary upload...");
        const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        const uploadResponse = await cloudinary.uploader.upload(base64File, {
          folder: 'shop2_banners',
          public_id: `banner-${Date.now()}`,
          resource_type: 'auto',
        });

        console.log("✅ Cloudinary upload successful:", uploadResponse.secure_url);

        return NextResponse.json({
          imageUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          provider: 'cloudinary'
        });
      } catch (cloudinaryError) {
        console.warn("⚠️ Cloudinary upload failed, falling back to local storage:", cloudinaryError.message);
      }
    } else {
      console.log("⚠️ Cloudinary not configured, using local storage");
    }

    // Fallback to local storage
    console.log("Using local storage fallback...");
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log("Created uploads directory:", uploadsDir);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `banner-${timestamp}.${extension}`;
    const filePath = path.join(uploadsDir, filename);
    
    await writeFile(filePath, buffer);
    console.log("✅ File saved locally to:", filePath);

    // Return the public URL
    const imageUrl = `/uploads/banners/${filename}`;
    
    return NextResponse.json({
      imageUrl: imageUrl,
      publicId: filename,
      provider: 'local',
      message: "File uploaded locally (Cloudinary not available)"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
