export function serializeTriggers(triggers: {
    [key: string]: any[] | undefined; // todo
}) {
    const serialized: {
        [key: string]: string;
    } = {};

    for (const key in triggers) serialized[key] = (triggers[key] || []).map(value => value.toString()).join(',');

    return serialized;
}