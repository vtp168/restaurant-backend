import { minioClient } from "../middlewares/multer.js";
import { fileModel } from "../models/file.model.js";
import asyncHandler from 'express-async-handler';


export const uploadSingleFile = asyncHandler(async (req, res) => {
    const file = req.file;
    const newFile = new fileModel(file)
    await newFile.save();
    res.json(file);
});

export const uploadMultiple = asyncHandler(async (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    // console.log(files)
    const fileModels = files.map(file => new fileModel(file));
    await Promise.all(fileModels.map(fileModel => fileModel.save()));
    res.json(files);
});

export const getFileById = asyncHandler(async (req, res) => {
    const fileId = req.params.id;
    const file = await fileModel.findById(fileId);
    const fileStream = await minioClient.getObject(file.bucket, file.filename);
    res.set({
        'Content-Type': file.mimetype,
        'Content-Disposition': `attachment; filename="${file.originalname}"`
    });
    return fileStream.pipe(res);
});

export const deleteFileById = asyncHandler(async (req, res) => {
    const fileId = req.params.id;
    const file = await fileModel.findById(fileId);
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }
    await minioClient.removeObject(file.bucket, file.filename, {})
    return res.status(200).json({ message: "File deleted successfully" });
});

export const getFileList = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };
    const files = await fileModel.paginate({}, options);
    res.json(files);
});

export const getFileListByBucket = asyncHandler(async (req, res) => {
    const bucketName = req.params.bucket;
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };
    const files = await fileModel.paginate({ bucket: bucketName }, options);
    res.json(files);
});

export const getFileListByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };
    const files = await fileModel.paginate({ user: userId }, options);
    res.json(files);
});

export const getFileListByCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };
    const files = await fileModel.paginate({ course: courseId }, options);
    res.json(files);
});

export const getFileListByTeacher = asyncHandler(async (req, res) => {
    const teacherId = req.params.teacherId;
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };
    const files = await fileModel.paginate({ teacher: teacherId }, options);
    res.json(files);
});