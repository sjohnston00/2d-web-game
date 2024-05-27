type ProjectileConstructor = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  radius?: number
  speed?: number
  range?: number
  angle?: number
}

export default class Projectile {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  public x: number
  public y: number
  private speed: number
  private range: number
  private angle: number
  private radius: number

  public startingX: number
  public startingY: number

  constructor({
    canvas,
    ctx,
    x,
    y,
    angle = 0,
    range = Infinity,
    speed = 10,
    radius = 5
  }: ProjectileConstructor) {
    this.canvas = canvas
    this.ctx = ctx
    this.x = x
    this.y = y
    this.startingX = x
    this.startingY = y

    this.angle = angle
    this.range = range
    this.speed = speed
    this.radius = radius
  }

  draw() {
    if (
      Math.abs(this.x - this.startingX) > this.range ||
      Math.abs(this.y - this.startingY) > this.range
    ) {
      return
    }
    this.ctx.strokeStyle = '#000000'
    this.ctx.setLineDash([0])
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    this.ctx.closePath()
    this.ctx.fill()
  }

  update() {
    this.x += this.speed * Math.cos(this.angle)
    this.y += this.speed * Math.sin(this.angle)
  }
}
