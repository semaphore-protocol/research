export async function time(callback, message) {
    const t0 = performance.now()

    const result = await callback()

    const t1 = performance.now()

    console.log(`${message}:`, t1 - t0)

    return result
}
