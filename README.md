# Lively

[![NPM package](https://img.shields.io/npm/v/@infinityfx/lively)](https://www.npmjs.com/package/@infinityfx/lively)
![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@infinityfx/lively)
![Last commit](https://img.shields.io/github/last-commit/infinityfx-llc/lively)
![NPM weekly downloads](https://img.shields.io/npm/dw/@infinityfx/lively)
![NPM downloads](https://img.shields.io/npm/dt/@infinityfx/lively)

Feature complete, lightweight react animation library. Lively lets u create performant animations without the hassle.

## Table of contents
- [Get started](#get-started)
    - [Installation](#installation)
    - [Usage](#usage)
- [Base components](#base-components)
    - [Animatable](#animatable-animatable)
    - [Morph](#morph-morph)
- [Reactivity](#reactivity)
- [Auto-animation](#auto-animation)
    - [Animate `<Animate />`](#animate-animate)
    - [Parallax `<Parallax />`](#parallax-parallax)
    - [`WriteOn <WriteOn />`](#writeon-writeon)
    - [`ColorWipe <ColorWipe />`](#colorwipe-colorwipe)
- [Animations](#animations)
    - [Overview](#overview)
    - [Create your own](#create-your-own)
- [Hooks](#hooks)
    - [useUnmount](#useunmount)
    - [useAnimation](#useanimation)
    - [useScroll](#usescroll)

## Get started

### Installation

```sh
$ npm i @infinityfx/lively
```

### Usage

```jsx
import { Animate } from '@infinityfx/lively/animate';

...

<Animate onMount>
    <div class="my-class">
        Lorem ipsum enim amet consequat ut reprehenderit cupidatat et incididunt qui minim culpa. Dolor do laborum nulla pariatur tempor excepteur duis et ipsum.
    </div>
</Animate>
```

## Base components

### Animatable `<Animatable />`

Base animation component that allows for fully customizable animations.

```jsx
import { Animatable } from '@infinityfx/lively';

...

<Animatable
    onMount
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}>
    <div>...</div>
</Animatable>
```

### Morph `<Morph />`

Morphs one element into another.

```jsx
import { Morph } from '@infinityfx/lively';

...

<Morph active={state}>
    <div onClick={() => setState(!state)}>
        ...
    </div>
</Morph>

<Morph active={!state}>
    <div onClick={() => setState(!state)}>
        ...
    </div>
</Morph>
```

## Reactivity

Lively implements fully reactive animations using the [`useAnimation()`](#useanimation) and [`useScroll()`](#usescroll) hooks.

## Auto-animation

### Animate `<Animate />`

Fully automatic animation based on pre-fab animations.

```jsx
import { Animate } from '@infinityfx/lively/animate';
import { Scale, Fade } from '@infinityfx/lively/animations';

...

<Animate onMount animations={[Scale({ useLayout: true }), Fade]}>
    <div class="my-class">
        ...
    </div>
</Animate>
```

#### Parallax `<Parallax />`

Easily create parallax motion based on page scroll position.

```jsx
import { Parallax } from '@infinityfx/lively/animate';

...

<Parallax amount={0.5}> // default amount = 0.5
    <div class="my-class">
        ...
    </div>
</Parallax>
```

### WriteOn `<WriteOn />`

```jsx
import { WriteOn } from '@infinityfx/lively/animate';

...

<WriteOn>Lorem ipsum dolor sit amet</WriteOn>
```

### ColorWipe `<ColorWipe />`

```jsx
import { ColorWipe } from '@infinityfx/lively/animate';

...

<ColorWipe>
    <div class="my-class">...</div>
</ColorWipe>
```

## Animations

### Overview

Lively exports a submodule called animations which contains various pre-fab animations that can be used in tandem with the `<Animate />` and `<Animatable />` components. These animations can be used as is, or can be configured with extra options by calling the respective animation as a function which takes as an argument the options object.

```jsx
import { Move } from '@infinityfx/lively/animations';

// configure the animation
Move({ direction: 'down' }); // default = 'up'
```

These pre-fab can be used as followed with either an `<Animate />` or `<Animatable />` component:

```jsx
import { Move } from '@infinityfx/lively/animations';
import { Animate } from '@infinityfx/lively/animate';

...

<Animate animations={[Move, Move({ ... })]}>...</Animate>
```

```jsx
import { Move } from '@infinityfx/lively/animations';
import { Animatable } from '@infinityfx/lively';

...

<Animatable animations={{
    myAnimationName: Move,
    myOtherAnimation: Move({ ... })
}}>...</Animatable>

// or

<Animatable animate={Move}>...</Animatable>
```

### Create your own

If you whish to create your own pre-fab animation, you can do so using the `.create()` method of the Animation class. This method takes a function which gets the animation configuration options passed as an argument. The function must return the animation properties/keyframes.

```js
import { Animation } from '@infinityfx/lively/animations';

const myCustomAnimation = Animation.create((options) => {

    // do whatever you want here.

    // This function must return an Array with 2 Objects, containing the animation properties and/or keyframes and the initial values for the animation respectively.
    return [{ ... }, { ... }];
});

export default myCustomAnimation;
```

## Hooks

Lively comes with a set of hooks that allow for the creation of complex reactive animations.

### useUnmount

The useUnmount hook can be used to animate out components that are being unmounted. It can be used in tandem with the `<Animatable />` and `<Animate />` components.

```jsx
import { useUnmount } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';

export default function Page() {

    const [mounted, setMounted, ref] = useUnmount(true /* initial mounted value */);

    return mounted &&
        <Animatable ref={ref} onMount onUnmount>...</Animatable>;

}
```

### useAnimation

The useAnimation hook can be used to create a reactive value, which can be linked to animation components to animate different properties based on the value.

```jsx
import { useEffect } from 'react';
import { useAnimation } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';

export default function Page() {

    const [value, setValue] = useAnimation(0 /* initial value */);

    useEffect(() => {
        setTimeout(() => setValue(1), 1000); // set the animation value to 1, 1 second after the component has mounted.
    }, []);

    return <Animatable animate={{
        opacity: value
    }}>...</Animatable>;

}
```

Additionally you can provide an animation value with a function to transform the value to a more usable format for certain animation properties.

```jsx
const [value, setValue] = useAnimation(0 /* initial value */);

return <Animatable animate={{
    position: value(input => {
        input /= 100; // example where the input value needs to be divided for the correct output format.

        return { x: input, y: input }; // we return an object instead of a number for the position property.
    })
}}>...</Animatable>;
```

### useScroll

The useScroll hook is an extension of the useAnimation hook which returns a reactive value that gives the current scroll position of the window.

```jsx
const value = useScroll();

return <Animatable animate={{
    opacity: value(val => val / document.body.scrollHeight) // gradually fade in element when scrolling the window
}}>...</Animatable>;
```