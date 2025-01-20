import express from "express"
import ytdl from "ytdl-core"
import cors from "cors"

const app = express()
const port = 3000

app.use(express.static("public"))
app.use(cors())

app.get("/download", async (req, res) => {
  try {
    const videoURL = req.query.url
    if (!videoURL) {
      return res.status(400).send("Video URL is required")
    }

    const info = await ytdl.getInfo(videoURL)
    const format = ytdl.chooseFormat(info.formats, { quality: "highest" })

    res.header("Content-Disposition", `attachment; filename="video.mp4"`)
    ytdl(videoURL, { format: format }).pipe(res)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).send("An error occurred while downloading the video")
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

