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
    isEmpty: boolean = true;

    read(elements: HTMLElement[]) {
        return elements.map(el => {
            const { x, y, width, height } = el.getBoundingClientRect();
            const { borderRadius, opacity, backgroundColor, color, rotate } = getComputedStyle(el);

            return {
                x,
                y,
                width,
                height,
                borderRadius,
                opacity,
                backgroundColor,
                color,
                rotate
            };
        });
    }

    update(data: CacheData[]) {
        this.data = data;
        this.isEmpty = !data.length;
    }

    computeDifference(data: CacheData[]) {
        const keyframes: PropertyIndexedKeyframes[] = new Array(data.length);

        for (let i = 0; i < data.length; i++) {
            keyframes[i] = this.data[i] ? {
                translate: [`${this.data[i].x - data[i].x}px ${this.data[i].y - data[i].y}px`, '0px 0px'],
                scale: [this.data[i].width / data[i].width, this.data[i].height / data[i].height]
            } : {
                opacity: [0, 1]
            };

            if (!this.data[i]) continue;

            for (const key of ['borderRadius', 'opacity', 'backgroundColor', 'color', 'rotate']) {
                keyframes[i][key] = [this.data[i][key as never], data[i][key as never]];
            }
        }

        return keyframes;
    }

}