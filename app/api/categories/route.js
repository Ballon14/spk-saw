import { NextResponse } from "next/server"
import { loadDataset } from "@/lib/csvParser"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Load dataset
    const data = await loadDataset()
    
    // Extract unique categories
    const categorySet = new Set()
    
    data.forEach(item => {
      if (item.categories && item.categories.trim() !== '') {
        // Categories can be comma-separated, so split them
        const categories = item.categories.split(',').map(cat => cat.trim())
        categories.forEach(cat => {
          if (cat && cat !== '') {
            categorySet.add(cat)
          }
        })
      }
    })
    
    // Convert to sorted array
    const categories = Array.from(categorySet).sort()
    
    return NextResponse.json({
      success: true,
      categories: categories
    })
  } catch (error) {
    console.error("Error loading categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan saat memuat kategori"
      },
      { status: 500 }
    )
  }
}
