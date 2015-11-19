// hslider.vue
<template>
    <label><input class="hslider" type="range" min="1" max="100" v-model="sval" v-on:change="notify">&nbsp;{{ sval }}</label>
</template>

<script>
module.exports = {
  data: function() {
    return {
      sval: 1
    }
  },

  watch: {
    'sval': function(_new, _prev) {
      this.$dispatch('slider-change', _new);
    }
  },
  
  methods: {
    notify: function () {
      console.log('-->', this.sval); //!- test
    }
  }
}
</script>

<style scoped>
 .hslider {
     width: 50%;
 }

 label {
     color: gray;
     font-weight: bold;
     font-family: 'Helvetica' sans-serif;
 }
</style>
