import multer from "multer";
import { Client } from 'minio';
import { MinioStorageEngine } from '@namatery/multer-minio';

export const minioClient = new Client({
    port: 9000,
    endPoint: 'restaurant-file-server',
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
    useSSL: false,
});

const options = {
    region: 'us-east-1',
    bucket: {
        init: true,
        versioning: false,
        forceDelete: false,
    },
    object: {
        name: (req, file) => {
            return `${Date.now()}-${file.originalname}`;
        },
        useOriginalFilename: false,
    },
};

const storage = new MinioStorageEngine(minioClient, 'restaurant-files', options);

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
}).single('file');

export const uploads = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
}).array('files', 10);

//get file url
export const getFileUrl = async (file) => {
  if (!file) return null;

  try {
    const url = await minioClient.presignedGetObject(
      'restaurant-files', // your bucket name
      file.filename,            // stored object name
      60 * 60                   // link expires in 1 hour
    );
    return url;
  } catch (err) {
    console.error("Error generating MinIO URL:", err);
    return null;
  }
};

export const getMenuImage = async (req,res,file) => {
    // const fileId = req.params.id;
    // const file = await fileModel.findById(fileId);
    const fileStream = await minioClient.getObject(file.bucket, file.filename);
    res.set({
        'Content-Type': file.mimetype,
        'Content-Disposition': `attachment; filename="${file.originalname}"`
    });
    return fileStream.pipe(res);
}
