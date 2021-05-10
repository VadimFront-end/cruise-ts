import { IBookData } from "@/interfaces";

export default interface IStore {
    book: IBookData[],
    imgCities: string[],
    pageIndex: number,
    audio: HTMLAudioElement,
    playAudio: boolean
}