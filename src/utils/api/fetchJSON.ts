// Fetching JSON from an API and making sure the type matched whatever T is.
export async function fetchJSON<T>(
    ...args: Parameters<typeof fetch>
): Promise<T> {
    const res = await fetch(...args);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data: T = await res.json();

    return data;
}
