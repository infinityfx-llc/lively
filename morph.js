import Animatable from './animatable';
import Animation from './animation';
import AnimationQueue from './queue';

export default class Morph extends Animatable {

    constructor(props) {
        super(props);

        this.animations.morphs = [];
    }

    componentDidMount() {
        const element = this.elements[0];
        if (!element) return;

        Animation.setInitial(element);
        element.setAttribute('uitools-morph-id', this.props.id);
        element.setAttribute('uitools-morph-active', this.props.active);
        this.self = element;
        this.createResetAnimation();

        AnimationQueue.delay(() => {
            const targets = document.querySelectorAll(`[uitools-morph-id="${this.props.id}"]`);

            for (let i = 0; i < targets.length; i++) {
                if (targets[i] === element) continue;

                this.createMorphAnimation(targets[i], i);
                if (targets[i].getAttribute('uitools-morph-active') !== 'true') this.animations.transition.setInitialStyles(targets[i]);
            }
        }, 0.001);
    }

    componentDidUpdate() {
        const active = this.self.getAttribute('uitools-morph-active') === 'true';
        this.self.setAttribute('uitools-morph-active', this.props.active);

        AnimationQueue.delay(() => {
            if (this.props.active && !active) {
                this.animations.transition.setInitialStyles(this.self);
                this.animations.transition.play(this.self);
            } else
                if (!this.props.active && active) {

                    let index = 0;
                    
                    const targets = document.querySelectorAll(`[uitools-morph-id="${this.props.id}"]`);
                    for (let i = 0; i < targets.length; i++) {
                        if (targets[i] === this.self) continue;
            
                        if (targets[i].getAttribute('uitools-morph-active') === 'true') {
                            index = i;
                            break;
                        }
                    }

                    this.animations.morphs[index].play(this.self);
                }
        }, 0.001);
    }

    createResetAnimation() {
        const a = this.self.UITools?.initialStyles;

        this.animations.transition = Animation.from({
            opacity: [0, 0, 1],
            scale: { x: 1, y: 1 },
            position: { x: 0, y: 0 },
            borderRadius: a.borderRadius
        }, {}, this.scaleCorrection);
    }

    createMorphAnimation(target, index) {
        const a = this.self.UITools?.initialStyles;
        const b = target.UITools?.initialStyles;

        this.animations.morphs[index] = Animation.from({
            position: [
                { x: 0, y: 0 },
                {
                    x: b.x - a.x + (b.clientWidth - a.clientWidth) / 2,
                    y: b.y - a.y + (b.clientHeight - a.clientHeight) / 2,
                },
                {
                    x: b.x - a.x + (b.clientWidth - a.clientWidth) / 2,
                    y: b.y - a.y + (b.clientHeight - a.clientHeight) / 2,
                }
            ],
            scale: [
                { x: 1, y: 1 },
                {
                    x: b.clientWidth / a.clientWidth,
                    y: b.clientHeight / a.clientHeight,
                },
                {
                    x: b.clientWidth / a.clientWidth,
                    y: b.clientHeight / a.clientHeight,
                }
            ],
            opacity: [1, 1, 0],
            borderRadius: [a.borderRadius, b.borderRadius, b.borderRadius]
        }, {}, this.scaleCorrection);
    }

    static defaultProps = {
        id: 0,
        active: false,
        scaleCorrection: false
    }

}