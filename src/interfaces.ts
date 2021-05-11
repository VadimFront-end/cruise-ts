export interface ICruiseBook {
    booksOpacity: boolean,
    imageCities: string[],
    pageObject: IBookData,
    page: number,
    isShowPhoto: boolean,
    openedPhoto: IOpenedPhoto,
    openedBox: IOpenedBox,
    openedBox1: IOpenedBox,
    openBook: boolean,
    width: number
}

export interface ICruseBookPage {
    pageObject: IBookData,
    xk: number,
    yk: number
}

export interface ICruiseMap {
    OX: number[],
    OY: number[],
    imageCities: string[],
    backgroundImage: string,
    point: number,
    cities: string[],
    dots: Element[],
    ctx: CanvasRenderingContext2D | null,
    clientWidth: number,
    clientHeight: number,
    compass: boolean,
    smallBook: string,
    selectedPage: number,
    openMap: boolean,
    block: boolean
}

export interface IOpenedPhoto {
    photo: string,
    vert: boolean
}

export interface IOpenedBox {
    appear: string[] | string,
    iLR?: number,
    check: boolean
}

export interface IBookData {
    text1: string,
    text2?: string,
    text3?: string,
    text4?: string,
    vert?: boolean[],
    map?: boolean,
    box?: boolean,
    video?: string,
    main?: string,
    images?: string[],
    boxImg?: string[],
    audio?: string
}
