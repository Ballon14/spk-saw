import Papa from "papaparse"
import fs from "fs"
import path from "path"

export async function loadDataset() {
    try {
        const filePath = path.join(process.cwd(), "dataset.csv")
        const fileContents = fs.readFileSync(filePath, "utf-8")

        return new Promise((resolve, reject) => {
            Papa.parse(fileContents, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    resolve(results.data)
                },
                error: (error) => {
                    reject(error)
                },
            })
        })
    } catch (error) {
        console.error("Error loading dataset:", error)
        throw error
    }
}

export function parseNumericValue(value) {
    if (value === "" || value === null || value === undefined) return 0
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
}

export function parseBooleanValue(value) {
    if (typeof value === "boolean") return value
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1"
    }
    return false
}
