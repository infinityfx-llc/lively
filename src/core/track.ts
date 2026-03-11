import { TransitionOptions } from "./animation-link";
import { AnimationOptions } from "./animator";
import Clip, { BlendMode, ClipKey, ClipOptions } from "./clip";
import { clampLowerBound, scaleCorrectRadius, scaleCorrectShadow, ScaleTuple } from "./utils";

export type CacheKey = Exclude<ClipKey, 'scale' | 'translate'> | 'x' | 'y' | 'sx' | 'sy';

export type StyleCache = {
    [key in Exclude<CacheKey, 'x' | 'y' | 'sx' | 'sy'>]?: string;
} & {
    x: number;
    y: number;
    sx: number;
    sy: number;
};

export type TrackAnimation = Animation & {
    name?: string;
    blendmode: BlendMode;
};

export default class Track {

    element: HTMLElement | SVGElement;
    shouldCache: CacheKey[];
    styles: CSSStyleDeclaration;
    cache: StyleCache;
    scale: ScaleTuple = [1, 1];
    corrected: {
        borderRadius: string;
        boxShadow: string;
    };
    correctionAnimation: Animation | null = null;
    queue: TrackAnimation[] = [];
    animations: TrackAnimation[] = [];
    active = 0;

    constructor(element: HTMLElement | SVGElement, shouldCache: CacheKey[]) {
        this.element = element;
        this.shouldCache = shouldCache;

        this.styles = getComputedStyle(element);
        this.cache = this.snapshot();
        this.corrected = {
            borderRadius: this.styles.borderRadius,
            boxShadow: this.styles.boxShadow
        };
    }

    snapshot() {
        const data: StyleCache = { x: 0, y: 0, sx: 1, sy: 1 };
        if (this.element instanceof SVGElement) return data;

        // @ts-expect-error
        for (const key of this.shouldCache) data[key] = this.styles[key];

        const { width, height, x, y } = this.element.getBoundingClientRect();
        data.sx = width;
        data.sy = height;
        data.x = x + width / 2;
        data.y = y + height / 2;

        let parent: HTMLElement | null = this.element;
        while (parent = parent?.parentElement) { // <- check if method takes into window scroll position
            if (parent.dataset.lively) {
                const { x, y } = parent.getBoundingClientRect(); // also compensate width/height?
                data.x -= x;
                data.y -= y;

                break;
            }
        }

        return data;
    }

    push(clip: Clip, options: AnimationOptions = {}, onEnded?: () => void) {
        const { commit, blendmode, ...config } = clip.getConfig(options);
        const animation = this.element.animate(clip.keyframes, config) as TrackAnimation;
        animation.name = options.tag;
        animation.blendmode = blendmode;

        animation.onfinish = () => {
            try {
                if (commit) animation.commitStyles();
            } catch { } finally {
                animation.cancel();
                this.advance();
                onEnded?.();
            }
        };

        if (this.active && blendmode === 'none') {
            animation.pause();
            this.queue.push(animation);

            return 0;
        } else {
            this.animations.push(animation);
            if (blendmode === 'none') this.active++;

            return (config.duration * config.iterations + config.delay) / 1000;
        }
    }

    advance() {
        if (--this.active > 0) return;

        this.animations = this.animations.filter(animation => animation.playState === 'running');
        this.animations.push(...this.queue.splice(0, 1));
        this.active = this.animations.filter(animation => animation.blendmode === 'none').length;

        if (!this.animations.length) this.correct();
    }

    transition(from = this.cache, options: TransitionOptions = {}) {
        const data = this.snapshot();
        const keyframes: ClipOptions = options;
        const scale = [1, 1], translate = [0, 0];

        for (const key of this.shouldCache) {
            switch (key) {
                case 'x':
                case 'y':
                    translate[key === 'x' ? 0 : 1] = from[key] - data[key];
                    break;
                case 'sx':
                case 'sy':
                    scale[key === 'sx' ? 0 : 1] = from[key] / clampLowerBound(data[key]);
                    break;
                case 'borderRadius':
                case 'boxShadow':
                    keyframes[key] = [from[key]!, data[key]!];
                    break;
                default:
                    keyframes[key] = [from[key]!, null];
            }
        }

        keyframes.scale = [scale.join(' '), null];
        keyframes.translate = [translate.map(num => `${num}px`).join(' '), null];
        const clip = new Clip(keyframes);

        if (clip.isEmpty) return;

        this.cache = data;
        this.push(clip, {
            commit: false,
            composite: 'override'
        });
    }

    clear(animation?: string) {
        if (!this.active) return;

        this.animations.forEach(entry => {
            if (animation && entry.name !== animation) return;

            entry.onfinish = null;

            try {
                entry.finish();
            } catch {
                entry.cancel();
            }
        });

        this.animations = this.animations.filter(animation => animation.playState === 'running');
        this.active = this.animations.filter(animation => animation.blendmode === 'none').length;
    }

    toggle(paused: boolean) {
        this.animations.forEach(animation => animation[paused ? 'pause' : 'play']());
    }

    correct() {
        for (let i = 0; i < this.element.children.length; i++) {
            const child = this.element.children[i] as HTMLElement;
            const l = child.offsetLeft,
                t = child.offsetTop,
                w = child.offsetWidth,
                h = child.offsetHeight;

            const [x, y] = this.scale;
            const [tx, ty] = getComputedStyle(child).translate.split(' ').map(parseFloat);

            child.style.transform = `translate(${-tx || 0}px, ${-ty || 0}px) scale(${1 / x}, ${1 / y}) translate(${l * (1 - x) + w / 2 * (1 - x) + (tx || 0)}px, ${t * (1 - y) + h / 2 * (1 - y) + (ty || 0)}px)`;
        } // ^ improve child correction implementation

        if (this.element instanceof SVGElement ||
            (this.styles.borderRadius === '0px' &&
                this.styles.boxShadow === 'none')) return;

        this.correctionAnimation?.cancel();
        const previousRadiusScale: ScaleTuple = this.styles.borderRadius !== this.corrected.borderRadius ? [1, 1] : this.scale;
        const previousShadowScale: ScaleTuple = this.styles.boxShadow !== this.corrected.boxShadow ? [1, 1] : this.scale;

        const { width, height } = this.element.getBoundingClientRect();
        this.scale = [
            width / clampLowerBound(this.element.offsetWidth),
            height / clampLowerBound(this.element.offsetHeight)
        ];

        this.corrected = {
            borderRadius: scaleCorrectRadius(this.styles.borderRadius, this.scale, previousRadiusScale),
            boxShadow: scaleCorrectShadow(this.styles.boxShadow, this.scale, previousShadowScale)
        };
        this.correctionAnimation = this.element.animate(this.corrected, {
            duration: 0,
            fill: 'forwards'
        });
    }

}