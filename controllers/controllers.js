const { CustomAPIErrorHandler } = require('../errors/custom-errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path')

const sendVideo = async (req, res) => {
    const video = req.files.video; // Assuming your file input field is named 'video'
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes

    try {
        // Check if a file was uploaded
        if (!video) {
            throw new CustomAPIErrorHandler('No video file uploaded', StatusCodes.BAD_REQUEST);
        }

        // Check if the uploaded file size exceeds the allowed maximum
        if (video.size > maxSize) {
            throw new CustomAPIErrorHandler('Please upload a video less than 50MB', StatusCodes.BAD_REQUEST);
        }

        // Check if the uploaded file is of the expected mimetype (e.g., video/mp4)
        if (!video.mimetype.startsWith('video')) {
            throw new CustomAPIErrorHandler('Please upload a video', StatusCodes.BAD_REQUEST);
        }

        // Define the path where you want to save the uploaded video
        const uploadPath =path.join( __dirname, '../server/uploads/' + video.name); // Adjust the path as needed

        // Use the fs module to save the file to disk
       await video.mv(uploadPath)
        // Respond with a success message
        res.status(StatusCodes.OK).json({ message: 'Video uploaded successfully' });
    } catch (error) {
        throw new CustomAPIErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};
const test = (req, res) => {
    res.send('Hello')
    res.status(StatusCodes.OK)
}
const view = (req, res) => {

}

module.exports = {
    sendVideo,
    test,
    view
};
