// Draws a segment, adds corresponding collision f-n

import Math2 from './math.js'

export default class Seg {
  // Overlay ref, canvas ctx
  constructor(overlay, ctx, m = '', HDstyle) {
    this.ctx = ctx
    this.comp = overlay
    this.T = overlay.$props.config.TOOL_COLL
    this.levelName = m
    this.hdStyle = HDstyle
  }

  // p1[t, $], p2[t, $] (time-price coordinates)
  draw(p1, p2) {
    const layout = this.comp.$props.layout

    let x1 = layout.t2screen(p1[0])
    let y1 = layout.$2screen(p1[1])
    let x2 = layout.t2screen(p2[0])
    let y2 = layout.$2screen(p2[1])

    if (this.hdStyle == true) {
      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x2, y2)

      if (this.levelName) {
        this.ctx.fillStyle = this.ctx.strokeStyle
        this.ctx.textAlign = 'left'

        const fontSize = 15;
        const padding = 5;

        this.ctx.font = `15px serif`
        const textMetrics = this.ctx.measureText(this.levelName);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        const width = textWidth + 2 * padding;
        const height = textHeight + 2 * padding;
        const bgX = (x2 - textWidth / 2) - padding;
        const bgY = (y2 - 7) - textHeight - padding;
        const radius = 5;

        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        // this.ctx.beginPath();
        this.ctx.moveTo(bgX + radius, bgY);
        this.ctx.arcTo(bgX + width, bgY, bgX + width, bgY + height, radius);
        this.ctx.arcTo(bgX + width, bgY + height, bgX, bgY + height, radius);
        this.ctx.arcTo(bgX, bgY + height, bgX, bgY, radius);
        this.ctx.arcTo(bgX, bgY, bgX + width, bgY, radius);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.levelName, x2 - textWidth / 2, y2 - 7)

      }
    }
    else {
      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x2, y2)

      if (this.levelName) {
        this.ctx.fillStyle = this.ctx.strokeStyle
        this.ctx.textAlign = x1 < x2 ? 'left' : 'right'
        this.ctx.fillText(this.levelName, x1, y1 - 5)
      }
    }


    this.comp.collisions.push(this.make([x1, y1], [x2, y2]))
  }

  // Collision function. x, y - mouse coord.
  make(p1, p2) {
    return (x, y) => {
      return Math2.point2seg([x, y], p1, p2) < this.T
    }
  }
}
