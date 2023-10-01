const { CustomAPIErrorHandler } = require('../errors/custom-errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs').promises



const sendVideo = async (req, res) => {
    const video = req.files.video;

    try {
        if (!video) {
            throw new CustomAPIErrorHandler('No video file uploaded', StatusCodes.BAD_REQUEST);
        }

       

        if (!video.mimetype.startsWith('video')) {
            throw new CustomAPIErrorHandler('Please upload a video', StatusCodes.BAD_REQUEST);
        }

        const uploadPath = path.join(__dirname, '../server/uploads/' + video.name);

        await video.mv(uploadPath);
        res.status(StatusCodes.OK).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const test = (req, res) => {
    res.status(StatusCodes.OK).send('Hello');
};

const videoUploadPath = path.join(__dirname, '../server/uploads/');

const getVideos = async (req, res) => {
    try {
        const files = await fs.readdir(videoUploadPath);
        const videoFiles = files.filter((file) => {
            const extname = path.extname(file).toLowerCase();
            return ['.mp4', '.avi', '.mkv',].includes(extname);
        });

        const videoUrls = videoFiles.map((file) => {
            const fileName = path.basename(file); // Get the file name
            console.log(fileName); // Log the file name
            return `/uploads/${fileName}`; // Construct the URL with the file name
        });

        res.status(StatusCodes.OK).json({ videos: videoUrls });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

// const transcribe = async (req, res) => {
   
// };



module.exports = {
    sendVideo,
    test,
    getVideos,
};
