<template>
  <div class="treeometer">
    <div class="treeometer__trees" style="width: 20rem">{{trees}}</div>
    <span class="treeometer__bignum">{{ count.toLocaleString() }}</span>
    <span class="treeometer__words">{{stmt}}</span>
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
    };
  },
  computed:{
    trees() {
      return '🌲'.repeat(parseInt(this.step * 10));
    }
  },
  mounted() {
    window.requestAnimationFrame(this.animate.bind(this));
  },
  methods:{
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
  display: flex;
  flex-wrap:wrap;
  max-width: 20rem;
  align-items: center;

  .treeometer__trees {
    flex: 1 0 20rem;
  }
  .treeometer__bignum {
    flex: 0 0 auto;
    padding-right: 1rem;
    font-size:3rem;
    font-weight: bold;
  }
  .treeometer__words {
    flex: 1 1 auto;
    font-size: 1.2rem;
  }
}
</style>
