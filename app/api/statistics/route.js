import { NextResponse } from "next/server"
import { loadDataset } from "@/lib/csvParser"

export const runtime = "nodejs"

export async function GET() {
    try {
        const data = await loadDataset()

        // Parse numeric values
        const parseNumeric = (value) => {
            if (value === "" || value === null || value === undefined) return 0
            const parsed = parseFloat(value)
            return isNaN(parsed) ? 0 : parsed
        }

        const parseBoolean = (value) => {
            if (typeof value === "boolean") return value
            if (typeof value === "string") {
                return value.toLowerCase() === "true" || value === "1"
            }
            return false
        }

        // Calculate statistics
        const totalPackages = data.length

        // Category distribution
        const categoryCount = {}
        data.forEach((item) => {
            if (item.categories && item.categories.trim() !== "") {
                const categories = item.categories
                    .split(",")
                    .map((cat) => cat.trim())
                categories.forEach((cat) => {
                    if (cat && cat !== "") {
                        categoryCount[cat] = (categoryCount[cat] || 0) + 1
                    }
                })
            }
        })

        const topCategories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }))

        // License distribution
        const licenseCount = {}
        data.forEach((item) => {
            if (item.license && item.license.trim() !== "") {
                licenseCount[item.license] =
                    (licenseCount[item.license] || 0) + 1
            }
        })

        const topLicenses = Object.entries(licenseCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }))

        // Average statistics
        const downloads = data.map((item) =>
            parseNumeric(item.downloads_last_month)
        )
        const stars = data.map((item) => parseNumeric(item.github_stars))
        const forks = data.map((item) => parseNumeric(item.github_forks))
        const docScores = data.map((item) =>
            parseNumeric(item.documentation_score)
        )
        const activityScores = data.map((item) =>
            parseNumeric(item.activity_score)
        )

        const avgDownloads =
            downloads.reduce((sum, val) => sum + val, 0) / downloads.length
        const avgStars = stars.reduce((sum, val) => sum + val, 0) / stars.length
        const avgForks = forks.reduce((sum, val) => sum + val, 0) / forks.length
        const avgDocScore =
            docScores.reduce((sum, val) => sum + val, 0) / docScores.length
        const avgActivityScore =
            activityScores.reduce((sum, val) => sum + val, 0) /
            activityScores.length

        // Packages with tests and CI
        const withTests = data.filter((item) =>
            parseBoolean(item.has_tests)
        ).length
        const withCI = data.filter((item) => parseBoolean(item.has_ci)).length
        const withVulnerabilities = data.filter((item) =>
            parseBoolean(item.has_vulnerabilities)
        ).length

        // Top packages by downloads
        const topDownloads = data
            .map((item) => ({
                name: item.name,
                value: parseNumeric(item.downloads_last_month),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)

        // Top packages by stars
        const topStars = data
            .map((item) => ({
                name: item.name,
                value: parseNumeric(item.github_stars),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)

        // Top packages by activity score
        const topActivity = data
            .map((item) => ({
                name: item.name,
                value: parseNumeric(item.activity_score),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)

        // Language distribution
        const languageCount = {}
        data.forEach((item) => {
            if (item.github_language && item.github_language.trim() !== "") {
                languageCount[item.github_language] =
                    (languageCount[item.github_language] || 0) + 1
            }
        })

        const topLanguages = Object.entries(languageCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }))

        return NextResponse.json({
            success: true,
            statistics: {
                totalPackages,
                averages: {
                    downloads: avgDownloads,
                    stars: avgStars,
                    forks: avgForks,
                    docScore: avgDocScore,
                    activityScore: avgActivityScore,
                },
                quality: {
                    withTests,
                    withCI,
                    withVulnerabilities,
                    withoutVulnerabilities: totalPackages - withVulnerabilities,
                },
                topCategories,
                topLicenses,
                topLanguages,
                topDownloads,
                topStars,
                topActivity,
            },
        })
    } catch (error) {
        console.error("Error loading statistics:", error)
        return NextResponse.json(
            {
                success: false,
                error:
                    error.message || "Terjadi kesalahan saat memuat statistik",
            },
            { status: 500 }
        )
    }
}
