import Knitter from './Knitter'
export default class HighNeckFactory {
  static setup (knit) {
    knit.handles = {
      bodySqueeze: {
        vert: undefined,
        mvert: undefined,
        hidden: false
      },
      sleeveConnection: {
        vert: undefined,
        mvert: undefined,
        hidden: false
      },
      sleeveSqueezeTop: {
        vert: undefined,
        hidden: false
      },
      sleeveSqueezeBottom: {
        vert: undefined,
        hidden: false
      },
      frontColler: {
        vert: undefined,
        mvert: undefined,
        hidden: false
      },
      bodyRibSqueeze: {
        vert: undefined,
        mvert: undefined,
        hidden: false
      },
      cuffRibSqueeze: {
        vert: undefined,
        hidden: false
      }
    }

    knit.createHighNeckBody = function(body, neck, sleeve) {
    
      const sb = (body.shoulder - body.bottomHemWidth)/2
      const drop = neck.frontDrop
      const paths = []

      const bottomRibSqueeze = body.useBottomRibSqueeze ? body.bottomRibSqueeze : 0

      if (!this.handles.sleeveConnection.vert) {
        this.handles.sleeveConnection.vert = [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole/2]
        this.handles.sleeveConnection.mvert = [- (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole/2]
      }
      if (!this.handles.bodySqueeze.vert) {
        this.handles.bodySqueeze.vert = [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength]
        this.handles.bodySqueeze.mvert = [-(body.bodyWidth - neck.width)/2, body.shoulderDrop + sleeve.armHole]
      }
      if (!this.handles.bodyRibSqueeze.vert) {
        this.handles.bodyRibSqueeze.vert = [neck.width + (body.shoulder - neck.width)/2 - sb - bottomRibSqueeze/2, body.height - body.bottomRibLength/2]
        this.handles.bodyRibSqueeze.mvert = [-(body.shoulder - neck.width)/2 + sb + bottomRibSqueeze/2, body.height - body.bottomRibLength/2]
      }

      if (body.bottomRibLength === 0) {
        this.handles.bodyRibSqueeze.hidden = true
      }
      
      //around coller and arm
      {
        let path = ''
        {
          const line = [
            [0, 0],
            this.handles.frontColler.mvert,
            [neck.width/2, drop]
          ]
          path += this.curvegenerator(line)
        }
        {
          const line = [
            [neck.width/2, drop],
            this.handles.frontColler.vert,
            [neck.width, 0]
          ]
          path += this.curvegenerator(line)
        }
        {
          const line = [
            [neck.width, 0],
            [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop],
            [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop],
            [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop],
            this.handles.sleeveConnection.vert,
            [neck.width + (body.bodyWidth - neck.width)/2, body.shoulderDrop + sleeve.armHole]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        {
          const line = [
            [neck.width + (body.bodyWidth - neck.width)/2, body.shoulderDrop + sleeve.armHole],
            this.handles.bodySqueeze.vert,
            [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        {
          const line = [
            [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength],
            [-(body.shoulder - neck.width)/2 + sb, body.height - body.bottomRibLength]
          ]
          path += this.concatify(this.linegenerator(line))
        }
        {
          const line = [
            [-(body.shoulder - neck.width)/2 + sb, body.height - body.bottomRibLength],
            this.handles.bodySqueeze.mvert,
            [-(body.bodyWidth - neck.width)/2, body.shoulderDrop + sleeve.armHole]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        {
          const line = [
            [- (body.bodyWidth - neck.width)/2, body.shoulderDrop + sleeve.armHole],
            this.handles.sleeveConnection.mvert,
            [- (body.shoulder - neck.width)/2, body.shoulderDrop],
            [- (body.shoulder - neck.width)/2, body.shoulderDrop],
            [- (body.shoulder - neck.width)/2, body.shoulderDrop],
            [0, 0],
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        paths.push(path)
      }
      //
      {
        let path = ''
        {
          const line = [
            [-(body.shoulder - neck.width)/2 + sb, body.height - body.bottomRibLength],
            [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength],
          ]
          path += this.linegenerator(line)
        }
        {
          const line = [
            [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength],
            this.handles.bodyRibSqueeze.vert,
            [neck.width + (body.shoulder - neck.width)/2 - bottomRibSqueeze - sb, body.height],
            [neck.width + (body.shoulder - neck.width)/2 - bottomRibSqueeze - sb, body.height],
            [neck.width/2, body.height],
            [-(body.shoulder - neck.width)/2 + bottomRibSqueeze + sb, body.height],
            [-(body.shoulder - neck.width)/2 + bottomRibSqueeze + sb, body.height],
            this.handles.bodyRibSqueeze.mvert,
            [-(body.shoulder - neck.width)/2 + sb, body.height - body.bottomRibLength]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        paths.push(path)
      }
      return paths
    }

    knit.createHighNeckCollar = function(width, drop, thickness, handle={}) {
    
      const hw = width/2
      
      if (handle && !handle.vert) {
        handle.vert = [hw + hw/2, drop],
        handle.mvert = [hw/2, drop]
      }
      let paths = ''
      {
        const line = [
          [-thickness/10, -thickness],
          [-thickness/10 + handle.mvert[0], -thickness + handle.mvert[1]/2],
          
          [handle.vert[0], -thickness + handle.vert[1]/2],
          [width + thickness /10, -thickness]
        ]
        paths += this.curvegenerator(line)
      }
      {
        const line = [
          [width + thickness /10, -thickness],
          [width, 0]
        ]
        paths += this.concatify(this.linegenerator(line))
      }
      {
        const line = [
          [width, 0],
          [handle.vert[0], handle.vert[1]],
          [hw, drop]
        ]
        paths += this.concatify(this.curvegenerator(line))
      }
      {
        const line = [
          [hw, drop],
          [handle.mvert[0], handle.mvert[1]],
          [0, 0]
        ]
        paths += this.concatify(this.curvegenerator(line))
      }
      {
        const line = [
          [0, 0],
          [-thickness /10, -thickness],
        ]
        paths += this.concatify(this.linegenerator(line))
      }
      {
        const line = [
          [-thickness/10, -thickness],
          [-thickness/10 + handle.mvert[0], -thickness - handle.mvert[1]/2],
          [thickness/10 + handle.vert[0], -thickness - handle.vert[1]/2],
          [width + thickness/10, -thickness]
        ]
        paths += this.curvegenerator(line)
      }
      return [paths]
    }
  }

  static create (body, sleeve=true) {
    const knit = new Knitter()
    HighNeckFactory.setup(knit)
    
    if (!sleeve) {
      knit.handles.sleeveSqueezeTop = undefined
      knit.handles.sleeveSqueezeBottom = undefined
    }

    knit.repaint = (() => {
      const pss = []

      const cb = knit.createHighNeckCollar(body.neck.width, body.neck.frontDrop, body.neck.thickness, knit.handles.frontColler)
      pss.push(cb)
      pss.push(knit.createHighNeckBody(body, body.neck, body.sleeve))
      if (sleeve) pss.push(knit.createSleeve(body, body.neck, body.sleeve))
  
      knit.paths = pss
    })
    knit.repaint()
    
    return knit
  }
}
