<template>
  <div class="ifg-progress-container" :style="containerStyle">
    <div class="ifg-progress" :style="barStyle" ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      doneBefore:0,
      percentDoneAtEndOfJob: 100,
      expectedTime: null,
      percent: 0,
      start: null,
      running: false,
      easing: true,
    };
  },
  props: {
    color: {
      default: '#46a'
    },
    backgroundColor: {
      default: '#eee'
    }
  },
  mounted() {
    // console.log('progress colour' , this.color);
  },
  methods: {
    startTimer(expectedTime, percentDoneAtEndOfJob, opts) {
      expectedTime = expectedTime * 1000;
      opts = Object.assign({ reset: false, easing: true }, opts || {});

      if (opts.reset) {
        this.doneBefore = 0;
        this.percentDoneAtEndOfJob = percentDoneAtEndOfJob;
        this.expectedTime = expectedTime;
        this.percent = 0;
        this.start = null;
        this.running = false;
      }
      else {
        // Adding a job.
        this.doneBefore = this.percent;
        this.start = null;
        this.expectedTime = expectedTime;
        this.percentDoneAtEndOfJob = percentDoneAtEndOfJob;
      }
      // Always default to using easing.
      this.easing = opts.easing;
      if (!this.running) {
        // Start animation.
        this.running = true;
        window.requestAnimationFrame(this.animateTimer.bind(this))
      }
    },
    cancelTimer() {
      this.start = null;
      this.running = false;
    },
    animateTimer(t) {
      if (!this.start) {
        this.start = t;
      }
      const linear = Math.min(1, (t - this.start) / this.expectedTime);
      var fraction = linear;
      if (this.easing) {
        // This is more performant than Math.pow((1-fraction), 3)
        fraction = 1 - (1-fraction) * (1-fraction) * (1-fraction);
      }
      this.percent = this.doneBefore + fraction * (this.percentDoneAtEndOfJob - this.doneBefore);

      if (this.running) {
        if (linear < 1) {
          // We still have stuff to animate.
        window.requestAnimationFrame(this.animateTimer.bind(this));
        }
      }
      else {
        this.running = false;
      }
    },
  },
  computed: {
    barStyle() {
      return {
        backgroundColor: (this.running ? this.color : 'transparent'),
        width: this.percent + '%'
      };
    },
    containerStyle() {
      return {
        backgroundColor: (this.running ? this.backgroundColor : 'transparent'),
      };
    }
  }
}
</script>
<style lang="scss">
  .ifg-progress {
    height: 2px;
    transition: 0.3s background-color;
  }
  .ifg-progress-container {
    height: 2px;
    margin-top:0.5rem;
    margin-bottom:0.5rem;
    transition: 0.3s background-color;
  }
</style>
