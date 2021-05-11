<template>
  <transition name="fade-transition-router" @after-enter="afterEnter">
    <div id="cruise-map" v-if="openMap">
      <button @click="$store.commit('playMusic')" class="audio"></button>
      <img
          v-popover:allWay
          src="../assets/interactiveimgs/compass.png"
          alt="compass"
          id="compass"
          @click="showAllWay">
      <Popover
          transition="popover-appear"
          name="allWay"
          event="hover">
        Показать весь путь
      </Popover>
      <img
          v-popover:toMain.right
          @click="$router.push('/')"
          src="../assets/interactiveimgs/bottle.png"
          alt="bottle"
          class="bottleMap">
      <Popover
          transition="popover-appear-left"
          name="toMain"
          event="hover">
        На главную
      </Popover>
        <img
            v-popover:toBook.left
            @click="$router.push('/cruiseBook')"
            src="../assets/interactiveimgs/book.png"
            alt="map"
            id="to-book">
      <Popover
          transition="popover-appear-right"
          name="toBook"
          event="hover">
        К ниге
      </Popover>
      <img
          v-popover:removeProgress
          id="progress"
          src="../assets/interactiveimgs/sturval.png"
          alt="sturval"
          @click="removeProgress">
      <Popover
          transition="popover-appear"
          name="removeProgress"
          event="hover">
        Сбросить прогресс
      </Popover>
      <div id="smallbook" @mouseover="sbOpen" @mouseout="sbClose">
        <p v-html="smallBook" style="margin-left:11%;margin-top:7%;font-family: Bradley Hand, cursive;">
          {{ smallBook }}</p>
      </div>
      <div
          id="warmashine"
          @click="pageNumber"
          v-popover:selectPage>
        <input v-model.trim="selectedPage" type="number" max="258" min="0" placeholder="№Page">
      </div>
      <Popover
          transition="popover-appear"
          name="selectPage"
          event="hover">
        Выбрать страницу
      </Popover>
      <div v-for="(dot, index) in OX" :key="index">
        <div
            v-popover="{ name: '' + index }"
            class="dot"
            :style="{left: OX[index] + '%',
                     top: OY[index] + '%',
                     backgroundImage: (point === index) ? 'url(' + require('../assets/images/' + backgroundImage + '.jpg') + ')' :''
                   }"
            v-show="(index<=GET_PAGE_INDEX)||(compass)"
            @click="moveToBookPage(index)"
            @mouseover="appearingWindowOpen(index)"
            @mouseout="appearingWindowClose()">
        </div>
        <Popover
            transition="popover-appear"
            :delay="400"
            :name="'' + index"
            event="hover">
          {{ cities[point] }}
        </Popover>
      </div>
      <canvas
          id="lines"
          :width="clientWidth"
          :height="clientHeight">
      </canvas>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Popover from 'vue-js-popover'
import { ICruiseMap } from '@/interfaces'
import { cities, OX, OY, imageCities, smallBookText } from '@/constants'
import { solutionSystem } from "@/functions";

