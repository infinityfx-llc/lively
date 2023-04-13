# Lively

[![NPM package](https://img.shields.io/npm/v/@infinityfx/lively)](https://www.npmjs.com/package/@infinityfx/lively)
[![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@infinityfx/lively)](https://bundlephobia.com/package/@infinityfx/lively)
[![Last commit](https://img.shields.io/github/last-commit/infinityfx-llc/lively)](https://github.com/infinityfx-llc/lively)
![NPM weekly downloads](https://img.shields.io/npm/dw/@infinityfx/lively)
![NPM downloads](https://img.shields.io/npm/dt/@infinityfx/lively)

Feature complete, lightweight react animation library. Lively lets u create complex animations without the hassle.

## Table of contents
- [Get started](#get-started)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Defining animations](#defining-animations)
- [Components](#components)
    - [Animatable `<Animatable />`](#animatable-animatable)
    - [Animate `<Animate />`](#animate-animate)
    - [LayoutGroup `<LayoutGroup />`](#layoutgroup-layoutgroup)
    - [Morph `<Morph />`](#morph-morph)
- [Hooks](#hooks)
    - [`useLink()`](#uselink)
    - [`useScroll()`](#usescroll)
    - [`usePath()`](#usepath)
    - [`useAudio()`](#useaudio)
    - [`useReducedMotion()`](#usereducedmotion)
- [Animations](#animations)
    - [Bundled](#bundled)
    - [Creating clips](#creating-clips)

# Get started

## Installation

```sh
$ npm i @infinityfx/lively
```

## Usage

```jsx
import { Animatable } from '@infinityfx/lively';

...

<Animatable onMount initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div class="my-class">
        Lorem ipsum enim amet consequat ut reprehenderit cupidatat et incididunt qui minim culpa. Dolor do laborum nulla pariatur tempor excepteur duis et ipsum.
    </div>
</Animatable>
```

## Defining animations

The `<Animatable>` component exposes the `animate` and `animations` properties which can be used to define animatable properties, as well as animation options. Animatable properties can accept single values, arrays, functions and [reactive links](#uselink) as arguments.

```jsx
<Animatable
    animate={{
        opacity: 1,
        scale: ['0 0', '0.5 0', '1 1'],
        borderRadius: (progress) => progress * 10,
        duration: 2, // Animation will last 2 seconds
        immediate: true // Animation will override any currently playing animation
    }}
    animations={{
        myAnimation: {
            opacity: [0, 1, 0.5]
        }
    }}>
    ...
</Animatable>
```

# Components

## Animatable `<Animatable />`

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

## Animate `<Animate />`

Fully automated animations based on animation clips.

```jsx
import { Animate } from '@infinityfx/lively';
import { Scale, Fade } from '@infinityfx/lively/animations';

...

<Animate onMount animations={[Scale.unique({ duration: 2 }), Fade]}>
    <div class="my-class">
        ...
    </div>
</Animate>
```

## LayoutGroup `<LayoutGroup />`

Allows for animating direct `<Animatable />` and `<Animate />` child components, when their layout changes or the our unmounted. This requires the respective child components to have a key specified.

```jsx
import { Animatable } from '@infinityfx/lively';
import { LayoutGroup } from '@infinityfx/lively/layout';

...

<LayoutGroup>
    <Animatable key="mykey" onUnmount animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        <div class="my-class">
            Hello world!
        </div>
    </Animatable>
</LayoutGroup>
```

## Morph `<Morph />`

Morphs one element into another.

```jsx
import { useState } from 'react';
import { Morph } from '@infinityfx/lively/layout';

...

const [state, setState] = useState(false);

...

<Morph id="mymorph" shown={state}>
    <div onClick={() => setState(!state)}>
        ...
    </div>
</Morph>

<Morph id="mymorph" shown={!state} transition={{ duration: 0.5 }}>
    <div onClick={() => setState(!state)}>
        ...
    </div>
</Morph>
```

# Hooks

Lively comes with a set of hooks that allow for the creation of complex reactive animations.

## `useLink()`

The useLink hook can be used to create a reactive value, which can be linked to animation components to animate different properties based on the value.

```jsx
import { useEffect } from 'react';
import { useLink } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';

export default function Page() {

    const [link, setValue] = useLink(0 /* initial value */);

    useEffect(() => {
        setTimeout(() => setValue(1), 1000); // set the animation value to 1, 1 second after the component has mounted.
    }, []);

    return <Animatable animate={{
        opacity: link
    }}>...</Animatable>;

}
```

Additionally you can provide a link with a function to transform the value to a more usable format for certain animation properties.

```jsx
const [link, setValue] = useLink(0 /* initial value */);

...

<Animatable animate={{
    translate: link(input => {
        return `${input} ${input}`; // we return a string instead of a number for the translate property.
    })
}}>...</Animatable>;
```

## `useScroll()`

The `useScroll` hook returns a reactive link that corresponds to the current scroll position of the window.

```jsx
const value = useScroll();

...

// gradually fade in element when scrolling the window
<Animatable animate={{
    opacity: value(val => val / document.body.scrollHeight)
}}>...</Animatable>;
```

## `usePath()`

The `usePath` hook can be used to animate an element along an SVG path.

```jsx
const [link, ref] = usePath();

...

<>
    <Animatable animate={{
        translate: link(([x, y]) => `${x} ${y}`)
    }}>...</Animatable>

    <svg>
        <path ref={ref} d="..." />
    </svg>
</>;
```

## `useAudio()`

The `useAudio` hook can be used to create animations that react to the frequency response of playing audio.

```jsx
const source = useRef();
const link = useAudio(source.current, { bands: 8 });

...

<>
    <Animatable animate={{
        scale: link((values, i) => `1 ${values[i]}`)
    }}>...</Animatable>

    <audio ref={source} src="myaudio.mp3">
</>;
```

## `useReducedMotion()`

The `useReducedMotion` hook checks whether a user prefers the use of reduced motion on a page.

```jsx
const reduced = useReducedMotion();

...

// If the user prefers reduced motion, then pause the animation.
<Animatable animate={{ ... }} paused={reduced}>...</Animatable>;
```

# Animations

## Bundled

Lively exports a submodule called animations which contains various animation clips that can be used in tandem with the `<Animate />` and `<Animatable />` components. These animations can be used as is, or can be configured by calling `.unique()` on the respective animation.

```jsx
import { Move, Scale } from '@infinityfx/lively/animations';
import { Animate } from '@infinityfx/lively/auto';
import { Animatable } from '@infinityfx/lively';

...

const myClip = Move.unique({ duration: 2 }); // configure the animation

...

<>
    <Animate animations={[myClip]}>...</Animate>

    <Animatable animations={{
        myAnimation: Scale,
        myOtherAnimation: Scale.unique({ delay: 1 })
    }}>...</Animatable>
</>
```

## Creating clips

If you whish to create your own animation clip to reuse later on, you can do so using `new Clip()`. This constructor takes 2 arguments, some animation properties and some optional initial values.

```js
import { Clip } from '@infinityfx/lively/animations';

const myCustomAnimation = new Clip(
    {
        opacity: 1, // value to animate to
        duration: 2 // Clip will have a duration of 2 seconds
    },
    {
        opacity: 0 // initial value
    }
);

export default myCustomAnimation;
```