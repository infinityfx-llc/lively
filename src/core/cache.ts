import Track from "./track";

type CacheData = {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius: string;
    opacity: string;
    backgroundColor: string;
    color: string;
    rotate: string;
};

export default class StyleCache {

    data: CacheData[] = [];

    get(element: HTMLElement) {
        const { x, y, width, height } = element.getBoundingClientRect();
        const { borderRadius, opacity, backgroundColor, color, rotate } = getComputedStyle(element);

        return {
            x: x - window.scrollX,
            y: y + window.scrollY,
            width,
            height,
            borderRadius,
            opacity,
            backgroundColor,
            color,
            rotate
        };
    }

    set(data: CacheData[]) {
        this.data = data;
    }

    read(tracks: Track[]): CacheData[] {
        return tracks.map(track => this.get(track.element));
    }

    update(index: number, element: HTMLElement) {
        const data = this.get(element);
        this.data[index] = data;
    }

    computeDifference(data: CacheData[]) { // multiple animation to accumulate position and such, but not color, etc..
        const keyframes: PropertyIndexedKeyframes[] = new Array(data.length);

        for (let i = 0; i < data.length; i++) {
            keyframes[i] = this.data[i] ? {
                translate: [`${this.data[i].x - data[i].x}px ${this.data[i].y - data[i].y}px`, '0px 0px'],
                scale: [this.data[i].width / data[i].width, this.data[i].height / data[i].height]
            } : {};

            if (!this.data[i]) continue;

            for (const key of ['borderRadius', 'opacity', 'backgroundColor', 'color', 'rotate']) {
                keyframes[i][key] = [this.data[i][key as never], data[i][key as never]];
            }
        }

        return keyframes;
    }

}