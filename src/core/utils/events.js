import { isFunc, isNul } from './helper';

const Events = {};

export const addEventListener = (event, callback) => {
    if (!(event in Events)) {
        Events[event] = { unique: 0 };

        window.addEventListener(event, e => {
            for (const cb of Object.values(Events[event])) {
                if (isFunc(cb)) cb(e);
            }
        });
    }

    const e = Events[event];
    callback.LivelyID = e.unique;
    e[e.unique++] = callback;
};

export const removeEventListener = (event, callback) => {
    if (!(event in Events) || isNul(callback) || !('LivelyID' in callback)) return;

    delete Events[event][callback.LivelyID];
};

export const onAny = (events, elements, callback) => { // OPTIMIZE
    for (const event of events) {
        for (const el of elements) el.addEventListener(event, callback);
    }
};

export const offAny = (events, elements, callback) => { // OPTIMIZE
    for (const event of events) {
        for (const el of elements) el.removeEventListener(event, callback);
    }
};