Vue.use(Popover)
export default Vue.extend({
  name: 'cruise-map',
  data(): ICruiseMap {
    return {
      OX,
      OY,
      imageCities,
      cities,
      backgroundImage: '',
      point: -1,
      dots: [],
      ctx: null,
      clientWidth: 0,
      clientHeight: 0,
      compass: false,
      smallBook: 'Навигация по книге:',
      selectedPage: 0,
      openMap: false,
      block: false
    }
  },
  methods: {
    afterEnter() {
      this.clientWidth = document.body.clientWidth;
      this.clientHeight = document.body.clientHeight;
      this.dots = Array.from(document.getElementsByClassName('dot'));
      const canvas = document.getElementById('lines') as HTMLCanvasElement;
      this.ctx = canvas.getContext('2d');
      setTimeout(() => {
        this.plotting(+localStorage.getItem('way')!);
        if (+localStorage.getItem('way')! < this.GET_PAGE_INDEX) {
          if (this.GET_PAGE_INDEX - (+localStorage.getItem('way')!) === 1)
            this.buildHead();
          else
            this.plotting(this.GET_PAGE_INDEX);
          localStorage.setItem('way', String(this.GET_PAGE_INDEX));
        }
      }, 100);
    },
    appearingWindowOpen(index: number) {
      this.point = index;
      this.backgroundImage = this.imageCities[index];
    },
    appearingWindowClose() {
      this.point = -1;
      this.backgroundImage = '';
    },
    showAllWay() {
      if (!this.block) {
        this.compass = !this.compass;
        let plotFor: number;
        if (this.compass) plotFor = 18;
        else plotFor = this.GET_PAGE_INDEX;
        setTimeout(() => {
          this.plotting(plotFor)
        }, 10);
      }
    },
    plotting(plotFor: number) {
      this.clientWidth = document.body.clientWidth;
      this.clientHeight = document.body.clientHeight;
      this.ctx!.clearRect(0, 0, this.clientWidth, this.clientHeight);
      this.ctx!.beginPath();
      for (let i = 0; i < plotFor; i++) {
        let tmp1 = this.dots[i].getBoundingClientRect();
        let tmp2 = this.dots[i + 1].getBoundingClientRect();
        let x1 = tmp1.left + 4;
        let x2 = tmp2.left + 4;
        let y1 = tmp1.top + 4;
        let y2 = tmp2.top + 4;
        let centerY;
        let centerX;
        if (x1 > x2) centerX = x2 + Math.abs(x1 - x2) / 2;
        else centerX = x1 + Math.abs(x1 - x2) / 2;
        if (y1 > y2) centerY = y2 + Math.abs(y1 - y2) / 2;
        else centerY = y1 + Math.abs(y1 - y2) / 2;
        let x3 = centerX - (y2 - y1) / 2;
        if ((i >= 10) && (i <= 13)) x3 = centerX + (y2 - y1) / 4;
        let y3 = -((x2 - x1) / (y2 - y1)) * x3 + (centerY + ((x2 - x1) / (y2 - y1)) * centerX);
        this.ctx!.strokeStyle = "blue";
        this.ctx!.moveTo(x1, y1);
        this.ctx!.quadraticCurveTo(x3, y3, x2, y2);
        this.ctx!.stroke();
      }
      this.ctx!.closePath();
    },
    buildHead() {
      let tmp1 = this.dots[this.GET_PAGE_INDEX - 1].getBoundingClientRect();
      let tmp2 = this.dots[this.GET_PAGE_INDEX].getBoundingClientRect();
      let x1 = tmp1.left + 4;
      let x2 = tmp2.left + 4;
      let y1 = tmp1.top + 4;
      let y2 = tmp2.top + 4;
      let centerY;
      let centerX;
      if (x1 > x2) centerX = x2 + Math.abs(x1 - x2) / 2;
      else centerX = x1 + Math.abs(x1 - x2) / 2;
      if (y1 > y2) centerY = y2 + Math.abs(y1 - y2) / 2;
      else centerY = y1 + Math.abs(y1 - y2) / 2;
      let x3 = centerX - (y2 - y1) / 8;
      let y3 = -((x2 - x1) / (y2 - y1)) * x3 + (centerY + ((x2 - x1) / (y2 - y1)) * centerX);
      let odd = solutionSystem(x1, y1, x2, y2, x3, y3);
      let funcX = x1;
      let funcY = y1;
      if (document.getElementById('plane')) document.getElementById('cruise-map')!.removeChild(document.getElementById('plane')!);
      if (document.getElementById('ship')) document.getElementById('cruise-map')!.removeChild(document.getElementById('ship')!);
      if (document.getElementById('train')) document.getElementById('cruise-map')!.removeChild(document.getElementById('train')!);
      let transport;
      transport = document.createElement("img");
      if (this.GET_PAGE_INDEX === 1) {
        transport.src = require('../assets/interactiveimgs/train.png');
        transport.id = "train";
      } else if ((this.GET_PAGE_INDEX <= 4) || (this.GET_PAGE_INDEX > 15)) {
        transport.src = require('../assets/interactiveimgs/plane.png');
        transport.id = "plane";
      } else {
        transport.src = require('../assets/interactiveimgs/ship.png');
        transport.id = "ship";
      }
      document.getElementById('cruise-map')!.appendChild(transport);
      this.buildWay(funcX, funcY, odd, transport, [x1, x2, y1, y2]);
    },
    buildWay(fx: number, fy: number, odd: number[], transport: HTMLElement, coordinates: number[]) {
      const [x1, x2, y1, y2] = coordinates;
      this.block = true;
      this.ctx!.fillStyle = "blue";
      fy = odd[0] * fx * fx + odd[1] * fx + odd[2];
      if (x1 > x2) fx = fx - 5;
      else fx = fx + 5;
      transport.style.left = fx + 'px';
      transport.style.top = fy + 'px';
      this.ctx!.fillRect(fx, fy, 3, 3);
      const timer = setTimeout(() => {
        this.buildWay(fx, fy, odd, transport, [x1, x2, y1, y2]);
      }, 140);
      if (x1 > x2) {
        if (fx <= x2) {
          clearTimeout(timer)
          this.block = false;
        }
      } else if (fx >= x2) {
        clearTimeout(timer);
        this.block = false;
      }
    },
    removeProgress() {
      if (!this.block) {
        localStorage.removeItem('way');
        localStorage.setItem('page', String(0));
        this.$store.commit('startMusic', null);
        this.$store.commit('changeIndexBook', 0);
        this.plotting(0);
        if (this.compass) this.compass = false;
        if (document.getElementById('plane')) document.getElementById('cruise-map')!.removeChild(document.getElementById('plane')!);
        if (document.getElementById('ship')) document.getElementById('cruise-map')!.removeChild(document.getElementById('ship')!);
        if (document.getElementById('train')) document.getElementById('cruise-map')!.removeChild(document.getElementById('train')!);
      }
    },
    moveToBookPage(index: number) {
      if (this.GET_PAGE_INDEX < index) this.$store.commit('changeIndexBook', index);
      switch (index) {
        case 0 : {
          localStorage.setItem('page', String(0));
          break;
        }
        case 1 : {
          localStorage.setItem('page', String(20));
          break;
        }
        case 2 : {
          localStorage.setItem('page', String(28));
          break;
        }
        case 3 : {
          localStorage.setItem('page', String(32));
          break;
        }
        case 4 : {
          localStorage.setItem('page', String(36));
          break;
        }
        case 5 : {
          localStorage.setItem('page', String(58));
          break;
        }
        case 6 : {
          localStorage.setItem('page', String(78));
          break;
        }
        case 7 : {
          localStorage.setItem('page', String(86));
          break;
        }
        case 8 : {
          localStorage.setItem('page', String(92));
          break;
        }
        case 9 : {
          localStorage.setItem('page', String(122));
          break;
        }
        case 10 : {
          localStorage.setItem('page', String(130));
          break;
        }
        case 11 : {
          localStorage.setItem('page', String(140));
          break;
        }
        case 12 : {
          localStorage.setItem('page', String(176));
          break;
        }
        case 13 : {
          localStorage.setItem('page', String(194));
          break;
        }
        case 14 : {
          localStorage.setItem('page', String(206));
          break;
        }
        case 15 : {
          localStorage.setItem('page', String(216));
          break;
        }
        case 16 : {
          localStorage.setItem('page', String(220));
          break;
        }
        case 17 : {
          localStorage.setItem('page', String(238));
          break;
        }
        case 18 : {
          localStorage.setItem('page', String(252));
          break;
        }
      }
      this.$router.push('/cruiseBook');
    },
    sbOpen() {
      this.smallBook = smallBookText;
      document.getElementById('to-book')!.style.opacity = '0';
      document.getElementById('to-book')!.style.opacity = '0';
    },
    sbClose() {
      this.smallBook = 'Навигация по книге:';
      document.getElementById('to-book')!.style.opacity = '1';
      document.getElementById('to-book')!.style.opacity = '1';
    },
    pageNumber() {
      if ((this.selectedPage > 2) && (this.selectedPage < 259)) {
        if (this.selectedPage % 2) localStorage.setItem('page', String(this.selectedPage - 3));
        else localStorage.setItem('page', String(this.selectedPage - 2));
        this.$store.commit('changeIndexBook', 18);
        this.$router.push('/cruiseBook');
      }
    },
    keyboardControl(e: any) {
      if (e.keyCode === 13) this.pageNumber();
    }
  },
  computed: {
    ...mapGetters([
      'GET_PAGE_INDEX'
    ])
  },
  mounted() {
    addEventListener("keydown", this.keyboardControl);
    this.openMap = true;
  }
});
</script>

