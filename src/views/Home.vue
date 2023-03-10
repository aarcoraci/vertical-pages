<script lang="ts" setup>
import { isMobile } from 'is-mobile';
import { onMounted, onBeforeUnmount, ref } from 'vue';

import { gsap, Power2 } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import ImageSlide from '../components/slides/ImageSlide.vue';
import HeaderMenuSlide from '../components/slides/HeaderMenuSlide.vue';
import SwiperSlide from '../components/slides/SwiperSlide.vue';

gsap.registerPlugin(ScrollToPlugin);

const scrolling = ref(false);
const lastYScroll = ref(0);
const presentationSlides = ref<HTMLElement[]>([]);
const paginationContainer = ref<HTMLDivElement>();
const activeSlideIndex = ref(0);

const getCurrentVisibleSlide = (direction: 'down' | 'up') => {
  if (direction === 'down') {
    const scrolledSlides = presentationSlides.value
      .filter((s) => s.getBoundingClientRect().top <= 0)
      .sort(
        (s1, s2) =>
          s2.getBoundingClientRect().top - s1.getBoundingClientRect().top
      );
    return scrolledSlides[0];
  } else {
    const nonSrolledSlides = presentationSlides.value
      .filter((s) => s.getBoundingClientRect().top > 0)
      .sort(
        (s1, s2) =>
          s1.getBoundingClientRect().top - s2.getBoundingClientRect().top
      );
    return nonSrolledSlides[0];
  }
};

const handleScroll = (e: Event) => {
  if (scrolling.value) {
    lastYScroll.value = window.scrollY;
    e.preventDefault();
    return;
  }

  if (lastYScroll.value < window.scrollY) {
    // DOWN SCROLLING
    const currentVisibleSlide = getCurrentVisibleSlide('down');
    const currentSlideIndex = parseInt(
      currentVisibleSlide.getAttribute('data-index') || '0'
    );
    if (currentSlideIndex < presentationSlides.value.length - 1) {
      goToSection(currentSlideIndex + 1);
    }
  } else {
    // UP SCROLLING
    const currentVisibleSlide = getCurrentVisibleSlide('up');
    const currentSlideIndex = parseInt(
      currentVisibleSlide.getAttribute('data-index') || '0'
    );
    if (currentSlideIndex > 0) {
      goToSection(currentSlideIndex - 1);
    }
  }
  lastYScroll.value = window.scrollY;
};

const goToSection = (i: number) => {
  activeSlideIndex.value = i;
  scrolling.value = true;
  const { top } = presentationSlides.value[i].getBoundingClientRect();
  gsap.to(window, {
    scrollTo: { y: top + window.scrollY, autoKill: false },
    duration: 1.35,
    delay: 0,
    ease: Power2.easeInOut,
    onComplete: () => {
      setTimeout(() => {
        scrolling.value = false;
      }, 120);
    }
  });
};

/**
 * prepares the slide elements to work with the scrolling effect
 */
const prepareSlides = () => {
  for (let index = 0; index < presentationSlides.value.length; index++) {
    const element = presentationSlides.value[index];
    element.setAttribute('data-index', index.toString());
  }
};

onMounted(() => {
  // build list of present slides
  presentationSlides.value = Array.from(
    document.querySelectorAll<HTMLElement>('.presentation-slide')
  );

  if (!isMobile()) {
    prepareSlides();
    window.addEventListener('scroll', handleScroll, { passive: false });
  }
});
onBeforeUnmount(() => {
  if (!isMobile()) {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>
<template>
  <main>
    <div
      ref="paginationContainer"
      class="scrollable-pagination"
      role="navigation"
    >
      <div
        v-for="(_, index) in presentationSlides"
        class="scrollable-pagination-bullet"
        role="button"
        :class="{ active: activeSlideIndex === index }"
        :aria-label="`go to slide ${index}`"
        @click="goToSection(index)"
      ></div>
    </div>
    <div class="slides">
      <HeaderMenuSlide class="presentation-slide" image="3.jpg" />
      <image-slide class="presentation-slide" image="1.jpg" :half="false" />
      <!-- <SwiperSlide class="presentation-slide" data-index="2" /> -->
      <image-slide class="presentation-slide" image="2.jpg" :half="true" />
      <image-slide class="presentation-slide" image="3.jpg" :half="false" />
      <image-slide class="presentation-slide" image="4.jpg" :half="false" />
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
