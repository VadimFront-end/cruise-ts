<template>
  <div
      id="cruise-book"
      :style="backGroundChange">
    <button @click="$store.commit('playMusic')" class="audio"></button>
    <router-link :to="'/cruiseMap'">
      <img
          src="../assets/interactiveimgs/tomap.png"
          alt="map"
          class="to-map">
    </router-link>
    <div @click="turn(true)" class="turn10" style="transform: rotate(180deg)"></div>
    <div @click="turn(false)" class="turn10" style="left: 1vw;right: auto"></div>
    <transition name="fade-transition-router">
      <div
          v-if="openBook"
          class="book"
          :style="opacityBook"
          @mouseover="booksOpacity = false"
          @mouseout="booksOpacity = true">
        <cruiseBookPage
            :style="{ width: 80 + 'vw' }"
            v-if="width < 1050 && page"
            @sendPhoto="openPhoto"
            @sendBox="openBox"
            @sendBox1="openBox1"
            :page="page - 1"/>
        <div v-else-if="width < 1050 && page === 0" class="hardPage" style="width: 80vw"></div>
        <div v-else style="display: flex">
          <cruiseBookPage
              @sendPhoto="openPhoto"
              @sendBox1="openBox1"
              :page="page - 1"
              v-if="page"
              class="left-page"/>
          <div v-else class="hardPage left-page"></div>
          <cruiseBookPage
              @sendBox="openBox"
              @sendPhoto="openPhoto"
              :page="page"
              v-if="page !== 256"
              class="right-page"/>
          <div v-else class="hardPage right-page"></div>
        </div>
        <transition name="pht">
          <div
              class="photos"
              :class="{ photos2 : openedPhoto.vert }"
              :style="{backgroundImage: openedPhoto.photo ? 'url(' + require('../assets/' + openedPhoto.photo) + ')': ''}"
              v-show="isShowPhoto"
              @click="isShowPhoto=!isShowPhoto"
          >
          </div>
        </transition>
        <transition name="openBox">
          <div
              class="checkbox"
              :style="{backgroundImage: openedBox.appear[openedBox.iLR] ? 'url(' + require('../assets/' + openedBox.appear[openedBox.iLR]) + ')' : ''}"
              v-show="openedBox.check"
              @click="openedBox.check=!openedBox.check">
          </div>
        </transition>
        <transition name="openBox1">
          <div
              class="checkbox"
              :style="{backgroundImage: openedBox1.appear ? 'url(' + require('../assets/' + openedBox1.appear) + ')' : ''}"
              v-show="openedBox1.check"
              @click="openedBox1.check=!openedBox1.check">
          </div>
        </transition>
        <div
            id="buttonR"
            v-show="openedBox.iLR !== openedBox.appear.length - 1 && openedBox.check"
            @click="openedBox.iLR++">
        </div>
        <div
            id="buttonL"
            v-show="openedBox.iLR !== 0 && openedBox.check"
            @click="openedBox.iLR--">
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import cruiseBookPage from './cruise-book-page.vue'
import { mapGetters } from 'vuex'
import {ICruiseBook, IOpenedBox, IOpenedPhoto} from '@/interfaces'
import Vue from 'vue'

interface IOpacityBook {
  opacity: number,
  transition: string
}

interface IBackgroundImage {
  backgroundImage: string
}

