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

  calculateIntersectionForRaglan(body, collarRounded) {

    // calculate intersection for raglan soulder

    // right
    {
      let path
      if (!collarRounded) {
        const line = [
          [body.neck.width, 0],
          [body.neck.width/2+body.bodyCenter, body.neck.frontDrop]
        ]
        path = this.linegenerator(line)
      } else {
        const line = [
          [body.neck.width, 0],
          [this.handles.frontCollerTop.vert[0] + body.neck.thickness/2, this.handles.frontCollerTop.vert[1] + body.neck.thickness],
          [this.handles.frontColler.vert[0] + body.neck.thickness/2, this.handles.frontColler.vert[1] + body.neck.thickness],
          [body.neck.width/2+body.bodyCenter, body.neck.frontDrop]
        ]
        path = this.curvegenerator(line)
      }

      const targetPath = d3.create('svg')
        .append('path')
        .style('stroke', 'black' )
        // .style('fill', 'white')
        .style('stroke-width', 0.1 / 0.4)
        .attr('d', path)
      const targetLine = {
        x1: this.handles.sleeveConnection.vert[0],
        y1: this.handles.sleeveConnection.vert[1],
        x2: this.handles.sleeveShoulderPosition.vert[0],
        y2: this.handles.sleeveShoulderPosition.vert[1]
      }
      const points = Knitter.pathLineIntersections(targetPath.node(), targetLine, 50)
      if(points.length > 0) {
        points.sort((x, y) => {
          const distance = (a, b) => {
            return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
          }
          return distance(x, this.handles.sleeveShoulderPosition.vert) < distance(y, this.handles.sleeveShoulderPosition.vert) ? 1 : -1
        })
        let xd = (points[0].x - this.handles.sleeveShoulderPosition.vert[0])
        let yd = (points[0].y - this.handles.sleeveShoulderPosition.vert[1])
        const d = Math.sqrt(xd*xd + yd*yd)
        xd = xd / d
        yd = yd / d
        this.handles.sleeveShoulderPosition.vert = [points[0].x + xd * 0.1 / 0.4, points[0].y + yd * 0.1 / 0.4]
        this.handles.sleeveShoulderPosition.ranlaned = true
      } else {
        this.handles.sleeveShoulderPosition.ranlaned = false
      }
    }

    //left
    {
      let path
      if (!collarRounded) {
        const line = [
          [0, 0],
          [body.neck.width/2+body.bodyCenter, body.neck.frontDrop]
        ]
        path = this.linegenerator(line)
      } else {
        const line = [
          [0, 0],
          [this.handles.frontCollerTop.mvert[0] - body.neck.thickness/2, this.handles.frontCollerTop.mvert[1] + body.neck.thickness],
          [this.handles.frontColler.mvert[0] - body.neck.thickness/2, this.handles.frontColler.mvert[1] + body.neck.thickness],
          [body.neck.width/2+body.bodyCenter, body.neck.frontDrop]
        ]
        path = this.curvegenerator(line)
      }

      const targetPath = d3.create('svg')
        .append('path')
        .style('stroke', 'black' )
        // .style('fill', 'white')
        .style('stroke-width', 0.1 / 0.4)
        .attr('d', path)
      const targetLine = {
        x1: this.handles.sleeveConnection.mvert[0],
        y1: this.handles.sleeveConnection.mvert[1],
        x2: this.handles.sleeveShoulderPosition.mvert[0],
        y2: this.handles.sleeveShoulderPosition.mvert[1]
      }
      const points = Knitter.pathLineIntersections(targetPath.node(), targetLine, 50)
      if(points.length > 0) {
        points.sort((x, y) => {
          const distance = (a, b) => {
            return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
          }
          return distance(x, this.handles.sleeveShoulderPosition.mvert) < distance(y, this.handles.sleeveShoulderPosition.mvert) ? 1 : -1
        })
        let xd = (points[0].x - this.handles.sleeveShoulderPosition.mvert[0])
        let yd = (points[0].y - this.handles.sleeveShoulderPosition.mvert[1])
        const d = Math.sqrt(xd*xd + yd*yd)
        xd = xd / d
        yd = yd / d
        this.handles.sleeveShoulderPosition.mvert = [points[0].x + xd * 0.1 / 0.4, points[0].y + yd * 0.1 / 0.4]
      }
    }
  }

  createSleeve(body, neck, sleeve, collarRounded) {
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

    this.calculateIntersectionForRaglan(body, collarRounded)

    {
      let path = ''
      {
        const line = [
          [neck.width, 0],
          [p, body.shoulderDrop],
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
          this.handles.sleeveShoulderPosition.vert
        ]
        path += this.concatify(this.curvegenerator(line))
      }
      paths.push(path)
    }
    //cuff
    if (sleeve.cuffRibLength > 0){
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
      {
        const line = [
          [p + sx - cx, body.shoulderDrop + sy + cy],
          [p + sx, body.shoulderDrop + sy]
        ]
        path += this.concatify(this.linegenerator(line))
      }
      paths.push(path)
    }
    return paths
  }

  static btwn(a, b1, b2) {
    if ((a >= b1) && (a <= b2)) { return true; }
    if ((a >= b2) && (a <= b1)) { return true; }
    return false;
  }

  static line_line_intersect(line1, line2) {
    var x1 = line1.x1, x2 = line1.x2, x3 = line2.x1, x4 = line2.x2
    var y1 = line1.y1, y2 = line1.y2, y3 = line2.y1, y4 = line2.y2
    var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    var pt_x_num = (x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4)
    var pt_y_num = (x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4)
    if (pt_denom == 0) { return false }
    else { 
      var pt = {'x': pt_x_num / pt_denom, 'y': pt_y_num / pt_denom}
      if (Knitter.btwn(pt.x, x1, x2) 
        && Knitter.btwn(pt.y, y1, y2) 
        && Knitter.btwn(pt.x, x3, x4) 
        && Knitter.btwn(pt.y, y3, y4)) { 
        return pt 
      }
      else { return false }
    }
  }

  static  pathLineIntersections(pathEl, {x1,x2,y1,y2}, n_segments = 100) {
    const pathLength = pathEl.getTotalLength()
    const pts = []
    for (let i=0; i<n_segments; i++) {
      const pos1 = pathEl.getPointAtLength(pathLength * i / n_segments)
      const pos2 = pathEl.getPointAtLength(pathLength * (i+1) / n_segments)
      const line1 = {
        x1: pos1.x,
        x2: pos2.x,
        y1: pos1.y,
        y2: pos2.y
      }
      const line2 = {
        x1: x1,
        x2: x2, 
        y1: y1,
        y2: y2
      }
      const pt = Knitter.line_line_intersect(line1, line2)
      if (pt) {
        pts.push(pt)
      }
    }
    
    return pts
  }
}