<style>
.popover-appear-enter-active {
  animation: showPopover .8s;
}

.popover-appear-left-enter-active {
  animation: showPopoverLeft .8s;
}

.popover-appear-right-enter-active {
  animation: showPopoverRight .8s;
}

@keyframes showPopover {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes showPopoverLeft {
  0% {
    opacity: 0;
    transform: translate(20px);
  }
  100% {
    transform: translate(0);
    opacity: 1;
  }
}

@keyframes showPopoverRight {
  0% {
    opacity: 0;
    transform: translate(-20px);
  }
  100% {
    transform: translate(0);
    opacity: 1;
  }
}

input {
  display: none;
}

@media (min-width: 1050px) {
  #warmashine {
    cursor: pointer;
    background-image: url(../assets/interactiveimgs/shipbut.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    width: 30vw;
    height: 35vh;
    top: 46.5vh;
    left: 40vw;
    z-index: 2;
  }

  #warmashine:hover {
    animation: linear .8s ship 2;
  }

  input {
    position: absolute;
    top: 26.5vh;
    left: 11vw;
    z-index: 2;
    width: 17%;
    height: 10%;
    border-radius: 10px;
    border: double #800000;
    outline: none;
    display: block;
  }
}

@keyframes ship {
  0% {
    transform: rotate(5deg);
    top: 46.5vh;
  }
  25% {
    transform: rotate(0deg);
    top: 47.5vh;
  }
  75% {
    transform: rotate(-5deg);
    top: 46.5vh;
  }
  100% {
    top: 46.5vh;
    transform: rotate(5deg);
  }
}

