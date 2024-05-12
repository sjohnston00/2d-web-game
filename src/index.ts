import canvasGradients from './canvas/gradients.js'

const canvas = document.querySelector('canvas')
if (!canvas) {
  throw new Error('No canvas found')
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const middleWidth = canvas.width / 2

const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('No canvas context found')
}

window.onresize = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  drawCanvasBg(canvas, ctx)
}

drawCanvasBg(canvas, ctx)

// background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
//  background-blend-mode: multiply;

function drawCanvasBg(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  //canvas background black
  const bgGradient = canvasGradients.lily_meadow_172(ctx, {
    x0: middleWidth,
    y0: 0,
    x1: middleWidth,
    y1: canvas.height
  })
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const LINES_TO_RENDER = 6
  const lineWidthGap = canvas.width / LINES_TO_RENDER
  const lineHeightGap = canvas.height / LINES_TO_RENDER

  ctx.strokeStyle = '#ffffff10'
  for (let index = 0; index < LINES_TO_RENDER - 1; index++) {
    ctx.moveTo(lineWidthGap * (index + 1), 0)
    ctx.setLineDash([6])
    ctx.lineTo(lineWidthGap * (index + 1), canvas.height)
    ctx.stroke()
  }

  for (let index = 0; index < LINES_TO_RENDER - 1; index++) {
    ctx.moveTo(0, lineHeightGap * (index + 1))
    ctx.lineTo(canvas.width, lineHeightGap * (index + 1))
    ctx.stroke()
  }
}
