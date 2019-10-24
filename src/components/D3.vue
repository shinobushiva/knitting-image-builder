<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.table-scroll{
    height: -webkit-fill-available;
    overflow: scroll;
}
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

#svg text {
    font-size: 8px;
}
.svg {
  border: solid black 1px;
}
.buttons {
  margin-bottom: 1em;
}

.mr {
  margin-right: 1em;
}

svg path {
	fill: none;
}

textarea {
  width: 100%;
}
textarea#body {
  height: 8em;  
}

</style>
<template lang='pug'>
.d3
  v-container(grid-list-md text-xs-center)
  v-layout(row wrap)
    v-flex.px-4(xs12 sm7)
      v-layout(row wrap)
        v-flex(xs12 sm2)
          v-text-field(
            label='キャンバス高さ' 
            v-model='canvasHeight' 
            type="number")
      v-layout(row wrap)
        v-flex.py-2(xs12 sm12)
          svg.svg(id="svg" width="100%" :height="canvasHeight")
            g#canvas
    v-flex.px-4(xs12 sm5)
      v-layout(row wrap)
        v-flex.py-2(xs12 sm6)
          p 形状
          v-btn-toggle(v-model='shape' @change='onShapeSelected')
            v-btn(flat value="rounded")
              span 丸首
            v-btn(flat value="vneck")
              span Vネック
            v-btn(flat value="highneck")
              span ハイネック
        v-flex.py-2(xs12 sm6)
          p 詳細
          v-btn-toggle(v-model='details' multiple @change='onDetailSelected')
            v-btn(flat value="sleeved")
              span 袖あり
            v-btn(flat value="opened")
              span 前開き

      v-layout(row wrap)
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='着丈'
            :value='flatBody["k.height"]' 
            type="number"
            @change='onChange("k.height", $event)'
            @keyup='onChange("k.height", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='肩巾' 
            :value='flatBody["k.shoulder"]' 
            type="number"
            @change='onChange("k.shoulder", $event)'
            @keyup='onChange("k.shoulder", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='身巾' 
            :value='flatBody["k.bodyWidth"]' 
            type="number"
            @change='onChange("k.bodyWidth", $event)'
            @keyup='onChange("k.bodyWidth", $event)')
        v-flex.py-2(xs12 sm3)
        //-
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='首巾' 
            :value='flatBody["k.neck.width"]' 
            type="number"
            @change='onChange("k.neck.width", $event)'
            @keyup='onChange("k.neck.width", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='首リブ巾' 
            :value='flatBody["k.neck.thickness"]' 
            type="number"
            @change='onChange("k.neck.thickness", $event)'
            @keyup='onChange("k.neck.thickness", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='首下がり前' 
            :value='flatBody["k.neck.frontDrop"]' 
            type="number"
            @change='onChange("k.neck.frontDrop", $event)'
            @keyup='onChange("k.neck.frontDrop", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='首下がり後' 
            :value='flatBody["k.neck.backDrop"]' 
            type="number"
            @change='onChange("k.neck.backDrop", $event)'
            @keyup='onChange("k.neck.backDrop", $event)')
        //-
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='アームホール' 
            :value='flatBody["k.sleeve.armHole"]' 
            type="number"
            @change='onChange("k.sleeve.armHole", $event)'
            @keyup='onChange("k.sleeve.armHole", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='肩下がり' 
            :value='flatBody["k.shoulderDrop"]' 
            type="number"
            @change='onChange("k.shoulderDrop", $event)'
            @keyup='onChange("k.shoulderDrop", $event)')
        v-flex.py-2(xs12 sm3)
        v-flex.py-2(xs12 sm3)
        //-
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='裾巾' 
            :value='flatBody["k.bottomHemWidth"]' 
            type="number"
            @change='onChange("k.bottomHemWidth", $event)'
            @keyup='onChange("k.bottomHemWidth", $event)')
        v-flex.py-2(xs12 sm3)
          v-text-field(
            label='裾リブ巾' 
            :value='flatBody["k.bottomRibLength"]' 
            type="number"
            @change='onChange("k.bottomRibLength", $event)'
            @keyup='onChange("k.bottomRibLength", $event)')
        v-flex.py-2(xs12 sm3)
          v-layout
            v-checkbox(hide-details
              @change='onChangeWithoutEvent("k.useBottomRibSqueeze", $event)'
              :value='flatBody["k.useBottomRibSqueeze"]'
            )
            v-text-field(
              label='裾リブ絞り'
              :disabled='!flatBody["k.useBottomRibSqueeze"]'
              :value='flatBody["k.bottomRibSqueeze"]'
              type="number"
              @change='onChange("k.bottomRibSqueeze", $event)'
              @keyup='onChange("k.bottomRibSqueeze", $event)')
        v-flex.py-2(xs12 sm3)
        //-
        v-flex.py-2(xs12 sm2)
          v-text-field(
            label='袖長さ' 
            :value='flatBody["k.sleeve.length"]' 
            type="number"
            @change='onChange("k.sleeve.length", $event)'
            @keyup='onChange("k.sleeve.length", $event)')
        v-flex.py-2(xs12 sm2)
          v-text-field(
            label='袖口巾' 
            :value='flatBody["k.sleeve.cuffWidth"]' 
            type="number"
            @change='onChange("k.sleeve.cuffWidth", $event)'
            @keyup='onChange("k.sleeve.cuffWidth", $event)')
        v-flex.py-2(xs12 sm2)
          v-text-field(
            label='袖リブ巾' 
            :value='flatBody["k.sleeve.cuffRibLength"]' 
            type="number"
            @change='onChange("k.sleeve.cuffRibLength", $event)'
            @keyup='onChange("k.sleeve.cuffRibLength", $event)')
        v-flex.py-2(xs12 sm2)
          v-layout
            v-checkbox(hide-details
              @change='onChangeWithoutEvent("k.sleeve.useCuffRibSqueeze", $event)'
              :value='flatBody["k.sleeve.useCuffRibSqueeze"]'
            )
            v-text-field(
              label='袖リブ絞り'
              :disabled='!flatBody["k.sleeve.useCuffRibSqueeze"]'
              :value='flatBody["k.sleeve.cuffRibSqueeze"]'
              type="number"
              @change='onChange("k.sleeve.cuffRibSqueeze", $event)'
              @keyup='onChange("k.sleeve.cuffRibSqueeze", $event)')
        v-flex.py-2(xs12 sm2)
          v-layout
            v-checkbox(hide-details
              @change='onChangeWithoutEvent("k.sleeve.useWidth", $event)'
              :value='flatBody["k.sleeve.useWidth"]'
            )
            v-text-field(
              label='袖巾'
              :disabled='!flatBody["k.sleeve.useWidth"]'
              :value='flatBody["k.sleeve.width"]'
              type="number"
              @change='onChange("k.sleeve.width", $event)'
              @keyup='onChange("k.sleeve.width", $event)')
      v-layout(row wrap)
        v-flex.py-2(xs12 sm12)
          p ダウンロード
          v-btn(@click='onDownloadSVG') SVG
          v-btn(@click='onDownloadPNG') PNG
    //- v-layout(row wrap)
    //-   template(v-for='(v, k, i) in flatBody')
    //-     v-flex(xs2 align-baseline)
    //-       v-text-field(
    //-         :label='k'
    //-         :value='v' 
    //-         type="number"
    //-         @change='onChange(k, $event)'
    //-         @keyup='onChange(k, $event)')
