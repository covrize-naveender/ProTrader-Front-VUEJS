export default class Arc {
  constructor(overlay, ctx, m = '') {
    this.ctx = ctx
    this.comp = overlay
    this.T = overlay.$props.config.TOOL_COLL
  }

  draw(p1, p2, p3) {
    const layout = this.comp.$props.layout

    let x1 = layout.t2screen(p1[0])
    let y1 = layout.$2screen(p1[1])
    let x2 = layout.t2screen(p2[0])
    let y2 = layout.$2screen(p2[1])
    let x3 = Math.abs(x2 - x1) / 2 + Math.min(x1, x2)
    let y3 = layout.$2screen(p3[1])

    let t = 0.5;
    let cpX = (x3 - (1 - t) * (1 - t) * x1 - t * t * x2) / (2 * t * (1 - t));
    let cpY = (y3 - (1 - t) * (1 - t) * y1 - t * t * y2) / (2 * t * (1 - t));

    this.ctx.moveTo(x1, y1)
    this.ctx.quadraticCurveTo(cpX, cpY, x2, y2);

    this.comp.collisions.push(this.make([x1, y1], [x2, y2], [x3, y3]))
  }

  // Collision function. x, y - mouse coord.
  make(p1, p2, p3) {
    return (x, y) => {
      const leftX = Math.min(p1[0], p2[0])
      const rightX = Math.max(p1[0], p2[0])
      const xIsWithin = x >= leftX && x <= rightX

      if (!xIsWithin) return false

      const topY = Math.max(p1[1], p2[1], p3[1])
      const bottomY = Math.min(p1[1], p2[1], p3[1])
      return y >= bottomY && y <= topY
    }
  }
}
