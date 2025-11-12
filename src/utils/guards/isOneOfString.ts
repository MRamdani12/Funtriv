export function isOneOfString<T extends readonly string[]>(
    value: string,
    allowed: T
): value is T[number] {
    return (allowed as readonly string[]).includes(value);
}
