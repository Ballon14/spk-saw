import { NextResponse } from "next/server"
import { loadDataset } from "@/lib/csvParser"
import { calculateSAW } from "@/lib/saw"

export const runtime = "nodejs"

export async function POST(request) {
    try {
        const { weights, category } = await request.json()

        // Load dataset
        let data = await loadDataset()

        // Filter by category if provided
        if (category && category !== 'all' && category.trim() !== '') {
            data = data.filter(item => {
                if (!item.categories || item.categories.trim() === '') {
                    return false
                }
                // Categories can be comma-separated, check if category is included
                const categories = item.categories.split(',').map(cat => cat.trim())
                return categories.includes(category)
            })
        }

        // Calculate SAW
        const results = calculateSAW(data, weights)

        return NextResponse.json({
            success: true,
            results: results,
            total: results.length,
        })
    } catch (error) {
        console.error("Error calculating SAW:", error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Terjadi kesalahan saat menghitung SAW",
            },
            { status: 500 }
        )
    }
}
