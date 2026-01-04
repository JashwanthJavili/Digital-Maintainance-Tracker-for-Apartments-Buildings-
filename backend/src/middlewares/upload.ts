import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage - use memory storage for compression
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only image files are allowed!'));
  }
};

// Create multer upload middleware
const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Image compression middleware
export const compressImage = async (req: any, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'request-' + uniqueSuffix + '.jpg';
    const filepath = path.join(uploadsDir, filename);

    // Compress and resize image
    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filepath);

    // Add filename to request
    req.file.filename = filename;
    next();
  } catch (error) {
    console.error('Error compressing image:', error);
    next(error);
  }
};

// Error handler for multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Image is too large in size. Maximum size is 5MB. Please try again with a smaller image.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Delete image file
export const deleteImage = (filename: string) => {
  if (!filename) return;
  
  const filepath = path.join(uploadsDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    console.log(`Deleted image: ${filename}`);
  }
};

export const upload = multerUpload;
