// main.js
var Vue = require('vue');
var resizeMixin = require('vue-resize-mixin');

var _ = require('lodash');
var io = require('socket.io-client')(location.protocol + '//' + location.host);

var Ploter = require('./ploter.vue');
var Hslider = require('./hslider.vue');

var vm = new Vue({
  mixins: [resizeMixin],
  el: 'body',
  data: {
    ppoints: _.fill(_.range(100), 512),
    plabels: _.fill(_.range(100), ''),
    dims: {width:800, height:300}
  },
  components: {
    ploter: Ploter,
    vslider: Hslider
  },
  events: {
    'bang-analog': function(data){
      this.ppoints = [data];
    },
    'bang-encoder': function(data){
      this.plabels = _.fill(_.range(data), '');
    },
    resize: function(e) {
      this.dims = e;
    }
  },

  methods: {
    onSliderChange: function(e){
      io.emit('vslider', {value: e});
      // this.plabels = _.fill(_.range(e), ''); //!- test
    }
  }
  
});

io.on('bang.analog', function(msg){
  vm.$emit('bang-analog', msg.data);
});

io.on('bang.encoder', function(msg){
  vm.$emit('bang-encoder', msg.data);
});
