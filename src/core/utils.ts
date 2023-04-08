const Events: {
    [key: string]: {
        unique: number;
        listeners: {
            [key: number]: (e: Event) => void;
        }
    }
} = {};

export function attachEvent(event: string, callback: (e: any) => void) {
    if (!(event in Events)) {
        Events[event] = { unique: 0, listeners: [] };

        window.addEventListener(event, e => {
            for (const cb of Object.values(Events[event].listeners)) cb(e);
        });
    }

    const e = Events[event];
    (callback as any).EventID = e.unique;
    e.listeners[e.unique++] = callback;
};

export function detachEvent(event: string, callback: (e: any) => void) {
    if (!(event in Events) || !('EventID' in callback)) return;

    delete Events[event][callback.EventID as never];
};

export function merge(...objects: { [key: string]: any }[]) {
    for (let i = 1; i < objects.length; i++) {
        for (const key in objects[i]) {
            if (key in objects[0] && objects[0][key] !== undefined) continue;

            objects[0][key] = objects[i][key];
        }
    }

    return objects[0];
};

export async function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};