# Lively

[![NPM package](https://img.shields.io/npm/v/@infinityfx/lively)](https://www.npmjs.com/package/@infinityfx/lively)
[![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@infinityfx/lively)](https://bundlephobia.com/package/@infinityfx/lively)
[![Last commit](https://img.shields.io/github/last-commit/infinityfx-llc/lively)](https://github.com/infinityfx-llc/lively)
![NPM weekly downloads](https://img.shields.io/npm/dw/@infinityfx/lively)
![NPM downloads](https://img.shields.io/npm/dt/@infinityfx/lively)

Feature complete, lightweight react animation library. Lively lets u create complex animations without the hassle.

# Get started

## Documentation
Visit [infinityfx.dev/lively](https://infinityfx.dev/lively) for the complete documentation.

## Installation

```sh
$ npm i @infinityfx/lively
```

## Usage

```jsx
import { Animatable } from '@infinityfx/lively';

...

<Animatable animate={{ opacity: [0, 1] }} triggers={[{ on: 'mount' }]}>
    <div class="my-class">
        Lorem ipsum enim amet consequat ut reprehenderit cupidatat et incididunt qui minim culpa. Dolor do laborum nulla pariatur tempor excepteur duis et ipsum.
    </div>
</Animatable>
```