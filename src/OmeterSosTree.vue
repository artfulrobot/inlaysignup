<template>
  <div class="treeometer">
    <span class="treeometer__bignum">{{ count.toLocaleString() }}</span>
    <span class="treeometer__words">{{stmt}}</span>

    <div class="treeometer__trees" ref="treesContainer">
      <span v-for="(c, i) in trees"
            :key="i"
            :class="c"
            >🌲</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['count', 'stmt', 'target'],
  data() {
    return {
      treeAnim: 0,
      animStart: false,
      step: 0,

      containerSize:false,
      debounce: false,
    };
  },
  computed:{
    trees() {
      var max = this.containerSize;
      var greenTo = parseInt(this.step * max * 0.7);
      const t = [];
      for (var i=0; i<max; i++) {
        t.push(i > greenTo ? 'faded' : '');
      }
      return t;
    },
  },
  mounted() {
    this.handleWindowResize();
    window.addEventListener('resize', e => {
      if (this.debounce) {
        window.clearTimeout(this.debounce);
      }
      this.debounce = window.setTimeout(this.handleWindowResize.bind(this), 300);
    });

    var observer = new IntersectionObserver(this.handleIntersectionChange.bind(this), {
      // root: this.$refs.treesContainer,
      // rootMargin: '0px',
      threshold: 1.0
    });
    observer.observe(this.$refs.treesContainer);
  },
  methods:{
    handleIntersectionChange(entries, observer) {
      console.log("handleIntersectionChange");
      entries.forEach(e => {
        if (e.isIntersecting) {
          this.animStart = false;
          window.requestAnimationFrame(this.animate.bind(this));
        }
      });
    },
    handleWindowResize(e) {
      this.debounce = false;
      // Allow 1.5rem for a tree
      this.containerSize = Math.floor(this.$refs.treesContainer.clientWidth / this.convertRemToPixels(1.5));
    },
    convertRemToPixels(rem) {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    },
    animate(t) {
      if (!this.animStart) {
        this.animStart = t;
      }
      // Allow 1 s for the animation.
      this.step = Math.min(1, (t - this.animStart) / 1000);
      if (this.step < 1) {
        window.requestAnimationFrame(this.animate.bind(this));
      }
    }
  }
}
</script>
<style lang="scss">
.treeometer {
  $darkGreen: #366351;
  $yellow: #ffc839;
  $orange: #f67f00;

  display: flex;
  flex-wrap:wrap;
  align-items: center;
  justify-content: center;
  background: $yellow;
  padding: 1rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: bold;

  .treeometer__trees {
    flex: 0 0 100%;
    display: flex;
    justify-content: space-between;

    .faded {
      opacity: 0.2;
    }
  }

  .treeometer__bignum {
    flex: 0 0 auto;
    padding-right: 1rem;
    font-size:3rem;
  }
  .treeometer__words {
    flex: 0 1 auto;
    font-size: 2rem;
  }
}
</style>
