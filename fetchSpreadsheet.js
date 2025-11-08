const fetchSpreadsheetData = async () => {
    const SPREADSHEET_ID =
        "2PACX-1vQnjNhUD3OECqrQHb3mVlWn-u-uMeSvEXfKyJ87x-MRfF8KkrrGQ3-eEU2RXCkMgQ11I98lTPiHOBEi"

    try {
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_ID}/pub?output=csv`
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()
        const rows = text
            .split("\n")
            .map((row) =>
                row.split(",").map((cell) => cell.replace(/^"(.*)"$/, "$1"))
            )
        return rows
    } catch (error) {
        console.error("Error fetching spreadsheet:", error)
        return null
    }
}

const formatValue = (value) => {
    // Remove extra quotes
    if (typeof value === "string") {
        value = value.replace(/^"|"$/g, "")
    }
    // Convert 'FALSE' and 'TRUE' strings to boolean
    if (value === "FALSE") return false
    if (value === "TRUE") return true
    // Convert numbers
    if (!isNaN(value) && value !== "") return Number(value)
    return value
}

const displayData = async () => {
    const data = await fetchSpreadsheetData()
    if (data) {
        // Get headers from first row
        const headers = data[0]

        // Get actual data rows (excluding header row)
        const rows = data.slice(1)

        console.log("\nPackage Analysis:")
        console.log("=================\n")

        // Print each row as an object with headers as keys
        rows.forEach((row, index) => {
            const packageData = {}
            headers.forEach((header, i) => {
                packageData[header.trim()] = formatValue(row[i])
            })

            console.log(`📦 Package #${index + 1}: ${packageData.name}`)
            console.log(`Description: ${packageData.description}`)
            console.log(`Version: ${packageData.version}`)
            console.log(
                `Downloads last month: ${packageData.downloads_last_month}`
            )
            console.log(`GitHub Stats:`)
            console.log(`  ⭐ Stars: ${packageData.github_stars}`)
            console.log(`  🔄 Forks: ${packageData.github_forks}`)
            console.log(`  👀 Watchers: ${packageData.github_watchers}`)
            console.log(`Package Size: ${packageData.package_size_kb}KB`)
            console.log(
                `Documentation Score: ${packageData.documentation_score}`
            )
            console.log("----------------------------------------\n")
        })

        console.log(`Total packages analyzed: ${rows.length}`)
    }
}

displayData()
