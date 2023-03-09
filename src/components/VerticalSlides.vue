<script lang="ts" setup>
import { ref, onBeforeMount, defineAsyncComponent, reactive } from 'vue';
import ImageSlide from '../components/slides/ImageSlide.vue';
// swiper imports
import { Mousewheel, Pagination } from 'swiper';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const pageContents = [
  {
    type: 'ImageSlide',
    image: '1.jpg'
  },
  {
    type: 'ImageSlide',
    image: '2.jpg'
  },
  { type: 'ImageSlide', image: '3.jpg' },
  { type: 'ImageSlide', image: '4.jpg' }
];

// components to be used on this container
const loadedComponents = new Map<string, any>();
pageContents.forEach((element) => {
  if (!loadedComponents.has(element.type)) {
    loadedComponents.set(
      element.type,
      defineAsyncComponent(
        () => import(`../components/slides/${element.type}.vue`)
      )
    );
  }
});

// #region determine which version to show
const showDesktopVersion = ref(false);
const breakpoint = window.matchMedia('(min-width:1024px)');
const breakpointCheck = () => {
  showDesktopVersion.value = breakpoint.matches;
};
breakpoint.addEventListener('change', breakpointCheck);
// #endregion

// preserve slide index in case of breakpoint switching to mobile view
const currentSwiperIndex = ref(0);

// swiper events
const activeIndexChange = (swiper: SwiperType): void => {
  // update the last visited index
  currentSwiperIndex.value = swiper.activeIndex;
};
// lifecycle
onBeforeMount(() => {
  // initial check to determine which version will be displayed
  breakpointCheck();
});
</script>
<template>
  <div class="vertical-slides">
    <swiper
      :slides-per-view="'auto'"
      :direction="'vertical'"
      :initial-slide="currentSwiperIndex"
      :modules="[Mousewheel, Pagination]"
      :auto-height="true"
      :pagination="{ clickable: true }"
      :speed="1350"
      :mousewheel="true"
      @active-index-change="activeIndexChange"
      v-if="showDesktopVersion"
    >
      <swiper-slide>
        <image-slide
          class="vertical-slides-slide"
          image="1.jpg"
          :half="false"
        />
      </swiper-slide>
      <swiper-slide>
        <image-slide
          class="vertical-slides-slide"
          image="2.jpg"
          :half="false"
        />
      </swiper-slide>
      <swiper-slide>
        <image-slide class="vertical-slides-slide" image="3.jpg" :half="true" />
      </swiper-slide>
      <swiper-slide>
        <image-slide
          class="vertical-slides-slide"
          image="4.jpg"
          :half="false"
        />
      </swiper-slide>
    </swiper>
    <div class="content" v-else>
      <component
        v-for="(c, i) in pageContents"
        :key="i"
        :is="loadedComponents.get(c.type)"
        :image="c.image"
      ></component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vertical-slides {
  height: 100vh;

  .swiper,
  .content {
    height: 100%;
  }
}
</style>