const music = ['audio/read/8read.mp3', 'audio/read/12read.mp3', 'audio/read/14read.mp3', 'audio/read/14rio.mp3', 'audio/read/141read.mp3', 'audio/read/142read.mp3', 'audio/read/16read.mp3', 'audio/read/20read.mp3', 'audio/read/last.mp3'];
export default Vue.extend({
  name: 'cruise-book',
  components: {
    cruiseBookPage
  },
  data(): ICruiseBook {
    return {
      booksOpacity: false,
      imgs: this.$store.state.imgCities,
      pageObject: this.$store.state.book[2],
      page: localStorage.getItem('page') ? +localStorage.getItem('page') : 0,
      isShowPhoto: false,
      openedPhoto: {
        photo: '',
        vert: false
      },
      openedBox: {
        appear: [],
        iLR: 0,
        check: false
      },
      openedBox1: {
        appear: '',
        check: false
      },
      openBook: false,
      width: document.body.clientWidth
    }
  },
  methods: {
    ChangeXY(): void {
      console.log('фу таким быть, не ресайзи - это может что-то сломать :)')
      if (this.page < 2) this.page = 2;
      if (this.page % 2)
        this.page++;
      if (this.page > 256)
        this.page = 256;
      this.width = document.body.clientWidth;
    },
    openPhoto(data: IOpenedPhoto): void {
      this.isShowPhoto = !this.isShowPhoto;
      this.openedPhoto = data;
    },
    openBox(data: IOpenedBox): void {
      this.openedBox1.check = false;
      this.openedBox = data;
    },
    openBox1(data: IOpenedBox): void {
      this.openedBox.check = false;
      this.openedBox1 = data;
    },
    keyboardControl(e: any): void {
      if (this.width > 1050) {
        switch (e.keyCode) {
          case 37: {
            this.page !== 0 ? this.page = this.page - 2 : this.page = 0;
            break;
          }
          case 39: {
            this.page !== 256 ? this.page = this.page + 2 : this.page = 256;
            break;
          }
        }
      } else {
        switch (e.keyCode) {
          case 37: {
            this.page !== 1 ? this.page-- : this.page = 1;
            break;
          }
          case 39: {
            this.page !== 256 ? this.page++ : this.page = 256;
            break;
          }
        }
      }
    },
    turn(bool: boolean) {
      this.booksOpacity = false;
      if (bool)
        if (this.width > 1050)
          this.page !== 256 ? this.page = this.page + 2 : this.page = 256;
        else this.page !== 256 ? this.page++ : this.page = 256;
      else if (this.width > 1050)
        this.page !== 0 ? this.page = this.page - 2 : this.page = 0;
      else this.page !== 0 ? this.page-- : this.page = 0;
    }
  },
  computed: {
    opacityBook(): IOpacityBook {
      if (this.booksOpacity)
        return {
          opacity: 0.2,
          transition: 'all 1s'
        }
      else return {
        opacity: 1,
        transition: 'all .5s'
      }
    },
    backGroundChange(): IBackgroundImage {
      return {
        backgroundImage: 'url(' + require('../assets/images/' + this.imgs[this.GET_PAGE_INDEX] + '.jpg') + ')'
      }
    },
    ...mapGetters([
      'GET_PAGE_INDEX'
    ])
  },
  watch: {
    page(): void {
      this.openedBox.check = false;
      this.openedBox1.check = false;
      if (this.isShowPhoto) this.isShowPhoto = false;
      localStorage.setItem('page', String(this.page));
      console.log(localStorage.getItem('page'))
      if (this.page + 2 === 52)
        this.$store.commit('startMusic', music[0]);
      if (this.page + 2 === 80)
        this.$store.commit('startMusic', music[1]);
      if (this.page + 2 === 94)
        this.$store.commit('startMusic', music[2]);
      if (this.page + 2 === 124)
        this.$store.commit('startMusic', music[6]);
      if (this.page + 2 === 178)
        this.$store.commit('startMusic', music[7]);
      if (this.page + 2 === 254)
        this.$store.commit('startMusic', music[8]);
      if (((this.page + 2 === 22) && (this.GET_PAGE_INDEX < 1))
          || ((this.page + 2 === 30) && (this.GET_PAGE_INDEX < 2))
          || ((this.page + 2 === 34) && (this.GET_PAGE_INDEX < 3))
          || ((this.page + 2 === 38) && (this.GET_PAGE_INDEX < 4))
          || ((this.page + 2 === 60) && (this.GET_PAGE_INDEX < 5))
          || ((this.page + 2 === 80) && (this.GET_PAGE_INDEX < 6))
          || ((this.page + 2 === 88) && (this.GET_PAGE_INDEX < 7))
          || ((this.page + 2 === 94) && (this.GET_PAGE_INDEX < 8))
          || ((this.page + 2 === 124) && (this.GET_PAGE_INDEX < 9))
          || ((this.page + 2 === 132) && (this.GET_PAGE_INDEX < 10))
          || ((this.page + 2 === 142) && (this.GET_PAGE_INDEX < 11))
          || ((this.page + 2 === 178) && (this.GET_PAGE_INDEX < 12))
          || ((this.page + 2 === 196) && (this.GET_PAGE_INDEX < 13))
          || ((this.page + 2 === 208) && (this.GET_PAGE_INDEX < 14))
          || ((this.page + 2 === 218) && (this.GET_PAGE_INDEX < 15))
          || ((this.page + 2 === 222) && (this.GET_PAGE_INDEX < 16))
          || ((this.page + 2 === 240) && (this.GET_PAGE_INDEX < 17))
          || ((this.page + 2 === 254) && (this.GET_PAGE_INDEX < 18))) {
        this.$store.commit('changeIndexBook', this.GET_PAGE_INDEX + 1);
        this.$router.push('/cruiseMap');
      }
    }
  },
  mounted(): void {
    addEventListener("keydown", this.keyboardControl);
    addEventListener("resize", this.ChangeXY);
    this.openBook = true;
  }
});
</script>

