import b from "benny"
import { FN } from "./types"

const path = "benchmarks/results"

export function createSuite(fn1: FN, fn2: FN, name: string, file: string) {
    b.suite(
        name,
        b.add(...fn1),
        b.add(...fn2),
        b.cycle(),
        b.complete(),
        b.save({
            folder: `${path}/${name}/${file}`,
            file,
            version: "1.0.0",
            details: true
        }),
        b.save({
            folder: `${path}/${name}/${file}`,
            file,
            format: "chart.html",
            details: true
        }),
        b.save({
            folder: `${path}/${name}/${file}`,
            file,
            format: "table.html",
            details: true
        })
    )
}
