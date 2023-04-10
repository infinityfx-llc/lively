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

    computeDifference(to: CacheData[], from = this.data) {
        const keyframes: PropertyIndexedKeyframes[][] = new Array(to.length);

        for (let i = 0; i < to.length; i++) {
            if (!from[i]) {
                keyframes[i] = [];

                continue;
            }

            keyframes[i] = [
                {
                    translate: [`${from[i].x - to[i].x}px ${from[i].y - to[i].y}px`, '0px 0px'],
                    scale: [from[i].width / to[i].width, from[i].height / to[i].height]
                },
                {}
            ];

            for (const key of ['borderRadius', 'backgroundColor', 'color', 'rotate', 'opacity']) {
                keyframes[i][1][key] = [from[i][key as never], to[i][key as never]];
            }
        }

        return keyframes;
    }

}