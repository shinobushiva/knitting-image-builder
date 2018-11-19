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

    const p = neck.width + (body.shoulder - neck.width)/2 + bodyAdd
    let ang = 
      !sleeve.useWidth ? 
        (0 - body.shoulderDrop) / (p - neck.width)
        : (sp[0] === p) ? 
          0 : (body.shoulderDrop - sp[1]) / (sp[0] - p)
        
    let theta = -Math.atan(ang)
    theta = Math.min(1, theta)
    theta = Math.max(0, theta)
    

    const sx = Math.cos(theta) * (sleeve.length - sleeve.cuffRibLength)
    const sy = Math.sin(theta) * (sleeve.length - sleeve.cuffRibLength)
    const cx = Math.sin(theta) * sleeve.cuffWidth
    const cy = Math.cos(theta) * sleeve.cuffWidth

    const scx = Math.cos(theta) * sleeve.cuffRibLength 
    const scy = Math.sin(theta) * sleeve.cuffRibLength 
    const ccx = Math.sin(theta) * sleeve.cuffWidth
    const ccy = Math.cos(theta) * sleeve.cuffWidth

    if (!this.handles.sleeveSqueezeTop.vert) {
      this.handles.sleeveSqueezeTop.vert = [p + sx, body.shoulderDrop + sy]
    }
    if (!this.handles.sleeveSqueezeBottom.vert) {
      this.handles.sleeveSqueezeBottom.vert = [p + sx - cx, body.shoulderDrop + sy + cy]
    }
    if (!this.handles.sleeveLibSqueeze.vert) {
      this.handles.sleeveLibSqueeze.vert = [p + sx + scx, body.shoulderDrop + sy + scy]
    }

    {
      let path = ''
      // if(sleeve.useWidth){
      //   {
      //     const line = [
      //       [p, body.shoulderDrop],
      //       sp
      //     ]
      //     path += this.linegenerator(line)
      //   }
      //   {
      //     const line = [
      //       sp,
      //       this.handles.sleeveSqueezeTop.vert,
      //       [p + sx, body.shoulderDrop + sy]
      //     ]
      //     path += this.curvegenerator(line)
      //   }
      // } else 
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
          [p, body.shoulderDrop]
        ]
        path += this.concatify(this.curvegenerator(line))
      }
      paths.push(path)
    }
    const dist = Math.sqrt( 
      Math.pow(this.handles.sleeveLibSqueeze.vert.x - p + sx + scx, 2),
      Math.pow(this.handles.sleeveLibSqueeze.vert.y - body.shoulderDrop + sy + scy)
    )
    //cuff
    {
      const v = this.handles.sleeveLibSqueeze.vert
      let d = Math.sqrt(
        Math.pow(v[1] - (body.shoulderDrop + sy + scy), 2)
      )
      d *= (v[1] > (body.shoulderDrop + sy + scy)) ? 1 : -1
      const vd = Math.sqrt(ccx*ccx + ccy*ccy)

      const p1 = [p + sx + scx - ccx/vd * d, body.shoulderDrop + sy + scy + ccy/vd * d]
      const p2 = [p + sx + scx - ccx + ccx/vd * d, 
          body.shoulderDrop + sy + scy + ccy - ccy/vd * d]

      let path = ''
      {
        const line = [
          [p + sx, body.shoulderDrop + sy],
          [p + sx + scx/2, body.shoulderDrop + sy + scy/2],
          p1,
          p1,
          [p + sx + scx - ccx/2, body.shoulderDrop + sy + scy + ccy/2],
          p2,
          p2,
          [p + sx - cx+ scx/2, body.shoulderDrop + sy + cy+ scy/2],
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
        path += this.linegenerator(line)
      }
      paths.push(path)

      // for debugging
      // paths.push(path)
      // {
      //   const line = [
      //     [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole],
      //     sp
      //   ]
      //   path += this.linegenerator(line)
      // }
      // paths.push(path)
    }
    return paths
  }
}
