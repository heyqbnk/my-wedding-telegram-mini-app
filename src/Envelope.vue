<script setup lang="ts">
import { ref } from 'vue';

import { bem } from './utils/bem';

const { b, e } = bem('envelope');
const open = ref(false);

const onStampLeave = (el: Element, done: VoidFunction) => {
  el
    .animate({
      transform: ['translate(-50%,-50%) scale(1)', 'translate(-50%,calc(-50% + 10px)) scale(1.1)'],
      // transform: ['translate(-50%,-50%)', 'translate(-50%,calc(-50% + 10px))'],
      opacity: ['1', '0'],
    }, {
      duration: 300,
      easing: 'ease-out',
    })
    .finished
    .then(() => done());
};
</script>

<template>
  <div :class="b()" @click="open = !open">
    <div :class="e('top-container', {open})">
      <div :class="e('top')"/>
    </div>
    <Transition :css="false" @leave="onStampLeave">
      <div v-if="!open" :class="e('stamp')"/>
    </Transition>
    <div :class="e('content', {show: open})">
      Content
    </div>
    <div :class="e('parts')">
      <div :class="e('bottom')"/>
      <div :class="e('left')"/>
      <div :class="e('right')"/>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:math";

.envelope {
  background-color: #a28638;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%) scale(0.5);
  aspect-ratio: math.div(500px, 300px);
  width: 100vw;

  &__content {
    position: absolute;
    top: 10%;
    left: 5%;
    right: 5%;
    bottom: 0;
    background-color: #aaa;
    transition: 1s ease-out;
    transition-delay: 600ms;

    &--show {
      top: -100%;
    }
  }

  &__stamp {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 14%;
    aspect-ratio: 1;
    transform: translate(-50%,-50%);
    transform-origin: center center;
    border-radius: 50%;
    background-color: red;
    z-index: 3;
  }

  &__parts {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__left, &__bottom, &__right, &__top {
    position: absolute;
    width: 60%;
    height: 100%;
    transform-origin: center center;
  }

  &__bottom {
    top: 60%;
    left: 20%;
    background-color: #caa742;
    transform: scaleX(1.5) rotate(45deg);
    transform-origin: center center;
    z-index: 1;
  }

  &__top {
    top: -60%;
    left: 20%;
    background-color: #bb9425;
    transform: scaleX(1.5) rotate(45deg);
  }

  &__top-container {
    position: absolute;
    inset: 0;
    transition: 750ms ease-out;
    transform-origin: center top;
    overflow: hidden;
    z-index: 2;

    &--open {
      animation: envelope-top-container-open 300ms ease-out both;
      animation-delay: 300ms;
    }

    @keyframes envelope-top-container-open {
      from {
        transform: scaleY(1);
        z-index: 2;
      }
      50% {
        z-index: 0;
      }
      to {
        transform: scaleY(-1);
        z-index: 0;
      }
    }
  }

  &__left {
    position: absolute;
    top: 50%;
    left: -18%;
    transform: translate(-50%, -50%) scaleX(1.5) rotate(45deg);
  }

  &__right {
    position: absolute;
    top: 50%;
    left: 118%;
    transform: translate(-50%, -50%) scaleX(1.5) rotate(45deg);
  }

  &__left, &__right {
    background-color: #debb55;
  }
}
</style>
