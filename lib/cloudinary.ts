import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Generate a signed upload URL for client-side uploads
 */
export async function getSignedUploadUrl(folder: string = "uploads") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  };
}

/**
 * Upload an image from base64 or URL
 */
export async function uploadImage(
  source: string,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: object;
  } = {}
) {
  const { folder = "uploads", publicId, transformation } = options;

  const result = await cloudinary.uploader.upload(source, {
    folder,
    public_id: publicId,
    transformation,
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Delete an image by public ID
 */
export async function deleteImage(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === "ok";
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
) {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop,
        quality,
        fetch_format: format,
      },
    ],
    secure: true,
  });
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 150) {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: "thumb",
  });
}

/**
 * Upload preset configurations for different use cases
 */
export const uploadPresets = {
  product: {
    folder: "products",
    transformation: {
      width: 1200,
      height: 1200,
      crop: "limit",
      quality: "auto:best",
    },
  },
  avatar: {
    folder: "avatars",
    transformation: {
      width: 400,
      height: 400,
      crop: "fill",
      gravity: "face",
    },
  },
  banner: {
    folder: "banners",
    transformation: {
      width: 1920,
      height: 600,
      crop: "fill",
      quality: "auto:good",
    },
  },
  document: {
    folder: "documents",
    resource_type: "raw",
  },
};
