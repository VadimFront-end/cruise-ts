import Vue from 'vue'
import Vuex from 'vuex'
import IStore from './interfaces'
import { book } from '@/constants'

Vue.use(Vuex);

const store = new Vuex.Store<IStore>({
    state: {
        book,
        pageIndex: localStorage.getItem('way') ? +localStorage.getItem('way') : 0,
        audio: new Audio(localStorage.getItem('audio') === null ? '../assets/audio/read/8read.mp3' : localStorage.getItem('audio')),
        playAudio: false
    },
    mutations: {
        changeIndexBook(state, newIndex) {
            state.pageIndex = newIndex;
        },
        startMusic(state, music) {
            state.playAudio = false;
            state.audio.pause();
            if (music)
                state.audio.src = require('../assets/' + music);
            else {
                state.audio.src = require('../assets/audio/read/8read.mp3');
                return;
            }
            localStorage.setItem('audio', state.audio.src);
            state.playAudio = true;
            state.audio.play();
        },
        playMusic(state) {
            if (state.playAudio) state.audio.pause();
            else state.audio.play();
            state.playAudio = !state.playAudio;
        }
    },
    getters: {
        GET_PAGE_INDEX(state) {
            return state.pageIndex;
        }
    }
});

export default store;
