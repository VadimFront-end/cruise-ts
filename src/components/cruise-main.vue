<template>
  <transition name="apearingnotation">
    <div id="cruise-main" v-if="openName">
      <img
          src="../assets/interactiveimgs/bottle.png"
          alt="bottle"
          class="bottle"
          v-show="!apear"
          @click="apear=true">
      <transition name="apearingnotation">
        <cruiseNotation v-show="apear"/>
      </transition>
      <router-link :to="'/cruiseMap'">
        <img
            src="../assets/interactiveimgs/tomap.png"
            alt="map"
            class="to-map"
            v-show="apear">
      </router-link>
    </div>
  </transition>
</template>

<script>
import cruiseNotation from './cruise-notation'

export default {
  name: 'cruise-main',
  components: {
    cruiseNotation
  },
  data() {
    return {
      apear: false,
      openName: false
    }
  },
  mounted() {
    this.openName = true;
  }
}
</script>

<style>
#cruise-main {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(../assets/images/main.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  width: 100vw;
}

.apearingnotation-enter-active {
  animation: showNotation 2s;
}

@keyframes showNotation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.bottle {
  cursor: pointer;
  width: 15vw;
  height: 20vw;
  animation: bottle 2s infinite;
}

.to-map {
  width: 8vw;
  height: 10vw;
  animation: bottle 2s 5;
}

@keyframes bottle {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
