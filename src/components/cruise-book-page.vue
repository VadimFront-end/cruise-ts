<template>
  <div class="cruise-book-page">
    <div class="contentPage">
      <div class="pageNumber">{{ page + 1 }}</div>
      <div
          style="text-align: center"
          :style="{fontSize: 48 * Math.sqrt(xk * yk) + 'px',lineHeight: 48 * Math.sqrt(xk * yk) + 'px'}"
      >{{ pageObject.main }}
      </div>
      <cruiseBooksPhoto
          :pageObject="pageObject"
          :index="0"
          @sendPhoto="openedPhoto"
      />
      <div
          v-html="pageObject.text1"
          :style="{fontSize: 29*Math.sqrt(xk * yk) + 'px',lineHeight: 29 * Math.sqrt(xk * yk) + 'px'}"
      >{{ pageObject.text1 }}
      </div>
      <cruiseBooksPhoto
          :pageObject="pageObject"
          :index="1"
          @sendPhoto="openedPhoto"
      />
      <iframe
          loading="lazy"
          v-show="pageObject.video"
          style="float:right;"
          allowfullscreen
          :src="pageObject.video">
      </iframe>
      <div
          v-html="pageObject.text2"
          :style="{fontSize:29 * Math.sqrt(xk * yk)+'px',lineHeight: 29 * Math.sqrt(xk * yk) + 'px'}"
      >{{ pageObject.text2 }}
      </div>
      <cruiseBooksPhoto
          :pageObject="pageObject"
          :index="2"
          @sendPhoto="openedPhoto"/>
      <div
          v-html="pageObject.text3"
          :style="{fontSize:29*Math.sqrt(xk*yk)+'px',lineHeight:29*Math.sqrt(xk*yk)+'px'}"
      >{{ pageObject.text3 }}
      </div>
      <div id="syndyk" @click="checks()" v-show="pageObject.box"></div>
      <div id="map" @click="checks1()" v-show="pageObject.map"></div>
      <audio
          style="height: 3vh;width: 20vw;margin: 1%;float: left;outline: none"
          :src="pageObject.audio ? require('../assets/' + pageObject.audio) : ''"
          controls
          preload="none"
          v-show="pageObject.audio"
      ></audio>
      <div
          v-html="pageObject.text4"
          :style="{fontSize: 29 * Math.sqrt(xk * yk) + 'px',lineHeight: 29 * Math.sqrt(xk * yk) + 'px'}"
      >{{ pageObject.text4 }}
      </div>
    </div>
    <div class="footerlist">
      <hr/>
      <div style="text-align: center">{{ page + 3 }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import cruiseBooksPhoto from './cruise-books-photo'
import { ICruseBookPage, IOpenedPhoto } from '@/interfaces'
import Vue from 'vue'

export default Vue.extend({
  name: "cruise-book-page",
  components: {
    cruiseBooksPhoto
  },
  props: {
    page: {
      type: Number,
      default(): number {
        return NaN;
      }
    }
  },
  data(): ICruseBookPage {
    return {
      pageObject: this.$store.state.book[this.page],
      xk: 0,
      yk: 0
    }
  },
  methods: {
    ChangeXY(): void {
      if (document.getElementById("plane"))
        document
            .getElementById("cruise-map")!
            .removeChild(document.getElementById("plane")!);
      if (document.getElementById("ship"))
        document
            .getElementById("cruise-map")!
            .removeChild(document.getElementById("ship")!);
      if (document.getElementById("train"))
        document
            .getElementById("cruise-map")!
            .removeChild(document.getElementById("train")!);
      if (document.body.clientWidth > 1050) {
        this.xk = document.body.clientWidth / 1536;
        this.yk = document.body.clientHeight / 2376;
      } else {
        this.xk = 1.4 * document.body.clientWidth / 1536;
        this.yk = 1.4 * document.body.clientHeight / 2376;
      }
    },
    openedPhoto(data: IOpenedPhoto): void {
      this.$emit("sendPhoto", data);
    },
    checks(): void {
      const sendBox = {
        iLR: 0,
        appear: this.pageObject.boxImg,
        check: true
      };
      this.$emit("sendBox", sendBox);
    },
    checks1(): void {
      const sendBox = {
        appear: this.pageObject.boxImg,
        check: true
      };
      this.$emit("sendBox1", sendBox);
    }
  },
  watch: {
    page(): void {
      this.pageObject = this.$store.state.book[this.page]
    }
  },
  mounted(): void {
    addEventListener("resize", this.ChangeXY);
    if (document.body.clientWidth > 1050) {
      setTimeout(() => {
        this.xk = document.body.clientWidth / 1536;
        this.yk = document.body.clientHeight / 2376;
      }, 500);
    } else {
      setTimeout(() => {
        this.xk = 1.4 * document.body.clientWidth / 1536;
        this.yk = 1.4 * document.body.clientHeight / 2376;
      }, 500);
    }
  },
});
</script>

<style>
.pageNumber {
  display: none;
}

@media (max-width: 1050px) {
  .pageNumber {
    float: right;
    border-radius: 50%;
    border: 1px solid black;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
}

.cruise-book-page {
  position: relative;
  background-color: snow;
  width: 40vw;
  height: 95vh;
  border: 1px solid black;
}

.contentPage {
  margin: 3%;
}

#syndyk {
  cursor: pointer;
  background-image: url(../assets/interactiveimgs/back.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 10px;
  height: 15vh;
  width: 7vw;
  float: right;
  animation: linear 2s list infinite;
}

#map {
  cursor: pointer;
  background-image: url(../assets/interactiveimgs/map.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 15vh;
  width: 7vw;
  margin: 10px;
  float: left;
  animation: linear 2s list infinite;
}

@keyframes list {
  0% {
    margin-top: 0;
    margin-left: 10px;
  }
  50% {
    margin-top: 5px;
    margin-left: 10px;
  }
  100% {
    margin-top: 0;
    margin-left: 10px;
  }
}

iframe {
  cursor: pointer;
  height: 17vh;
  width: 15vw;
  margin: 1%;
  outline: none;
  border: 0;
  border-radius: 10px;
}

iframe:hover {
  transform: scale(1.2);
  transition: 0.2s;
}

.footerlist {
  display: none;
}

@media (min-width: 1050px) {
  .footerlist {
    position: absolute;
    bottom: 0;
    padding: 1% 0;
    width: 100%;
    display: block;
  }
}
</style>
