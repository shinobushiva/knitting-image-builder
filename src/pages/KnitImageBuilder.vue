<template>
  <div class="KnitImageBuildern">
    <d3></d3>
  </div>
</template>

<script>
import D3 from '@/components/D3'
export default {
  name: 'KnitImageBuilder',
  components: {D3},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
