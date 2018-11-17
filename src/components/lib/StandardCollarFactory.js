import Knitter from './Knitter'
export default class StandardCollarFactory {

  static setup (knit) {

    knit.handles = {
      bodySqueeze: {
        vert: undefined,
        mvert: undefined
      },
      sleeveConnection: {
        vert: undefined,
        mvert: undefined
      },
      sleeveSqueezeTop: {
        vert: undefined
      },
      sleeveSqueezeBottom: {
        vert: undefined
      },
      frontColler: {
        vert: undefined,
        mvert: undefined
      },
      backColler: {
        vert: undefined,
        mvert: undefined
      },
      bodyLibSqueeze: {
        vert: undefined,
        mvert: undefined
      },
      sleeveLibSqueeze: {
        vert: undefined,
        mvert: undefined
      }
    }

    knit.createBody = function(body, neck, sleeve) {

      const bodyAdd = (body.shoulder - body.bodyWidth)/2
      
      const sb = (body.shoulder - body.bottomHemWidth)/2
      const drop = Math.min(neck.frontDrop, neck.backDrop)
      const paths = []

      const handle = (neck.frontDrop < neck.backDrop) ? this.handles.frontColler : this.handles.backColler
      
      const thickness = neck.thickness

      if (!this.handles.sleeveConnection.vert) {
        this.handles.sleeveConnection.vert = [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole/2]
        this.handles.sleeveConnection.mvert = [- (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole/2]
      }
      if (!this.handles.bodySqueeze.vert) {
        this.handles.bodySqueeze.vert = [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength]
        this.handles.bodySqueeze.mvert = [-(body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole]
      }
      if (!this.handles.bodyLibSqueeze.vert) {
        this.handles.bodyLibSqueeze.vert = [neck.width + (body.shoulder - neck.width)/2 - sb, body.height],
        this.handles.bodyLibSqueeze.mvert = [-(body.shoulder - neck.width)/2 + sb, body.height]
      }
      //around coller and arm
      {
        let path = ''
        {
          const line = [
            [0, 0],
            [handle.mvert[0] - thickness/2, handle.mvert[1] + thickness],
            [neck.width/2, drop]
          ]
          path += this.curvegenerator(line)
        }
        {
          const line = [
            [neck.width/2, drop],
            [handle.vert[0] + thickness/2, handle.vert[1] + thickness],
            [neck.width, 0]
          ]
          path += this.curvegenerator(line)
        }
        {
          const line = [
            [neck.width, 0],
            [neck.width + (body.shoulder - neck.width)/2 + bodyAdd, body.shoulderDrop],
            [neck.width + (body.shoulder - neck.width)/2 + bodyAdd, body.shoulderDrop],
            [neck.width + (body.shoulder - neck.width)/2 + bodyAdd, body.shoulderDrop],
            this.handles.sleeveConnection.vert,
            [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        {
          const line = [
            [neck.width + (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole],
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
            [-(body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        {
          const line = [
            [- (body.shoulder - neck.width)/2, body.shoulderDrop + sleeve.armHole],
            this.handles.sleeveConnection.mvert,
            [- (body.shoulder - neck.width)/2 - bodyAdd, body.shoulderDrop],
            [- (body.shoulder - neck.width)/2 - bodyAdd, body.shoulderDrop],
            [- (body.shoulder - neck.width)/2 - bodyAdd, body.shoulderDrop],
            [0, 0]
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
            [neck.width + (body.shoulder - neck.width)/2 - sb, body.height - body.bottomRibLength/2],
            [this.handles.bodyLibSqueeze.vert[0], body.height],
            [this.handles.bodyLibSqueeze.vert[0], body.height],
            [neck.width/2, body.height],
            [this.handles.bodyLibSqueeze.mvert[0], body.height],
            [this.handles.bodyLibSqueeze.mvert[0], body.height],
            [-(body.shoulder - neck.width)/2 + sb, body.height - body.bottomRibLength/2],
            [-(body.shoulder - neck.width)/2 + sb, body.height - body.bottomRibLength]
          ]
          path += this.concatify(this.curvegenerator(line))
        }
        paths.push(path)
      }
      return paths
    }

    knit.createCollar = function(width, drop, thickness, handle={}, height, opened=false, rounded=true) {

      const hw = width/2
      
      if (handle && !handle.vert) {
        handle.vert = [hw + hw/2, drop - thickness],
        handle.mvert = [hw/2, drop - thickness]
      }
      let paths = ''
      {
        const line = [
          [thickness, -thickness/2],
          handle.mvert,
          [hw, drop - thickness]
        ]
        if (!rounded) {
          line.splice(1, 1)
          paths += this.linegenerator(line)
        } else {
          paths += this.curvegenerator(line)
        }
      }
      {
        const line = [
          [hw, drop - thickness],
          handle.vert,
          [width - thickness, -thickness/2]
        ]
        if (!rounded) {
          line.splice(1, 1)
          paths += this.concatify(this.linegenerator(line))
        } else {
          paths += this.concatify(this.curvegenerator(line))
        }
      }
      {
        const line = [
          [width - thickness, -thickness/2],
          [width, 0]
        ]
        paths += this.concatify(this.linegenerator(line))
      }
      if (!opened) {
        const line = [
          [width, 0],
          [handle.vert[0] + thickness/2, handle.vert[1] + thickness],
          [hw, drop]
        ]
        if (!rounded) {
          line.splice(1, 1)
          paths += this.concatify(this.linegenerator(line))
        } else {
          paths += this.concatify(this.curvegenerator(line))
        }
      } else {
        {
          const line = [
            [width, 0],
            [handle.vert[0] + thickness/2, handle.vert[1] + thickness],
            [hw + thickness/2, drop]
          ]
          if (!rounded) {
            line.splice(1, 1)
            paths += this.concatify(this.linegenerator(line))
          } else {
            paths += this.concatify(this.curvegenerator(line))
          }
        }
        {
          const line = [
            [hw + thickness/2, drop],
            [hw + thickness/2, height],
            [hw - thickness/2, height],
            [hw - thickness/2, drop]
          ]
          paths += this.concatify(this.linegenerator(line))
        }
      }
      if (!drop) {
        const line = [
          [hw, drop],
          [handle.mvert[0] - thickness/2, handle.mvert[1] + thickness],
          [0, 0]
        ]
        if (!rounded) {
          line.splice(1, 1)
          paths += this.concatify(this.linegenerator(line))
        } else {
          paths += this.concatify(this.curvegenerator(line))
        }
      } else {
        const line = [
          [hw, drop],
          [handle.mvert[0] - thickness/2, handle.mvert[1] + thickness],
          [0, 0]
        ]
        if (!rounded) {
          line.splice(1, 1)
          paths += this.concatify(this.linegenerator(line))
        } else {
          paths += this.concatify(this.curvegenerator(line))
        }
      }
      {
        const line = [
          [0, 0],
          [thickness, -thickness/2]
        ]
        paths += this.concatify(this.linegenerator(line))
      }
      if (opened) {
        const line = [
          [hw, drop - thickness],
          [hw + thickness/2, drop]
        ]
        paths += this.linegenerator(line)
      }
      return [paths]
    }

    knit.createOpening = function(body, neck, sleeve) {
      const hw = neck.width/2
   
      let paths = ''
      {
        const line = [
          // handle.mvert,
          [hw - neck.thickness/2, neck.frontDrop],
          [hw - neck.thickness/2, body.height],
          [hw + neck.thickness/2, body.height],
          [hw + neck.thickness/2, neck.frontDrop]
        ]
        paths += this.linegenerator(line)
      }
      return [paths]
  
    }
  }
  static create (body, sleeve=true, opened=false, rounded=true) {
    const knit = new Knitter()
    StandardCollarFactory.setup(knit)

    if (!sleeve) {
      delete knit.handles.sleeveSqueezeTop
      delete knit.handles.sleeveSqueezeBottom
      delete knit.handles.sleeveSqueezeLib
    }

    if (!rounded) {
      delete knit.handles.frontColler
    }

    knit.repaint = (() => {
      const pss = []

      const cb = knit.createCollar(body.neck.width, body.neck.backDrop, body.neck.thickness, knit.handles.backColler, body.height, false, true)
      const cf = knit.createCollar(body.neck.width, body.neck.frontDrop, body.neck.thickness, knit.handles.frontColler, body.height, opened, rounded)
      pss.push(cb)
      pss.push(knit.createBody(body, body.neck, body.sleeve))
      pss.push(cf)
      if (sleeve) pss.push(knit.createSleeve(body, body.neck, body.sleeve))
  
      knit.paths = pss
    })
    knit.repaint()
    
    return knit
  }
}
