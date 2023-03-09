<script lang="ts" setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref } from 'vue';
import ImageSlide from '../components/slides/ImageSlide.vue';
import HeaderMenuSlide from '../components/slides/HeaderMenuSlide.vue';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const resize = () => {
  if (scrollTrigger) {
    scrollTrigger.refresh();
  }
};

// #region gsap
let scrollTrigger: ScrollTrigger;

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
    scrub: 0.5,
    snap: {
      snapTo: snapIntervals, // snap to the closest label in the timeline
      duration: { min: 0.5, max: 1 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
      delay: 0.05 // wait 0.2 seconds from the last scroll event before doing the snapping
    }
  });
};
// #endregion

const scrolling = ref(false);
const goToSection = (i: number) => {
  if (scrolling.value) {
    return;
  }
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

const asda = (pos: number) => {
  goToSection(pos);
};

// lifecycle
onBeforeMount(() => {
  // initial check to determine which version will be displayed
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
      <button @click.prevent="asda(0)">click</button>
      <button @click.prevent="asda(1)">click</button>
      <button @click.prevent="asda(2)">click</button>
      <button @click.prevent="asda(3)">click</button>
      <button @click.prevent="asda(4)">click</button>
    </div>
    <HeaderMenuSlide class="vertical-slides-slide" image="3.jpg" />
    <image-slide class="vertical-slides-slide" image="1.jpg" :half="false" />
    <image-slide class="vertical-slides-slide" image="2.jpg" :half="true" />
    <image-slide class="vertical-slides-slide" image="3.jpg" :half="false" />
    <image-slide class="vertical-slides-slide" image="4.jpg" :half="false" />
  </div>
</template>

<style lang="scss" scoped>
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