</template>

<script>
// これと接続ありか？
// https://svg-edit.github.io/svgedit/releases/latest/editor/svg-editor.html
const axios = require('axios')
import StandardCollarFactory from './lib/StandardCollarFactory'
import HighNeckFactory from './lib/HighNeckFactory'
export default {
  name: 'D3',
  components: {
  },
  data () {
    return {
      width: undefined,
      height: undefined,
      canvasHeight: 600,
      bodyJson: '',
      handles: [],
      knit: undefined,
      shape: 'rounded',
      details: ['sleeved'],
      canvasScale: 1
    }
  },
  watch: {
    bodyJson(nv) {
      if (!nv) return
      this.initD3()
      this.updateD3()
    },
    canvasHeight (nv) {
      this.initD3()
      this.updateD3()
      this.$nextTick(() =>{
        this.onRepaint()
      })
    }
  },
  computed: {
    defaultBodyJson () {
      return this.toJson({
        version: 6,
        shoulderDrop: 5,
        shoulder: 60,
        bodyWidth: 65,
        height: 52,
        bottomHemWidth: 45,
        bottomRibLength: 5,
        useBottomRibSqueeze: false,
        bottomRibSqueeze: 2,
        neck: {
          width: 16,
          frontDrop: 6,
          backDrop: 3,
          thickness: 1.5
        },
        sleeve: {
          useWidth: false,
          armHole: 21,
          length: 50,
          width: 14,
          cuffWidth: 8,
          cuffRibLength: 6,
          useCuffRibSqueeze: false,
          cuffRibSqueeze: 0
        }
      })
    },
    svg () {
      return d3.select("#svg")
    },
    flatBody () {
      const b = this.body
      const flat = {}

      const  isArray = (item) => {
        return Object.prototype.toString.call(item) === '[object Array]';
      }
      const isObject = (item) => {
        return typeof item === 'object' && item !== null && !isArray(item);
      }
      const f = (b, pref='') => {
        for (let k in b) {
          if (isObject(b[k])) {
            f(b[k], `${pref}.${k}`)
          } else {
            flat[`${pref}.${k}`] = b[k]
          }
        }
      }
      f(b, 'k')
      return flat
    },
    body () {
      return JSON.parse(this.bodyJson)
    }
  },
  created () {
    this.bodyJson = this.defaultBodyJson
  },
  mounted () {
    const json = localStorage.getItem('inprogress')
    if (json && JSON.parse(json).version >= JSON.parse(this.bodyJson).version) this.bodyJson = json
    this.onRestart()
  },
  methods: {
    onChangeWithoutEvent(key, value) {
      const keys = key.split('\.')
      const data = JSON.parse(this.bodyJson)
      let target = data
      let i = 1
      while(keys.length-1 > i) {
        target = target[keys[i]]
        i++
      }
      target[keys[i]] = value
      this.bodyJson = this.toJson(data)
      localStorage.setItem('inprogress', this.bodyJson)
    },
    onChange (key, event) {
      if (!event.target) return
      this.onChangeWithoutEvent(key, parseFloat(event.target.value))
    },
    onUpdate (target, key, event) {
      if (!event.target) return
      target[key] = parseFloat(event.target.value)
    },
    onRepaint () {
      this.svg.selectAll("*").remove()
      this.updateD3()
    },
    onRestart () {
      this.initD3()
    },
    onShapeSelected (val) {
      this.onRestart()
      this.onRepaint()
    },
    onDetailSelected (val) {
      this.onRestart()
      this.onRepaint()
    },
    initD3 () {
      this.svg.selectAll("*").remove()

      const sleeved = this.details.includes('sleeved')
      const opened = this.details.includes('opened')

      if (this.shape === 'rounded') {
        this.knit = StandardCollarFactory.create(this.body, sleeved, opened, true)
      }
      if (this.shape === 'vneck') {
        this.knit = StandardCollarFactory.create(this.body, sleeved, opened, false)
      }
      if (this.shape === 'highneck') {
        this.knit = HighNeckFactory.create(this.body, sleeved)
      }
    },
    updateD3 () {
      const self = this
      this.knit.repaint()

      const bounds = this.svg.node().getBoundingClientRect()
      this.width = bounds.width
      this.height = bounds.height
      
      const scale = {x: 10*0.4, y: 10*0.4}
      const ox = (this.width - this.body.neck.width*scale.x)/2
      const hh = this.body.height + this.body.bottomRibLength + this.body.neck.thickness - 10
      const oy = (this.height - hh*scale.y)/2
      // const scale = {x: 1, y: 1}
      
      this.knit.paths.forEach(paths => {
        paths.forEach(path => {
          const pg = this.svg.append('g')
          
          pg.append('path')
            .style('stroke', 'black' )
            .style('fill', 'white')
            .style('stroke-width', 0.1 / 0.4)
            // .style('fill-opacity', '0.5')
            .attr('d', path)
            .attr("transform", `translate(${ox}, ${oy}), scale(${scale.x}, ${scale.y})`)
            .style('display', function(d) { return  'inline' })
        })
      })
      {
        const circles = []
        for (let k in this.knit.handles) {
          if(!this.knit.handles[k].hidden)
            circles.push(this.knit.handles[k])
        }
        function drag(d) {
          const v = d.vert
          const pos = self.getMousePos({clientX: d3.event.x, clientY: d3.event.y})
          v[0] = (pos.x - ox) / scale.x
          v[1] = (pos.y - oy) / scale.y
          self.$set(d, 'vert', v)

          // const ox = (this.width - this.body.neck.width*2)/2
          
          if (d.mvert) {
            const v = d.mvert
            const pos = self.getMousePos({clientX: d3.event.x, clientY: d3.event.y})
            v[0] = (self.width - pos.x - ox) / scale.x
            v[1] = (pos.y - oy) / scale.y
            self.$set(d, 'mvert', v)
          }
          self.onRepaint()
        }
        this.svg.append('g')
          .attr("class", 'markers')
          .selectAll("circle")
          .data(circles)
          .enter()
          .append("circle")
          .attr("cx", function(d) { return d.vert? d.vert[0] : 0})
          .attr("cy", function(d) { return d.vert? d.vert[1] : 0})
          .attr("r", 2)
          .attr("transform", `translate(${ox}, ${oy}), scale(${scale.x}, ${scale.y})`)
          .style("fill", function(d, i) { return 'orange' })
          .style("fill-opacity", 0.5)
          .call(d3.drag()
            .on("start", (d) => {})
            .on("drag", drag)
            .on("end", (d) => {})
          )
      }
    },
    offset(x, y, ar) {
      return ar.map(v=>{return [v[0]+x, v[1]+y]})
    },
    getMousePos(evt) {
      const rect = this.svg.nodes()[0].getBoundingClientRect()
      return {
        x: evt.clientX - rect.x,
        y: evt.clientY - rect.y
      }
    },
    toJson (obj) {
      return JSON.stringify(obj, null , "  ")
    },
    onDownloadSVG () {
      const self = this
      const doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
      const prefix = {
          xmlns: "http://www.w3.org/2000/xmlns/",
          xlink: "http://www.w3.org/1999/xlink",
          svg: "http://www.w3.org/2000/svg"
      }
      this.svg.select(".markers").remove()
      const svg = this.svg
        .attr("xmlns", prefix.svg)
        .attr("version", "1.1")  
        .node()
      
      const blobObject = new Blob([doctype +  (new XMLSerializer()).serializeToString(svg)], { "type" : "text\/xml" })   
      
      if (navigator.appVersion.toString().indexOf('.NET') > 0){ //IE hack
          window.navigator.msSaveBlob(blobObject, filename)
  
      }else {
        const url = window.URL.createObjectURL(blobObject)                
        const a = d3.select("body").append("a")
        
        a.attr("class", "downloadLink")
          .attr("download", "image.svg")
          .attr("href", url)
          .text("test")
          .style("display", "none")
        a.node().click()

        setTimeout(function() {
          window.URL.revokeObjectURL(url)
          a.remove()
          this.updateD3()
        }, 10)            
      }
      self.updateD3()
    },
    onDownloadPNG (){
      const self = this
      const bounds = this.svg.node().getBoundingClientRect()
      const width = bounds.width
      const height = bounds.height
      const mag = 1
      const canvas = d3.select("body").append("canvas")
        .attr("width", width * mag)
        .attr("height", height * mag)
        .node()
      const ctx = canvas.getContext("2d")

      this.svg.select(".markers").remove()
      const svg = this.svg
        .attr("viewBox", "0 0 " + width + " " + height)
        .node()

      const data = new XMLSerializer().serializeToString(svg)
      const imgsrc = "data:image/svg+xml;charset=utf-8;base64,"
                            + btoa(unescape(encodeURIComponent(data)))
      const image = new Image()
      image.onload = function () {
        ctx.drawImage(this, 0, 0, width, height, 0, 0, width*mag, height*mag)
        // ctx.drawImage(image, 0, 0)
        const url = canvas.toDataURL("image/png") 
        const a = d3.select("body").append("a")
        a.attr("class", "downloadLink")
          .attr("download", "image.png")
          .attr("href", url)
          .text("test")
          .style("display", "none")
        a.node().click()

        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          a.remove()
          canvas.remove()
          self.updateD3()
        }, 10)        
      }
      image.src = imgsrc
    }
  }
}
</script>