<style>
.turn10 {
  cursor: pointer;
  position: absolute;
  bottom: 5vh;
  right: 1vw;
  width: 7vw;
  height: 7vw;
  border-radius: 100%;
  background-image: url(../assets/interactiveimgs/left10.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.audio {
  cursor: pointer;
  background-image: url(../assets/interactiveimgs/play.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  width: 70px;
  height: 70px;
  top: 10vh;
  border-radius: 50%;
  outline: none;
}

button:active, button:focus {
  outline: none;
}

#buttonR {
  cursor: pointer;
  height: 15vh;
  border-radius: 50%;
  width: 10vw;
  background-image: url(../assets/interactiveimgs/arraw2.png);
  opacity: 0.3;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 45vh;
  left: 67vw;
  z-index: 1001;
}

#buttonR:hover {
  transform: translateX(20px);
}

#buttonL {
  cursor: pointer;
  position: absolute;
  border-radius: 50%;
  top: 45vh;
  left: 25vw;
  height: 15vh;
  width: 10vw;
  background-image: url(../assets/interactiveimgs/arraw.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  opacity: 0.3;
  z-index: 1001;
}

#buttonL:hover {
  transform: translateX(-20px);
}

.checkbox {
  display: block;
  position: absolute;
  border-radius: 20px;
  top: 5vh;
  left: 20vw;
  height: 90vh;
  width: 60vw;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 1000;
}

.openBox-enter-active {
  animation: showInside .8s;
}

.openBox-leave-active {
  animation: showInside .8s reverse;
}

@keyframes showInside {
  0% {
    top: 67vh;
    height: 15vh;
    width: 7vw;
    left: 80vw;
  }
  100% {
    height: 90vh;
    width: 60vw;
    top: 5vh;
    left: 20vw;
  }
}

.openBox1-enter-active {
  animation: showInside1 .8s;
}

.openBox1-leave-active {
  animation: showInside1 .8s reverse;
}

@keyframes showInside1 {
  0% {
    top: 67vh;
    height: 15vh;
    width: 7vw;
    left: 15vw;
  }
  100% {
    height: 90vh;
    width: 60vw;
    top: 5vh;
    left: 20vw;
  }
}


#cruise-book {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.book {
  display: flex;
  margin: auto 20px;
}

.hardPage {
  background-image: url(../assets/images/hardPage.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 40vw;
  height: 95vh;
}

.left-page {
  border-radius: 5px 0 0 5px;
}

.right-page {
  border-radius: 0 5px 5px 0;
}

.photos {
  cursor: pointer;
  display: block;
  position: absolute;
  border-radius: 20px;
  height: 35vw;
  width: 60vw;
  top: 5vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  left: 20vw;
  max-height: 85vh;
}

.photos2 {
  cursor: pointer;
  display: block;
  position: absolute;
  border-radius: 20px;
  height: 90vh;
  width: 35vw;
  top: 5vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  left: 30vw;
  z-index: 1000;
}

.pht-enter-active {
  animation: phto 1.5s;
}

@keyframes phto {
  0% {
    top: 0;
    margin: auto;
    opacity: 0;
  }
  100% {
    opacity: 1;
    top: 5vh;
    margin: auto;
  }
}
</style>