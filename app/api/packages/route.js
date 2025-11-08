import { NextResponse } from "next/server"
import { loadDataset } from "@/lib/csvParser"

export const runtime = "nodejs"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page")) || 1
    const limit = parseInt(searchParams.get("limit")) || 50
    const category = searchParams.get("category") || "all"
    const search = searchParams.get("search") || ""

    // Load dataset
    let data = await loadDataset()

    // Filter by category if provided
    if (category && category !== "all" && category.trim() !== "") {
      data = data.filter((item) => {
        if (!item.categories || item.categories.trim() === "") {
          return false
        }
        const categories = item.categories.split(",").map((cat) => cat.trim())
        return categories.includes(category)
      })
    }

    // Filter by search term
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase()
      data = data.filter((item) => {
        const name = (item.name || "").toLowerCase()
        const description = (item.description || "").toLowerCase()
        const author = (item.author || "").toLowerCase()
        return (
          name.includes(searchLower) ||
          description.includes(searchLower) ||
          author.includes(searchLower)
        )
      })
    }

    // Sort by name
    data.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase()
      const nameB = (b.name || "").toLowerCase()
      return nameA.localeCompare(nameB)
    })

    // Pagination
    const total = data.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = data.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error loading packages:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan saat memuat packages",
      },
      { status: 500 }
    )
  }
}
