<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface HeaderMenuSlideProps {
  image: string;
}
const props = withDefaults(defineProps<HeaderMenuSlideProps>(), {});

const backgroundImage = new URL(
  `../../assets/img/demo/${props.image}`,
  import.meta.url
).href;

const header = ref<HTMLElement>();
const headerSlide = ref<HTMLDivElement>();

let defaultHeaderPosition = 0;

const handleScroll = () => {
  calculateHeaderTopPosition();

  if (header.value && headerSlide.value) {
    if (window.pageYOffset > defaultHeaderPosition) {
      header.value.classList.add('sticky');
    } else {
      header.value.classList.remove('sticky');
    }
  }
};

const calculateHeaderTopPosition = () => {
  if (headerSlide.value && header.value) {
    defaultHeaderPosition =
      headerSlide.value.getBoundingClientRect().height -
      header.value.getBoundingClientRect().height;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { capture: false });
  window.addEventListener('resize', calculateHeaderTopPosition, {
    capture: false
  });

  calculateHeaderTopPosition();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll, { capture: false });
  window.removeEventListener('resize', calculateHeaderTopPosition, {
    capture: false
  });
});
</script>
<template>
  <div
    ref="headerSlide"
    class="slide slide-header-menu"
    :style="{
      'background-image': 'url(' + backgroundImage + ')'
    }"
  >
    <header ref="header" class="header"></header>
  </div>
</template>
<style lang="scss" scoped>
.slide {
  @include base-slide;
  &-header-menu {
    background-position: center;
    background-size: cover;
    height: 400px;
    @include respond-to('small') {
      height: 100vh;
    }
  }
}
</style>
<style lang="scss">
.header {
  transform: translate3d(0, 0, 0);
  isolation: isolate;
  will-change: position, top;
  background-color: white;
  position: absolute;
  top: calc(100% - 90px);
  left: 0;
  width: 100%;
  height: 90px;
  z-index: 50;
  &.sticky {
    position: fixed;
    top: 0;
  }
}
</style>
