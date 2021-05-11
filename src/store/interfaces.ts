import { IBookData } from "@/interfaces";

export default interface IStore {
    book: IBookData[],
    pageIndex: number,
    audio: HTMLAudioElement,
    playAudio: boolean
}
