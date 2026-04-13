import { TransitionOptions } from "./animation-link";
import { AnimationOptions } from "./animator";
import Clip, { BlendMode, ClipKey, ClipOptions } from "./clip";
import { clampLowerBound, correctForParentScale, getElementBounds, scaleCorrectRadius, scaleCorrectShadow, ScaleTuple } from "./utils";

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

export type CorrectionAlignment = {
    x: 'left' | 'center' | 'right';
    y: 'top' | 'center' | 'bottom';
};

export default class Track {

    element: HTMLElement | SVGElement;
    shouldCache: CacheKey[];
    align: CorrectionAlignment;
    styles: CSSStyleDeclaration;
    cache: StyleCache;
    scale: ScaleTuple = [1, 1];
    correctionAnimation: Animation | null = null;
    queue: TrackAnimation[] = [];
    animations: TrackAnimation[] = [];
    active = 0;
    timeout = 0;
    correctAfterEnded = true;

    constructor(element: HTMLElement | SVGElement, shouldCache: CacheKey[], align: CorrectionAlignment) {
        this.element = element;
        this.shouldCache = shouldCache;
        this.align = align;

        this.styles = getComputedStyle(element);
        this.cache = this.snapshot();
        this.correct();
    }

    snapshot() {
        const data: StyleCache = { x: 0, y: 0, sx: 1, sy: 1 };
        if (this.element instanceof SVGElement) return data;

        // @ts-expect-error
        for (const key of this.shouldCache) data[key] = this.styles[key];

        const { x, y, width, height } = getElementBounds(this.element);
        data.sx = width;
        data.sy = height;
        data.x = x;
        data.y = y;

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
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.cache = this.snapshot(), 1 / 120);

        if (--this.active > 0) return;

        this.animations = this.animations.filter(animation => animation.playState === 'running');
        this.animations.push(...this.queue.splice(0, 1));
        this.active = this.animations.filter(animation => animation.blendmode === 'none').length;

        this.correctAfterEnded = true;
    }

    transition(from = this.cache, options: TransitionOptions = {}) {
        this.clear('layout-transition'); // testing
        
        const data = this.snapshot();
        const keyframes: ClipOptions = { composite: 'override', ...options };
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
                default:
                    keyframes[key] = [from[key]!, data[key]!];
            }
        }

        [
            new Clip(keyframes),
            new Clip({
                scale: [scale.join(' '), null], // use transform instead?
                translate: [translate.map(num => `${num}px`).join(' '), null], // use transform instead?
                composite: 'combine', // test if combine or override works better
                ...options
            })
        ]
            .filter(clip => !clip.isEmpty)
            .forEach(clip => this.push(clip, { commit: false, tag: 'layout-transition' }));

        this.cache = data;
    }

    clear(animation?: string) {
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
        if (this.element instanceof SVGElement) return;

        const offset: any = (/none|0px/.test(this.styles.translate) ? '0 0' : this.styles.translate).split(' ').map(parseFloat);
        correctForParentScale(this.element, offset, this.align);

        if (!this.animations.length && !this.correctAfterEnded) return;
        this.correctAfterEnded = false;

        this.correctionAnimation?.cancel();
        this.scale = getElementBounds(this.element, true).scale;

        const corrected = {
            borderRadius: scaleCorrectRadius(this.styles.borderRadius, this.scale),
            boxShadow: scaleCorrectShadow(this.styles.boxShadow, this.scale)
        };

        if (corrected.borderRadius !== this.styles.borderRadius ||
            corrected.boxShadow !== this.styles.boxShadow) this.correctionAnimation = this.element.animate(corrected, {
                duration: 0,
                fill: 'forwards'
            });
    }

}