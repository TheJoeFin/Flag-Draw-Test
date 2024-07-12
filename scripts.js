const canvas = document.getElementById("drawingCanvas")
const context = canvas.getContext("2d")
const previewCanvas = document.getElementById("previewCanvas")
const previewContext = previewCanvas.getContext("2d")

const width = 600
const height = 400

canvas.width = width
canvas.height = height
previewCanvas.width = width
previewCanvas.height = height

let isDrawing = false
let startX = 0
let startY = 0
let currentTool = "freeDraw"

context.lineCap = "round"
context.lineJoin = "round"
previewContext.lineCap = "round"
previewContext.lineJoin = "round"

document.querySelectorAll('input[name="tool"]').forEach((elem) => {
  elem.addEventListener("change", (e) => {
    currentTool = e.target.value
  })
})

document.getElementById("clearCanvas").addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
})

document.getElementById("saveCanvas").addEventListener("click", () => {
  context.globalCompositeOperation = "destination-over"
  context.fillStyle = bgColorPicker.value
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.globalCompositeOperation = "source-over"

  const link = document.createElement("a")
  link.download = "flag.png"
  link.href = canvas.toDataURL("image/png")
  link.click()
})

const penColorPicker = document.getElementById("penColor")
const bgColorPicker = document.getElementById("bgColor")
const fillShapeCheckbox = document.getElementById("fillShape")
const strokeSizeSlider = document.getElementById("strokeSize")

// Change pen color
penColorPicker.addEventListener("change", (e) => {
  context.strokeStyle = e.target.value
  context.fillStyle = e.target.value
  previewContext.strokeStyle = e.target.value
  previewContext.fillStyle = e.target.value
})

// Change background color
bgColorPicker.addEventListener("input", (e) => {
  canvas.style.backgroundColor = e.target.value
})

// Change stroke size
strokeSizeSlider.addEventListener("input", (e) => {
  context.lineWidth = e.target.value
  previewContext.lineWidth = e.target.value
})

// Initialize pen color and stroke size
context.strokeStyle = penColorPicker.value
context.lineWidth = strokeSizeSlider.value
previewContext.strokeStyle = penColorPicker.value
previewContext.lineWidth = strokeSizeSlider.value

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true
  startX = e.offsetX
  startY = e.offsetY

  if (currentTool === "freeDraw") {
    context.beginPath()
    context.moveTo(startX, startY)
  }
})

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    if (currentTool === "freeDraw") {
      context.lineTo(e.offsetX, e.offsetY)
      context.stroke()
    } else {
      previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
      const endX = e.offsetX
      const endY = e.offsetY

      if (currentTool === "drawRect") {
        const width = endX - startX
        const height = endY - startY
        if (fillShapeCheckbox.checked) {
          previewContext.fillRect(startX, startY, width, height)
        } else {
          previewContext.strokeRect(startX, startY, width, height)
        }
      } else if (currentTool === "drawCircle") {
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        )
        previewContext.beginPath()
        previewContext.arc(startX, startY, radius, 0, Math.PI * 2)
        if (fillShapeCheckbox.checked) {
          previewContext.fill()
        } else {
          previewContext.stroke()
        }
      }
    }
  }
})

canvas.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    isDrawing = false
    const endX = e.offsetX
    const endY = e.offsetY

    if (currentTool === "drawRect") {
      const width = endX - startX
      const height = endY - startY
      if (fillShapeCheckbox.checked) {
        context.fillRect(startX, startY, width, height)
      } else {
        context.strokeRect(startX, startY, width, height)
      }
    } else if (currentTool === "drawCircle") {
      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      )
      context.beginPath()
      context.arc(startX, startY, radius, 0, Math.PI * 2)
      if (fillShapeCheckbox.checked) {
        context.fill()
      } else {
        context.stroke()
      }
    }

    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
  }
})

canvas.addEventListener("mouseout", () => {
  isDrawing = false
  previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height)
})

// Add touch event listeners
canvas.addEventListener("touchstart", handleTouchEvent)
canvas.addEventListener("touchmove", handleTouchEvent)
canvas.addEventListener("touchend", handleTouchEvent)
canvas.addEventListener("touchcancel", handleTouchEvent)

function handleTouchEvent(e) {
  const touch = e.touches[0] || e.changedTouches[0]
  const rect = canvas.getBoundingClientRect()
  const offsetX = touch.clientX - rect.left
  const offsetY = touch.clientY - rect.top

  const mouseEvent = new MouseEvent(e.type.replace("touch", "mouse"), {
    clientX: offsetX,
    clientY: offsetY,
    button: 0,
  })

  canvas.dispatchEvent(mouseEvent)
}
