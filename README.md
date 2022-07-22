# Lively

[![NPM package](https://img.shields.io/npm/v/@infinityfx/lively)](https://www.npmjs.com/package/@infinityfx/lively)
![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@infinityfx/lively)
![Last commit](https://img.shields.io/github/last-commit/infinityfx-llc/lively)
![NPM weekly downloads](https://img.shields.io/npm/dw/@infinityfx/lively)
![NPM downloads](https://img.shields.io/npm/dt/@infinityfx/lively)

Lightweight, zero-configuration react animation library.

## Table of contents
- [Get started](#get-started)
    - [Installation](#installation)
    - [Usage](#usage)
- [Base components](#base-components)
    - [Animatable](#animatable-animatable)
    - [Morph](#morph-morph)
- [Auto-animation](#auto-animation)
    - [Animate `<Animate />`](#animate-animate)
    - [`WriteOn <WriteOn />`](#writeon-writeon)
    - [`ColorWipe <ColorWipe />`](#colorwipe-colorwipe)
- [Animations](#animations)
    - [Overview](#overview)
    - [Create your own](#create-your-own)
- [Hooks](#hooks)
    - [useUnmount](#useunmount)

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
        Lorem ipsum enim amet consequat ut reprehenderit cupidatat et incididunt qui minim culpa. Dolor do laborum nulla pariatur tempor excepteur duis et ipsum. Eu commodo et esse exercitation laborum cupidatat incididunt elit reprehenderit id.
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

## Auto-animation

### Animate `<Animate />`

Automatic animation based on pre-fab animations.

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

Lively exports a submodule called animations which contains various pre-fab animations that can be used in tandem with the `<Animate />` component. These animations can be used as is, or can be configured with extra options by calling the respective animation as a function which takes as an argument the options object.

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

If you whish to create your own pre-fab animation, you can do so by creating a function with the static method `use` attached to it. Furthmore adding support for extra configuration options, leads to the following structure:

```js
import { Animation } from '@infinityfx/lively';

export default function myAnimation(options = {}) {
    myAnimation.use = myAnimation.use.bind(myAnimation, options);
    return myAnimation;
}

myAnimation.use = (options = {}) => {

    // do whatever you want here

    // A new Animation takes two arguments, an object with values/keyframes to animate to and an object of initial values.
    return new Animation({ ... }, { ... });
}
```

## Hooks

### useUnmount

The useUnmount hook can be used to animate components that are being unmounted.