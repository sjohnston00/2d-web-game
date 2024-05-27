export function setupGamePlayer(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  playerState: any
) {
  ctx.strokeStyle = '#000000'
  ctx.setLineDash([0])
  ctx.lineWidth = 3
  let x = playerState.x
  let y = playerState.y
  let width = 25
  let height = 25
  ctx.strokeRect(x, y, width, height)
}
