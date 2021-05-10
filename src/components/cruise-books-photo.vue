<template>
  <div v-show="pageObject.images[index]">
    <img
        class="booksPhoto"
        loading="lazy"
        :src="pageObject.images[index] ? require('../assets/' + pageObject.images[index]) : ''"
        :style="{float: index % 2 ? 'right': 'left'}"
        @click="zoom()"
        alt="photo"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {IOpenedPhoto} from '@/interfaces'

export default Vue.extend({
  name: "cruise-books-photo",
  props: {
    pageObject: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  methods: {
    zoom(): void {
      const openPhoto: IOpenedPhoto = {
        vert: this.pageObject.vert[this.index],
        photo: this.pageObject.images[this.index]
      };
      this.$emit("sendPhoto", openPhoto);
    }
  }
});
</script>

<style>
.booksPhoto {
  cursor: pointer;
  margin: 1%;
  height: 17vh;
  width: 15vw;
  position: relative;
  border-radius: 10px;
  -webkit-box-shadow: 0 1px 12px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 1px 12px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.1);
  outline: 1px solid #000;
  border: 4px solid #fff;
  background: rgba(0, 0, 0, 0.5);
}
</style>