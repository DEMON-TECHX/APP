document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn")
  const registerBtn = document.getElementById("register-btn")
  const logoutBtn = document.getElementById("logout-btn")
  const authSection = document.getElementById("auth-section")
  const contentSection = document.getElementById("content-section")
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const loginFormElement = document.getElementById("login-form-element")
  const registerFormElement = document.getElementById("register-form-element")
  const uploadForm = document.getElementById("upload-form")
  const codeSharingForm = document.getElementById("code-sharing-form")
  const videosContainer = document.getElementById("videos-container")
  const snippetsContainer = document.getElementById("snippets-container")

  let currentUser = null

  function showAuthForms() {
    authSection.classList.remove("hidden")
    contentSection.classList.add("hidden")
    loginBtn.classList.remove("hidden")
    registerBtn.classList.remove("hidden")
    logoutBtn.classList.add("hidden")
  }

  function showContent() {
    authSection.classList.add("hidden")
    contentSection.classList.remove("hidden")
    loginBtn.classList.add("hidden")
    registerBtn.classList.add("hidden")
    logoutBtn.classList.remove("hidden")
  }

  loginBtn.addEventListener("click", () => {
    loginForm.classList.remove("hidden")
    registerForm.classList.add("hidden")
  })

  registerBtn.addEventListener("click", () => {
    loginForm.classList.add("hidden")
    registerForm.classList.remove("hidden")
  })

  logoutBtn.addEventListener("click", () => {
    currentUser = null
    showAuthForms()
  })

  loginFormElement.addEventListener("submit", async (e) => {
    e.preventDefault()
    const username = document.getElementById("login-username").value
    const password = document.getElementById("login-password").value

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        currentUser = data.username
        showContent()
        fetchVideos()
        fetchSnippets()
      } else {
        alert("Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    }
  })

  registerFormElement.addEventListener("submit", async (e) => {
    e.preventDefault()
    const username = document.getElementById("register-username").value
    const password = document.getElementById("register-password").value

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        alert("Registration successful. Please log in.")
        loginForm.classList.remove("hidden")
        registerForm.classList.add("hidden")
      } else {
        alert("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    }
  })

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData(uploadForm)

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Video uploaded successfully!")
        uploadForm.reset()
        fetchVideos()
      } else {
        alert("Failed to upload video. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    }
  })

  codeSharingForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const title = document.getElementById("snippet-title").value
    const code = document.getElementById("code-snippet").value

    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, code }),
      })

      if (response.ok) {
        alert("Code snippet shared successfully!")
        codeSharingForm.reset()
        fetchSnippets()
      } else {
        alert("Failed to share code snippet. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    }
  })

  async function fetchVideos() {
    try {
      const response = await fetch("/api/videos")
      const videos = await response.json()
      displayVideos(videos)
    } catch (error) {
      console.error("Error fetching videos:", error)
    }
  }

  async function fetchSnippets() {
    try {
      const response = await fetch("/api/snippets")
      const snippets = await response.json()
      displaySnippets(snippets)
    } catch (error) {
      console.error("Error fetching snippets:", error)
    }
  }

  function displayVideos(videos) {
    videosContainer.innerHTML = ""
    videos.forEach((video) => {
      const videoItem = document.createElement("li")
      videoItem.className = "video-item"
      videoItem.innerHTML = `
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <video controls>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `
      videosContainer.appendChild(videoItem)
    })
  }

  function displaySnippets(snippets) {
    snippetsContainer.innerHTML = ""
    snippets.forEach((snippet) => {
      const snippetItem = document.createElement("li")
      snippetItem.className = "snippet-item"
      snippetItem.innerHTML = `
                <h3>${snippet.title}</h3>
                <pre><code>${snippet.code}</code></pre>
            `
      snippetsContainer.appendChild(snippetItem)
    })
  }

  // Check if user is already logged in (you might want to implement this on the server-side)
  if (currentUser) {
    showContent()
    fetchVideos()
    fetchSnippets()
  } else {
    showAuthForms()
  }
})

