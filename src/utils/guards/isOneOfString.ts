// Typeguard to check if a string is one of some value inside a union type. E.g. is the string 'hard' matched the type 'hard' | 'medium' | 'easy'

export function isOneOfString<T extends readonly string[]>(
    value: string,
    allowed: T
): value is T[number] {
    return (allowed as readonly string[]).includes(value);
}
