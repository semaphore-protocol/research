export function getExecutionTime(callback: () => void): number {
    const t0 = performance.now()

    callback()

    const t1 = performance.now()

    return t1 - t0
}
