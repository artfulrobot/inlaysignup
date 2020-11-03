<template>
  <div class="treeometer">
    {{ count }} {{stmt}}
    🌲🌲🌲🌲🌲🌲🌲🌲
  </div>
</template>
<script>
export default {
  props: ['count', 'stmt', 'target'],
  data() {
    return {};
  }
}
</script>
