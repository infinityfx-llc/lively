export default class Action {

    element: HTMLElement;
    computed: CSSStyleDeclaration;
    animation: Animation;
    paused: boolean = false;
    deform: boolean = true;
    onfinish: (() => void) | null = null;

    constructor(element: HTMLElement, keyframes: Keyframe[], config: KeyframeAnimationOptions) {
        this.element = element;
        this.computed = getComputedStyle(element);
        this.animation = element.animate(keyframes, config);
        this.animation.commitStyles();
        this.animation.onfinish = () => this.onfinish?.();
    }

    correct() {
        this.deform = false;
    }

    decomposeScale(val: string | number) {
        const [xString, yString] = val.toString().split(' ');

        let x = parseFloat(xString);
        if (/%$/.test(xString)) x /= 100;

        let y = yString ? parseFloat(yString) : x;
        if (/%$/.test(yString)) y /= 100;

        return [x, y];
    }

    parseRadius() { // doesnt work with animating border radius currently
        if ('cachedBorderRadius' in this.element) return this.element.cachedBorderRadius as number;
        
        const [radius] = this.computed.borderRadius.toString().split(' ');
        return (this.element as any).cachedBorderRadius = parseFloat(radius) || 0;
    }

    step() {
        if (this.deform || this.paused) return;

        const [x, y] = this.decomposeScale(this.computed.scale);
        const radius = this.parseRadius();

        this.element.style.borderRadius = `${radius / x}px / ${radius / y}px`;

        for (let i = 0; i < this.element.children.length; i++) {
            const child = this.element.children[i] as HTMLElement;

            child.style.transform = `scale(${1 / x}, ${1 / y})`;
        }
    }

    play() {
        this.animation.play();
        this.paused = false;
    }

    pause() {
        this.animation.pause();
        this.paused = true;
    }

    remove() {
        this.animation.cancel();
    }

}