// ploter.vue
<template>
    <canvas width="800" height="300"></canvas>
</template>

<script>
var Chart = require('chart.js');
var _ = require('lodash');

var plotMixin = {
  ready: function (){
    this.cnvsIndex = 0;
    this.cnvs = new Chart(this.$el.getContext("2d")).Line({
      labels: this.$data.labels,
      datasets: [
        {
          label: "Analog In(0)",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: this.$data.points
        }
      ]
    }, {
      animation:false,
      scaleOverride:true,
      scaleSteps: 10,
      scaleStepWidth: 102.4,
      scaleStartValue: 0,
      responsive: true
    });
  }
}

module.exports = {
  mixins: [plotMixin],
  props: {
    points: {
      type: Array,
      default: function() {
        return _.fill(_.range(100), 0);
      }
    },
    labels: {
      type: Array,
      default: function() {
        return _.fill(_.range(100), '');
      }
    }
  },
  watch: {
    points: function(v, ov){
      for(var i=99; i > 0; i--){
          this.cnvs.datasets[0].points[i].value = this.cnvs.datasets[0].points[i-1].value;1
      }
      this.cnvs.datasets[0].points[0].value = v[0];
      this.cnvs.update();
    },
    labels: function(v, ov){
      this.cnvs.buildScale(v);
      this.cnvs.update();
    }
  }
}
</script>
