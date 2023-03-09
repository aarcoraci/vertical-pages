<script lang="ts" setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from 'vue';
import ImageSlide from '../components/slides/ImageSlide.vue';
import HeaderMenuSlide from '../components/slides/HeaderMenuSlide.vue';
import SwiperSlide from '../components/slides/SwiperSlide.vue';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

let maxSnapDuration = ref<number>((window.innerHeight * 2) / 1024);
const scrolling = ref(false);
let scrollTrigger: ScrollTrigger;

const resize = () => {
  if (scrollTrigger) {
    maxSnapDuration.value = (window.innerHeight * 1.5) / 1024;
    scrollTrigger.refresh();
  }
};

// #region determine which version to show
const showDesktopVersion = ref(false);
const breakpoint = window.matchMedia('(min-width:1024px)');
const breakpointCheck = () => {
  showDesktopVersion.value = breakpoint.matches;
  if (!showDesktopVersion.value) {
    scrollTrigger.disable();
  } else {
    scrollTrigger.enable(false, true);
  }
};
breakpoint.addEventListener('change', breakpointCheck);
// #endregion

// #region gsap

const initScrollTrigger = () => {
  let slides: HTMLElement[] = Array.from(
    document.querySelectorAll<HTMLElement>('.vertical-slides-slide')
  );

  const scrollHeight = slides.reduce((acc, curr) => {
    return acc + curr.getBoundingClientRect().height;
  }, 0);

  let snapIntervals: number[] = [];
  slides.forEach((currentSlide) => {
    snapIntervals = [
      ...snapIntervals,
      currentSlide.getBoundingClientRect().height / scrollHeight
    ];
  });

  snapIntervals = snapIntervals.reduce((acc: number[], curr: number, i) => {
    return i == 0 ? [curr] : [...acc, acc[i - 1] + curr];
  }, []);

  snapIntervals = [0, ...snapIntervals];

  scrollTrigger = ScrollTrigger.create({
    trigger: '.vertical-slides',
    markers: false,
    start: 'top top',
    scrub: false,
    snap: {
      snapTo: snapIntervals,
      directional: true,
      duration: { min: 0.35, max: maxSnapDuration.value },
      delay: 0.05,
      onStart: () => {
        scrolling.value = true;
      },
      onComplete: () => {
        scrolling.value = false;
      }
    }
  });
};
// #endregion

const goToSection = (i: number) => {
  scrolling.value = true;
  // get the top position
  const { top } = document
    .querySelectorAll('.vertical-slides-slide')
    [i].getBoundingClientRect();

  gsap.to(window, {
    scrollTo: { y: top + window.scrollY, autoKill: false },
    duration: 1.35,
    onComplete: () => {
      scrolling.value = false;
    }
  });
};

onBeforeMount(() => {
  window.addEventListener('resize', resize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});
onMounted(() => {
  initScrollTrigger();
});
</script>
<template>
  <div class="vertical-slides">
    <div class="pagination">
      <button @click.prevent="goToSection(0)">click</button>
      <button @click.prevent="goToSection(1)">click</button>
      <button @click.prevent="goToSection(2)">click</button>
      <button @click.prevent="goToSection(3)">click</button>
      <button @click.prevent="goToSection(4)">click</button>
      <button @click.prevent="goToSection(5)">click</button>
    </div>
    <HeaderMenuSlide class="vertical-slides-slide" image="3.jpg" />
    <image-slide class="vertical-slides-slide" image="1.jpg" :half="false" />
    <SwiperSlide class="vertical-slides-slide" />
    <image-slide class="vertical-slides-slide" image="2.jpg" :half="true" />
    <image-slide class="vertical-slides-slide" image="3.jpg" :half="false" />
    <image-slide class="vertical-slides-slide" image="4.jpg" :half="false" />
  </div>
</template>

<style lang="scss" scoped>
.vertical-slides {
}
.pagination {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: purple;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
</style>
