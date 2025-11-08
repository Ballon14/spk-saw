"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Container from "@/components/layout/Container"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import Alert from "@/components/ui/Alert"
import Spinner from "@/components/ui/Spinner"
import PackageCard from "@/components/packages/PackageCard"
import Pagination from "@/components/packages/Pagination"

export default function PackagesPage() {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [loadingCategories, setLoadingCategories] = useState(true)

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch("/api/categories")
                const data = await response.json()
                if (data.success) {
                    setCategories(data.categories)
                }
            } catch (err) {
                console.error("Error loading categories:", err)
            } finally {
                setLoadingCategories(false)
            }
        }
        loadCategories()
    }, [])

    // Load packages
    useEffect(() => {
        loadPackages()
    }, [page, selectedCategory, searchTerm])

    const loadPackages = async () => {
        setLoading(true)
        setError("")

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "50",
                category: selectedCategory,
            })

            if (searchTerm.trim() !== "") {
                params.append("search", searchTerm)
            }

            const response = await fetch(`/api/packages?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                setPackages(data.data)
                setPagination(data.pagination)
            } else {
                setError(data.error || "Terjadi kesalahan saat memuat packages")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat memuat packages")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        loadPackages()
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value)
        setPage(1)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
    }

    const categoryOptions = [
        { value: "all", label: "Semua Kategori" },
        ...categories.map((cat) => ({ value: cat, label: cat })),
    ]

    return (
        <main>
            <Header
                title="📦 Semua Package NPM"
                description="Daftar lengkap semua package dalam dataset"
                actions={
                    <Link
                        href="/"
                        className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200"
                    >
                        ← Kembali ke SAW
                    </Link>
                }
            />

            <Container>
                {/* Filter dan Search */}
                <Card>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <Input
                                type="text"
                                placeholder="Cari package, deskripsi, atau author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                        <div className="md:w-64">
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                options={categoryOptions}
                                disabled={loadingCategories}
                            />
                        </div>
                    </div>
                    {selectedCategory !== "all" && (
                        <div className="text-sm text-primary-600">
                            Filter aktif: <strong>{selectedCategory}</strong>
                        </div>
                    )}
                </Card>

                {error && <Alert variant="error">{error}</Alert>}

                {/* List Packages */}
                {loading ? (
                    <Card>
                        <div className="py-10">
                            <Spinner size="lg" className="mx-auto mb-4" />
                            <p className="text-center text-gray-600">
                                ⏳ Memuat packages...
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {pagination && (
                            <Card className="mb-4">
                                <p className="text-gray-600 m-0">
                                    Menampilkan {packages.length} dari{" "}
                                    {pagination.total} packages
                                    {selectedCategory !== "all" &&
                                        ` (Kategori: ${selectedCategory})`}
                                </p>
                            </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {packages.map((pkg, index) => (
                                <PackageCard key={index} pkg={pkg} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && (
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </Container>
        </main>
    )
}
