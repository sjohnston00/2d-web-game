type GradientProperties = {
  x0: number
  y0: number
  x1: number
  y1: number
}

export function createGradient(
  ctx: CanvasRenderingContext2D,
  { x0, y0, x1, y1 }: GradientProperties
) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
  return gradient
}

export function slick_carbon_135(
  ctx: CanvasRenderingContext2D,
  { x0, y0, x1, y1 }: GradientProperties
) {
  const gradient = createGradient(ctx, { x0, y0, x1, y1 })
  gradient.addColorStop(0, '#323232')
  gradient.addColorStop(0.4, '#3F3F3F')
  gradient.addColorStop(1, '#1C1C1C')

  return gradient
}
export function perfect_blue_180(
  ctx: CanvasRenderingContext2D,
  { x0, y0, x1, y1 }: GradientProperties
) {
  const gradient = createGradient(ctx, { x0, y0, x1, y1 })
  gradient.addColorStop(0, '#3D4E81')
  gradient.addColorStop(0.48, '#5753C9')
  gradient.addColorStop(1, '#6E7FF3')

  return gradient
}

export function lily_meadow_172(
  ctx: CanvasRenderingContext2D,
  { x0, y0, x1, y1 }: GradientProperties
) {
  const gradient = createGradient(ctx, { x0, y0, x1, y1 })
  gradient.addColorStop(0, '#007ADF')
  gradient.addColorStop(1, '#00ECBC')

  return gradient
}

export default {
  slick_carbon_135,
  perfect_blue_180,
  lily_meadow_172,
  createGradient
}
