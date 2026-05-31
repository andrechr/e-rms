export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

export function snapToDay(ms: number): number {
    const date = new Date(ms)
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}
