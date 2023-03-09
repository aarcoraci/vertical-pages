<script lang="ts" setup>
interface ImageSlideProps {
  image: string;
  half: boolean;
}

const props = withDefaults(defineProps<ImageSlideProps>(), {});

const backgroundImage = new URL(
  `../../assets/img/demo/${props.image}`,
  import.meta.url
).href;
</script>
<template>
  <div
    class="slide slide-image"
    :class="{ half: half }"
    :style="{
      'background-image': 'url(' + backgroundImage + ')'
    }"
  ></div>
</template>
<style lang="scss" scoped>
.slide {
  @include base-slide;
  &-image {
    background-position: center;
    background-size: cover;
    height: 400px;
    @include respond-to('small') {
      height: 100vh;
    }

    &.half {
      @include respond-to('small') {
        height: 40vh;
      }
    }
  }
}
</style>
