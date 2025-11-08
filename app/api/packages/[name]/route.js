import { NextResponse } from "next/server"
import { loadDataset } from "@/lib/csvParser"

export const runtime = "nodejs"

export async function GET(request, context) {
  try {
    // Handle both sync and async params (Next.js 13-15 compatibility)
    const params = await Promise.resolve(context.params || {})
    const { name } = params

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama package tidak ditemukan",
        },
        { status: 400 }
      )
    }

    // Decode URL encoded name
    const decodedName = decodeURIComponent(name)

    // Load dataset
    const data = await loadDataset()

    // Find package by name
    const packageData = data.find((item) => item.name === decodedName)

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          error: "Package tidak ditemukan",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: packageData,
    })
  } catch (error) {
    console.error("Error loading package detail:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan saat memuat detail package",
      },
      { status: 500 }
    )
  }
}
