export default class Knitter {
  constructor() {
    this.curvegenerator = d3.line().curve(d3.curveBasis)
    this.linegenerator = d3.line()

    this.paths = undefined
    this.handles = undefined
  }

  concatify (line) { 
    return line.replace(/M[0-9\-\.]+,[0-9\-\.]+L/, ',')
  }

  skippify (line) { 
    return line.replace(/M([0-9\-\.]+,[0-9\-\.]+L)/, "m$1,")
  }

  createSleeve(body, neck, sleeve) {
    const calcSeevePoint = function (body, neck, sleeve) {
      const sb = (body.shoulder - body.bottomHemWidth)/2
      const p1x = neck.width + (body.shoulder - neck.width)/2
      const p1y = body.shoulderDrop + sleeve.armHole
      const p2x = neck.width + (body.shoulder - neck.width)/2 - sb
      const p2y =  body.height - body.bottomRibLength
      const d = Math.sqrt (Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2))
      const nx = (p1x - p2x)/d
      const ny = (p1y - p2y)/d
      return [p1x + nx * sleeve.width, p1y + ny * sleeve.width]
    }
    const sp = calcSeevePoint(body, neck, sleeve)

    const paths = []
    const bodyAdd = (body.shoulder - body.bodyWidth)/2

    const p = neck.width + (body.bodyWidth - neck.width)/2 + bodyAdd
    let ang = 
      !sleeve.useWidth ? 
        (0 - body.shoulderDrop) / (p - neck.width)
        : (sp[0] === p) ? 
          0 : (body.shoulderDrop - sp[1]) / (sp[0] - p)
        
    let theta = -Math.atan(ang)
    theta = Math.min(1, theta)
    theta = Math.max(0, theta)

    const ncx = Math.cos(theta)
    const ncy = Math.sin(theta)
    const sx = Math.cos(theta) * (sleeve.length - sleeve.cuffRibLength)
    const sy = Math.sin(theta) * (sleeve.length - sleeve.cuffRibLength)
    const cx = Math.sin(theta) * sleeve.cuffWidth
    const cy = Math.cos(theta) * sleeve.cuffWidth

    const scx = Math.cos(theta) * sleeve.cuffRibLength 
    const scy = Math.sin(theta) * sleeve.cuffRibLength 
    const ccx = Math.sin(theta) * sleeve.cuffWidth
    const ccy = Math.cos(theta) * sleeve.cuffWidth

    const cuffRibSqueeze = sleeve.useCuffRibSqueeze ? sleeve.cuffRibSqueeze : 0

    if (!this.handles.sleeveSqueezeTop.vert) {
      this.handles.sleeveSqueezeTop.vert = [p + sx, body.shoulderDrop + sy]
    }
    if (!this.handles.sleeveSqueezeBottom.vert) {
      this.handles.sleeveSqueezeBottom.vert = [p + sx - cx, body.shoulderDrop + sy + cy]
    }
    if (!this.handles.cuffRibSqueeze.vert) {
      this.handles.cuffRibSqueeze.vert = [
          p + sx + scx/2 - ncy * cuffRibSqueeze/2, 
          body.shoulderDrop + sy + scy/2 + ncx * cuffRibSqueeze/2
      ]
    }

    {
      let path = ''
      {
        const line = [
          [p, body.shoulderDrop],
          this.handles.sleeveSqueezeTop.vert,
          [p + sx, body.shoulderDrop + sy]
        ]
        path += this.curvegenerator(line)
      }
      {
        const line = [
          [p + sx, body.shoulderDrop + sy],
          [p + sx - cx, body.shoulderDrop + sy + cy]
        ]
        path += this.concatify(this.linegenerator(line))
      }
      {
        const line = [
          [p + sx - cx, body.shoulderDrop + sy + cy],
          this.handles.sleeveSqueezeBottom.vert,
          [p - bodyAdd, body.shoulderDrop + sleeve.armHole]
        ]
        path += this.concatify(this.curvegenerator(line))
      }
      {
        const line = [
          [p - bodyAdd , body.shoulderDrop + sleeve.armHole],
          this.handles.sleeveConnection.vert,
          // [p, body.shoulderDrop]
          this.handles.sleeveShoulderPosition.vert
        ]
        path += this.concatify(this.curvegenerator(line))
      }
      paths.push(path)
    }
    //cuff
    {
      const dist = function (a, b) {
        return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
      }
      const unitVec = function (a, b) {
        const d = dist(a, b)
        return [(b[0] - a[0]) / d, (b[1] - a[1]) / d ]
      }

      const v = this.handles.cuffRibSqueeze.vert

      const a1 = [p + sx, body.shoulderDrop + sy]
      const b1 = [p + sx + scx - ncy * cuffRibSqueeze, 
        body.shoulderDrop + sy + scy + ncx * cuffRibSqueeze]
      const ph1 = v

      const ab1u = unitVec(a1, b1)
      const ap1 = [ph1[0] - a1[0], ph1[1] - a1[1]]
      const dax = ab1u[0] * ap1[0] + ab1u[1] * ap1[1]
      const x1o = [a1[0] + ab1u[0] * dax, a1[1] + ab1u[1] * dax]
      const x1 = v
      
      const a2 = [p + sx - cx, body.shoulderDrop + sy + cy]
      const b2 = [p + sx + scx - ccx + ncy * cuffRibSqueeze, 
        body.shoulderDrop + sy + scy + ccy - ncx * cuffRibSqueeze]

      const ab2u = unitVec(a2, b2)
      const dx1 = dist(v, x1o)
      const x2o= [a2[0] + ab2u[0]*dax, a2[1] + ab2u[1]*dax]
      const x2= x1o[1] > x1[1] ?
        [a2[0] + ab2u[0]*dax - ab2u[1]*dx1, a2[1] + ab2u[1]*dax + ab2u[0]*dx1]
        : [a2[0] + ab2u[0]*dax + ab2u[1]*dx1, a2[1] + ab2u[1]*dax - ab2u[0]*dx1]
      
      const p1 = [p + sx + scx - ncy * cuffRibSqueeze, 
        body.shoulderDrop + sy + scy + ncx * cuffRibSqueeze]
      const p2 = [p + sx + scx - ccx + ncy * cuffRibSqueeze, 
        body.shoulderDrop + sy + scy + ccy - ncx * cuffRibSqueeze]
      // const ph2 = [p2[0] + (v[0] - p1[0])*ncx, p2[1] - (v[1] - p1[1])*ncy]
      const ph2 = [p2[0]+ (v[0] - p1[0]) * ncy, p2[1] - (v[1] - p1[1]) * ncx]

      let path = ''
      {
        const line = [
          [p + sx, body.shoulderDrop + sy],
          x1,
          p1,
          p1,
          [p + sx + scx - ccx/2, body.shoulderDrop + sy + scy + ccy/2],
          p2,
          p2,
          x2,
          [p + sx - cx, body.shoulderDrop + sy + cy]
        ]
        path += this.curvegenerator(line)
      }
      paths.push(path)
      {
        const line = [
          [p + sx - cx, body.shoulderDrop + sy + cy],
          [p + sx, body.shoulderDrop + sy]
        ]
        path += this.concatify(this.linegenerator(line))
      }

      // for debugging
      // paths.push(path)
      // {
      //   const line = [
      //     v,
      //     x1o,
      //     x2o,
      //     x2
      //   ]
      //   path += this.linegenerator(line)
      // }
      // paths.push(path)
    }
    return paths
  }
}
