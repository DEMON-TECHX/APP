document.addEventListener("DOMContentLoaded", () => {
  const videoUrlInput = document.getElementById("videoUrl")
  const downloadBtn = document.getElementById("downloadBtn")
  const statusDiv = document.getElementById("status")

  downloadBtn.addEventListener("click", () => {
    const videoUrl = videoUrlInput.value.trim()
    if (!videoUrl) {
      statusDiv.textContent = "Please enter a valid YouTube video URL"
      return
    }

    statusDiv.textContent = "Downloading..."

    fetch(`/download?url=${encodeURIComponent(videoUrl)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = "video.mp4"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        statusDiv.textContent = "Download complete!"
      })
      .catch((error) => {
        console.error("Error:", error)
        statusDiv.textContent = "An error occurred while downloading the video"
      })
  })
})

