const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { Deepgram } = require('@deepgram/sdk')
require('dotenv').config()
const app = express()



app.use(cors())
app.use(express.raw({ type: "*/*", limit: 25 * 1024 * 1024 }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const deepgram = new Deepgram(process.env.Auth)

const videoUploadPath = path.join(__dirname, '../server/uploads/');
let id = 10000

app.get("/api/play/:video", (req, res) => {
    const name = req.params.video
    const videoPath = uploadPath + name
    res.sendFile(videoPath)
})
app.get('/getvideo',async(req,res)=>{
    try {
        const files = await fs.promises.readdir(videoUploadPath);
        const videoFiles = files.filter((file) => {
            const extname = path.extname(file).toLowerCase();
            return ['.mp4', '.avi', '.mkv', '.webm'].includes(extname);
        });

        const videoUrls = videoFiles.map((file) => `/uploads/${file}`);

        res.status(StatusCodes.OK).json({ videos: videoUrls });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
})
app.get('/api/create', async (req, res) => {
    id = id + 1
    let writable = ''
    try {
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: "Failed", message: "Failed to create video file" })
    }

    if (writable) {
        res.status(200).json({ status: "Success", message: "Video file created successfully", id: id })
    }
})

const arrayBuff = []

app.post('/api/record/:id', async (req, res) => {
    try {
        const filename = req.params.id + '.mp4'
        const buffer = req.body

        if (!Buffer.isBuffer(buffer)) {
            res.status(400).json({ status: "Failed", message: "Invalid chunk" })
        }
        arrayBuff.push(buffer)
        res.status(200).json({ status: "Success", message: "Chunk received successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Error", message: "Internal server error" })
    }
})

app.get('/api/video/:id', async (req, res) => {
    const filename = req.params.id + '.mp4'
    if (arrayBuff.length != 0) {
        const complete = Buffer.concat(arrayBuff)
        fs.createWriteStream(uploadPath + filename).write(complete)
    } else {
        console.log("No video chunks")
        res.status(404).json({ status: "Failed", message: "Video chunks not received" })
    }

    const response = await deepgram.transcription.preRecorded(
        { url: "https://chrome-ext-server.onrender.com/uploads/" + filename },
        { punctuate: true, utterances: true }
    ).catch(err => {
        console.log(err)
        return res.status(400).json({ status: "Failed", message: "Error getting tran" })
    })

    const srtTranscript = response.toSRT();

    res.status(200).json({
        status: "Success",
        message: "File uploaded successfully",
        video_url: "https://chrome-ext-server.onrender.com/uploads/" + filename,
        "transcript": srtTranscript
    })
})

app.listen(5000 || process.env.PORT, () => {
    console.log("This server is running")
})
