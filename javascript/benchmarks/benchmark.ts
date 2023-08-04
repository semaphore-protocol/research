import { getExecutionTime } from "./utils"
import { createSuite } from "./suite"
import { FN } from "./types"

export default function generateBenchmarks(fn1: FN, fn2: FN, name: string, file: string) {
    console.log(fn1[0], getExecutionTime(fn1[1]))
    console.log(fn2[0], getExecutionTime(fn2[1]))

    createSuite(fn1, fn2, name, file)
}
