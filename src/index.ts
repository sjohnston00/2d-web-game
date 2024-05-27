import Game from './Game.js'
import canvasGradients from './canvas/gradients.js'
import { setupGameLayout } from './gameObjects.js'
import { setupGamePlayer } from './gamePlayer.js'

let game = new Game()
game.init()

//game state
requestAnimationFrame(gameLoop)
function gameLoop(timeStamp: number) {
  //reset canvas
  game.update(timeStamp)
  game.draw()

  requestAnimationFrame(gameLoop)
}

// background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
//  background-blend-mode: multiply;

function drawCanvasBg(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  //canvas background black
  // const bgGradient = canvasGradients.lily_meadow_172(ctx, {
  //   x0: middleWidth,
  //   y0: 0,
  //   x1: middleWidth,
  //   y1: canvas.height
  // })
  // ctx.fillStyle = bgGradient
  // ctx.fillRect(0, 0, canvas.width, canvas.height)

  const LINES_TO_RENDER = 10
  const lineWidthGap = canvas.width / LINES_TO_RENDER
  const lineHeightGap = canvas.height / LINES_TO_RENDER

  ctx.strokeStyle = '#00000010'
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
