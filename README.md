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
- [Components](#components)
    - [Animatable](#animatable)
    - [Animate](#animate)
    - [Morph](#morph)
- [Build-in animations](#build-in-animations)
    - [`<WriteOn />`](#writeon)
    - [`<ColorWipe />`](#colorwipe)

## Get started

### Installation

```sh
$ npm i @infinityfx/lively
```

### Usage

```jsx
import { Animate } from '@infinityfx/lively';

...

<Animate onMount>
    <div class="my-class">
        Lorem ipsum enim amet consequat ut reprehenderit cupidatat et incididunt qui minim culpa. Dolor do laborum nulla pariatur tempor excepteur duis et ipsum. Eu commodo et esse exercitation laborum cupidatat incididunt elit reprehenderit id.
    </div>
</Animate>
```

## Components

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

### Animate `<Animate />`

Automatic animation based on pre-fab animations.

### Morph `<Morph />`

Morphs one element into another.

## Build-in animations

### `<WriteOn />`

```jsx
import { WriteOn } from '@infinityfx/lively/prebuild';

...

<WriteOn>Lorem ipsum dolor sit amet</WriteOn>
```

### `<ColorWipe />`

```jsx
import { ColorWipe } from '@infinityfx/lively/prebuild';

...

<ColorWipe>
    <div class="my-class">...</div>
</ColorWipe>
```