<script setup lang="ts">
import { Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/mousewheel';

const transitionBegin = (swiper: any) => {
  swiper.params.touchReleaseOnEdges = false;
  (swiper.params.mousewheel as any).releaseOnEdges = false;
};

const transitionEnd = (swiper: any) => {
  swiper.params.touchReleaseOnEdges = true;
  if (swiper.isBeginning || swiper.isEnd) {
    (swiper.params.mousewheel as any).releaseOnEdges = true;
  }
};
</script>
<template>
  <div class="slide slide-swiper">
    <swiper
      :slides-per-view="1"
      :modules="[Mousewheel]"
      :direction="'vertical'"
      :speed="1350"
      :mousewheel="{
        releaseOnEdges: false
      }"
      :touch-release-on-edges="true"
      @transition-start="transitionBegin"
      @slide-change-transition-end="transitionEnd"
    >
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.slide {
  @include base-slide;
  &-swiper {
    height: 400px;
    background-color: red;
    @include respond-to('small') {
      height: 100vh;
    }
  }

  .swiper {
    height: 100%;
  }
  .swiper-slide {
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: white;
    height: 100%;
    &:nth-child(odd) {
      background-color: purple;
    }
  }
}
</style>
