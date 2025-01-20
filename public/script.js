document.addEventListener("DOMContentLoaded", () => {
  const videoUrlInput = document.getElementById("videoUrl")
  const fetchBtn = document.getElementById("fetchBtn")
  const videoInfoDiv = document.getElementById("videoInfo")

  fetchBtn.addEventListener("click", () => {
    const videoUrl = videoUrlInput.value.trim()
    if (!videoUrl) {
      videoInfoDiv.innerHTML = '<p class="error">Please enter a valid YouTube video URL</p>'
      return
    }

    videoInfoDiv.innerHTML = "<p>Fetching video information...</p>"

    fetch(`/video-info?url=${encodeURIComponent(videoUrl)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        videoInfoDiv.innerHTML = `
                    <h2>${data.title}</h2>
                    <img src="${data.thumbnailUrl}" alt="Video Thumbnail">
                    <p><strong>Upload Date:</strong> ${formatDate(data.uploadDate)}</p>
                    <p><strong>Duration:</strong> ${formatDuration(data.duration)}</p>
                    <p><strong>View Count:</strong> ${data.viewCount.toLocaleString()}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                `
      })
      .catch((error) => {
        console.error("Error:", error)
        videoInfoDiv.innerHTML = '<p class="error">An error occurred while fetching video information</p>'
      })
  })

  function formatDate(dateString) {
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    return `${year}-${month}-${day}`
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
})

