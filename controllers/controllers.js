const { CustomAPIErrorHandler } = require('../errors/custom-errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs').promises;


const videoUploadPath = path.join(__dirname, '../server/uploads/');

// Middleware for checking if a video file was uploaded
const checkVideoUploaded = (video) => {
    if (!video) {
        throw new CustomAPIErrorHandler('No video file uploaded', StatusCodes.BAD_REQUEST);
    }
    if (!video.mimetype.startsWith('video')) {
        throw new CustomAPIErrorHandler('Please upload a video', StatusCodes.BAD_REQUEST);
    }
};

// Function to save a video file in chunks
const saveVideoFile = async (video) => {
    const uploadPath = path.join(videoUploadPath, video.name);
    const writeStream = fs.createWriteStream(uploadPath);

    await new Promise((resolve, reject) => {
        video.data.on('data', (chunk) => {
            writeStream.write(chunk);
        });
        video.data.on('end', () => {
            writeStream.end();
            resolve();
        });
        video.data.on('error', (error) => {
            writeStream.end();
            reject(error);
        });
    });
};

const sendVideo = async (req, res) => {
    try {
        const video = req.files.video;
        checkVideoUploaded(video);
        await saveVideoFile(video);
        res.status(StatusCodes.OK).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const test = (req, res) => {
    res.status(StatusCodes.OK).send('Hello');
};

const getVideos = async (req, res) => {
    try {
        const files = await fs.readdir(videoUploadPath);
        const allowedExtensions = ['.webm', '.mp4', '.avi', '.mkv'];

        const videoFiles = files.filter((file) => {
            const extname = path.extname(file).toLowerCase();
            return allowedExtensions.includes(extname);
        });

        const videoUrls = videoFiles.map((file) => {
            const fileName = path.basename(file);
            console.log(fileName);
            return `/uploads/${fileName}`;
        });

        res.status(StatusCodes.OK).json({ videos: videoUrls });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


module.exports = {
    sendVideo,
    test,
    getVideos,
};
