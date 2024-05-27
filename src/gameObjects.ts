export function setupGameLayout(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  //bottom grey box
  ctx.fillStyle = '#cccccc'
  let x = 0
  let y = 620
  let width = canvas.width - x
  let height = canvas.height - y
  ctx.fillRect(x, y, width, height)

  //black outline on top grey box
  ctx.fillStyle = '#222222'
  ctx.fillRect(x, y, width, 4)
}
