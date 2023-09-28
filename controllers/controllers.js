const { CustomAPIErrorHandler } = require('../errors/custom-errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs').promises;

const sendVideo = async (req, res) => {
    const video = req.files.video;
    const maxSize = 50 * 1024 * 1024;

    try {
        if (!video) {
            throw new CustomAPIErrorHandler('No video file uploaded', StatusCodes.BAD_REQUEST);
        }

        if (video.size > maxSize) {
            throw new CustomAPIErrorHandler('Please upload a video less than 50MB', StatusCodes.BAD_REQUEST);
        }

        if (!video.mimetype.startsWith('video')) {
            throw new CustomAPIErrorHandler('Please upload a video', StatusCodes.BAD_REQUEST);
        }

        const uploadPath = path.join(__dirname, '../server/uploads/' + video.name);

        await video.mv(uploadPath);
        res.status(StatusCodes.OK).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        throw new CustomAPIErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const test = (req, res) => {
    res.send('Hello');
    res.status(StatusCodes.OK);
};

const videoUploadPath = path.join(__dirname, '../server/uploads/');

const getVideos = async (req, res) => {
    try {
        const files = await fs.readdir(videoUploadPath);
        const videoFiles = files.filter((file) => {
            const extname = path.extname(file).toLowerCase();
            return ['.mp4', '.avi', '.mkv'].includes(extname);
        });

        const videoUrls = videoFiles.map((file) => {
            return `/uploads/${file}`;
        });

        res.status(StatusCodes.OK).json({ videos: videoUrls });
    } catch (error) {
        throw new CustomAPIErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    sendVideo,
    test,
    getVideos
};