#smallbook {
  cursor: pointer;
  position: absolute;
  bottom: 5vh;
  right: 5vw;
  width: 10vw;
  font-size: 60%;
  height: 25vh;
  background-image: url(../assets/interactiveimgs/sb3.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 2;
}

#smallbook:hover {
  bottom: 0;
  right: 0;
  width: 30vw;
  height: 65vh;
  transition: 1s;
}

@media (max-width: 1050px) {
  #smallbook {
    font-size: 70%;
  }

  #smallbook:hover {
    height: 100vh;
  }
}

#progress {
  cursor: pointer;
  width: 10vw;
  height: 10vw;
  position: absolute;
  bottom: 10vh;
  left: 10vw;
  z-index: 2;
}

#progress:hover {
  transform: rotate(360deg);
  transition: 1s;
}

#plane {
  width: 50px;
  height: 50px;
  margin-top: -25px;
  margin-left: -20px;
  position: fixed;
}

#train {
  width: 40px;
  height: 40px;
  margin-top: -30px;
  margin-left: -10px;
  position: fixed;
}

#ship {
  width: 30px;
  height: 30px;
  margin-top: -20px;
  margin-left: -10px;
  position: fixed;
}

#to-book {
  cursor: pointer;
  position: absolute;
  top: 30vh;
  right: 2vw;
  width: 10vw;
  height: 8vw;
  animation: bottle 2s 2;
}

.bottleMap {
  cursor: pointer;
  position: absolute;
  top: 30vh;
  left: 2vw;
  width: 8vw;
  height: 10vw;
  animation: bottle 2s 2;
}

#cruise-map {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/images/secondlist.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
}

#lines {
  width: 100%;
  height: 100%;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: red;
  background-size: 100% 100%;
  border-radius: 100%;
  border: 1px solid black;
  position: absolute;
  z-index: 2;
}

@media (max-width: 1050px) {
  .dot {
    width: 4px;
    height: 4px;
  }
}

#compass {
  cursor: pointer;
  height: 8.5vh;
  width: 5vw;
  left: 21vw;
  top: 19vh;
  position: absolute;
  -webkit-animation: linear 2s compass infinite;
}

@keyframes compass {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (min-width: 1050px) {
  .dot:hover {
    cursor: pointer;
    transform: scale(17);
    transition: all .3s;
    box-shadow: 0 0 10px rgb(0, 0, 0);
    border: none;
    z-index: 3;
  }
[data-popover] {
    background: rgba(0, 0, 0, 0.5);
    color: #f9f9f9;
    text-align: center;
    font-size: 14px;
    line-height: 1.5;
    padding: 7px;
  }
  .vue-popover.dropdown-position-bottom:before {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid rgba(0, 0, 0, 0.5);
 }
  .vue-popover.dropdown-position-top:before {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.5);
 }
  .vue-popover.dropdown-position-left:before {
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid rgba(0, 0, 0, 0.5);
 }
  .vue-popover.dropdown-position-right:before {
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid rgba(0, 0, 0, 0.5);
 }
}

</style>
