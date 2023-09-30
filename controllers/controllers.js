const { CustomAPIErrorHandler } = require('../errors/custom-errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const { Deepgram } = require("@deepgram/sdk");
const { response } = require('express');
const fs = require('fs').promises;
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)

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
        // console.log(req.files.video)
        res.status(StatusCodes.OK).json({ videos: videoUrls });
    } catch (error) {
        throw new CustomAPIErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};
const transcribe = async (req, res) => {
    try {
        const response = await deepgram.transcription.preRecorded({
            url: "https://chrome-ext-server.onrender.com/" + req.params.filename
        },
            { punctuate: true, utterances: true }
        )

        const transcript = response.toSRT()
        res.status(StatusCodes.OK).json({ transcript });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
}


module.exports = {
    sendVideo,
    test,
    getVideos,
    transcribe
};
