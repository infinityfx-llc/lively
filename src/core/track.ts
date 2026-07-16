import { TransitionOptions } from "./animation-link";
import { AnimationOptions, ScaleCorrection } from "./animator";
import Clip, { BlendMode, ClipKey, ClipOptions } from "./clip";
import { clampLowerBound, correctForParentScale, getLocalBounds, parseIndiviualTransform, scaleCorrectRadius, scaleCorrectShadow, ScaleTuple } from "./utils";

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
    timeout: any = 0;
    correctAfterEnded = true;
    pendingCorrection: {
        transform?: string;
        borderRadius?: string;
        boxShadow?: string;
    } = {};

    constructor(element: HTMLElement | SVGElement, shouldCache: CacheKey[], align: CorrectionAlignment) {
        this.element = element;
        this.shouldCache = shouldCache;
        this.align = align;

        this.styles = getComputedStyle(element);
        this.cache = this.snapshot();
    }

    snapshot() {
        const data: StyleCache = { x: 0, y: 0, sx: 1, sy: 1 };
        if (this.element instanceof SVGElement || !this.shouldCache.length) return data;

        // @ts-expect-error
        for (const key of this.shouldCache) data[key] = this.styles[key];

        const { x, y, width, height } = getLocalBounds(this.element, false, this.align);
        data.sx = width;
        data.sy = height;
        data.x = x;
        data.y = y;

        return data;
    }

    push(clip: Clip, options: AnimationOptions = {}, onEnded?: () => void) {
        const { commit, blendmode, endframe, ...config } = clip.getConfig(options);
        const animation = this.element.animate(clip.keyframes, config) as TrackAnimation;
        animation.name = options.tag;
        animation.blendmode = blendmode;

        animation.finished.then(() => {
            try {
                if (commit) Object.assign(this.element.style, endframe);
            } catch { } finally {
                animation.cancel();
                this.advance();
                onEnded?.();
            }
        }).catch(() => { });

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
        this.active = this.animations.filter(animation => {
            animation.play();

            return animation.blendmode === 'none';
        }).length;

        this.correctAfterEnded = true;
    }

    transition(from = this.cache, options: TransitionOptions = {}) { // TODO: translate/scale transition will have mismatches when parent scale correction is applied?
        this.clear('layout-transition');

        const data = this.snapshot();
        const keyframes: ClipOptions = { composite: 'override', ...options };
        const s = [1, 1], t = [0, 0];

        for (const key of this.shouldCache) {
            switch (key) {
                case 'x':
                case 'y':
                    t[key === 'x' ? 0 : 1] = from[key] - data[key];
                    break;
                case 'sx':
                case 'sy':
                    s[key === 'sx' ? 0 : 1] = from[key] / clampLowerBound(data[key]);
                    break;
                default:
                    keyframes[key] = [from[key]!, data[key]!];
            }
        }

        const translate = t.map(num => `${num}px`).join(' ');
        const scale = s.join(' ');

        [
            new Clip(keyframes),
            new Clip({
                scale: scale === '1 1' ? [] : [scale, null], // use transform instead?
                translate: translate === '0px 0px' ? [] : [translate, null], // use transform instead?
                composite: 'combine',
                ...options
            })
        ]
            .filter(clip => !clip.isEmpty)
            .forEach(clip => this.push(clip, { commit: false, tag: 'layout-transition' }));

        this.cache = data;
    }

    clear(animation?: string) {
        this.animations.forEach(entry => {
            if (entry.name === 'animation-link' ||
                (animation && entry.name !== animation)) return;

            entry.cancel();
        });

        this.correctionAnimation?.cancel();
        this.element.style.transform = '';

        this.animations = this.animations.filter(animation => animation.playState === 'running');
        this.active = this.animations.filter(animation => animation.blendmode === 'none').length;
    }

    toggle(paused: boolean) {
        this.animations.forEach(animation => animation[paused ? 'pause' : 'play']());
    }

    prepareCorrect(mode: ScaleCorrection) {
        if (mode === 'none' || this.element instanceof SVGElement) return;

        if (mode === 'both' || mode === 'parent') { // todo: correction = 'all'
            this.pendingCorrection.transform = correctForParentScale(
                this.element,
                parseIndiviualTransform(this.styles.translate),
                parseIndiviualTransform(this.styles.scale, 1),
                this.align
            );
        }

        if (this.animations.length || this.correctAfterEnded) {
            this.correctAfterEnded = false;
            this.scale = getLocalBounds(this.element, true).scale;

            this.pendingCorrection.borderRadius = scaleCorrectRadius(this.styles.borderRadius, this.scale);
            this.pendingCorrection.boxShadow = scaleCorrectShadow(this.styles.boxShadow, this.scale);
        }
    }

    correct() {
        if (this.pendingCorrection.transform !== undefined && this.element.style.transform !== this.pendingCorrection.transform) {
            this.element.style.transform = this.pendingCorrection.transform;
        }

        if (this.pendingCorrection.borderRadius !== undefined && (
            this.pendingCorrection.borderRadius !== this.styles.borderRadius ||
            this.pendingCorrection.boxShadow !== this.styles.boxShadow)) {

            this.correctionAnimation = this.element.animate({
                borderRadius: this.pendingCorrection.borderRadius,
                boxShadow: this.pendingCorrection.boxShadow
            }, {
                duration: 0,
                fill: 'forwards'
            });
        }

        this.pendingCorrection = {};
    }

}