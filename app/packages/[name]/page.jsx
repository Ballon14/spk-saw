"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Container from "@/components/layout/Container"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Alert from "@/components/ui/Alert"
import Spinner from "@/components/ui/Spinner"
import Button from "@/components/ui/Button"

export default function PackageDetailPage() {
    const params = useParams()
    const [packageData, setPackageData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (params.name) {
            loadPackageDetail()
        }
    }, [params.name])

    const loadPackageDetail = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await fetch(
                `/api/packages/${encodeURIComponent(params.name)}`
            )
            const data = await response.json()

            if (data.success) {
                setPackageData(data.data)
            } else {
                setError(data.error || "Package tidak ditemukan")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat memuat detail package")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + "M"
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(2) + "K"
        }
        return num.toString()
    }

    const parseBoolean = (value) => {
        if (typeof value === "boolean") return value
        if (typeof value === "string") {
            return value.toLowerCase() === "true" || value === "1"
        }
        return false
    }

    if (loading) {
        return (
            <main>
                <Header title="📦 Detail Package" />
                <Container>
                    <Card>
                        <div className="py-10">
                            <Spinner size="lg" className="mx-auto mb-4" />
                            <p className="text-center text-gray-600">
                                ⏳ Memuat detail package...
                            </p>
                        </div>
                    </Card>
                </Container>
            </main>
        )
    }

    if (error || !packageData) {
        return (
            <main>
                <Header title="📦 Detail Package" />
                <Container>
                    <Link href="/packages">
                        <Button variant="outline" className="mb-4">
                            ← Kembali ke Daftar Packages
                        </Button>
                    </Link>
                    <Alert variant="error">
                        {error || "Package tidak ditemukan"}
                    </Alert>
                </Container>
            </main>
        )
    }

    const pkg = packageData

    return (
        <main>
            <Header
                title="📦 Detail Package"
                description="Informasi lengkap tentang package"
                actions={
                    <>
                        <Link href="/packages">
                            <span className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200">
                                ← Semua Packages
                            </span>
                        </Link>
                        <Link href="/">
                            <span className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200">
                                🏆 SAW
                            </span>
                        </Link>
                    </>
                }
            />

            <Container>
                <Link href="/packages">
                    <Button variant="outline" className="mb-6">
                        ← Kembali ke Daftar Packages
                    </Button>
                </Link>

                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <Card>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {pkg.name}
                            </h1>
                            <div className="flex gap-2 flex-wrap">
                                {pkg.version && (
                                    <Badge variant="primary">
                                        v{pkg.version}
                                    </Badge>
                                )}
                                {pkg.license && (
                                    <Badge variant="success">
                                        {pkg.license}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {pkg.description && (
                            <p className="text-lg text-gray-600">
                                {pkg.description}
                            </p>
                        )}
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            📊 Statistik
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {pkg.downloads_last_month && (
                                <div className="bg-gradient-to-br from-primary-500 to-purple-600 text-white p-6 rounded-lg text-center">
                                    <div className="text-3xl font-bold mb-2">
                                        {formatNumber(
                                            parseInt(
                                                pkg.downloads_last_month
                                            ) || 0
                                        )}
                                    </div>
                                    <div className="text-primary-100 text-sm">
                                        Downloads (Bulan Lalu)
                                    </div>
                                </div>
                            )}
                            {pkg.github_stars && (
                                <div className="bg-gradient-to-br from-pink-400 to-red-500 text-white p-6 rounded-lg text-center">
                                    <div className="text-3xl font-bold mb-2">
                                        {formatNumber(
                                            parseInt(pkg.github_stars) || 0
                                        )}
                                    </div>
                                    <div className="text-pink-100 text-sm">
                                        GitHub Stars
                                    </div>
                                </div>
                            )}
                            {pkg.github_forks && (
                                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white p-6 rounded-lg text-center">
                                    <div className="text-3xl font-bold mb-2">
                                        {formatNumber(
                                            parseInt(pkg.github_forks) || 0
                                        )}
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        GitHub Forks
                                    </div>
                                </div>
                            )}
                            {pkg.total_releases && (
                                <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white p-6 rounded-lg text-center">
                                    <div className="text-3xl font-bold mb-2">
                                        {formatNumber(
                                            parseInt(pkg.total_releases) || 0
                                        )}
                                    </div>
                                    <div className="text-green-100 text-sm">
                                        Total Releases
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            ℹ️ Informasi Dasar
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pkg.author && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Author
                                    </div>
                                    <div className="text-gray-900">
                                        {pkg.author}
                                    </div>
                                </div>
                            )}
                            {pkg.version && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Version
                                    </div>
                                    <div className="text-gray-900">
                                        {pkg.version}
                                    </div>
                                </div>
                            )}
                            {pkg.license && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        License
                                    </div>
                                    <div className="text-gray-900">
                                        {pkg.license}
                                    </div>
                                </div>
                            )}
                            {pkg.categories && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Kategori
                                    </div>
                                    <Badge variant="primary">
                                        {pkg.categories}
                                    </Badge>
                                </div>
                            )}
                            {pkg.github_language && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Bahasa
                                    </div>
                                    <div className="text-gray-900">
                                        {pkg.github_language}
                                    </div>
                                </div>
                            )}
                            {pkg.maintainers && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Maintainers
                                    </div>
                                    <div className="text-gray-900">
                                        {pkg.maintainers}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quality Metrics */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            ⭐ Metrik Kualitas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pkg.documentation_score !== undefined && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Skor Dokumentasi
                                    </div>
                                    <div className="text-gray-900">
                                        {parseFloat(
                                            pkg.documentation_score || 0
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            )}
                            {pkg.activity_score !== undefined && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Skor Aktivitas
                                    </div>
                                    <div className="text-gray-900">
                                        {parseFloat(
                                            pkg.activity_score || 0
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            )}
                            {pkg.has_tests !== undefined && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Memiliki Tests
                                    </div>
                                    <div className="text-gray-900">
                                        {parseBoolean(pkg.has_tests)
                                            ? "✓ Ya"
                                            : "✗ Tidak"}
                                    </div>
                                </div>
                            )}
                            {pkg.has_ci !== undefined && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Memiliki CI
                                    </div>
                                    <div className="text-gray-900">
                                        {parseBoolean(pkg.has_ci)
                                            ? "✓ Ya"
                                            : "✗ Tidak"}
                                    </div>
                                </div>
                            )}
                            {pkg.has_vulnerabilities !== undefined && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Vulnerabilities
                                    </div>
                                    <div className="text-gray-900">
                                        {parseBoolean(pkg.has_vulnerabilities)
                                            ? "⚠️ Ada"
                                            : "✓ Aman"}
                                    </div>
                                </div>
                            )}
                            {pkg.vulnerabilities && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Jumlah Vulnerabilities
                                    </div>
                                    <div className="text-gray-900">
                                        {pkg.vulnerabilities}
                                    </div>
                                </div>
                            )}
                            {pkg.releases_per_year && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Rilis per Tahun
                                    </div>
                                    <div className="text-gray-900">
                                        {parseFloat(
                                            pkg.releases_per_year || 0
                                        ).toFixed(1)}
                                    </div>
                                </div>
                            )}
                            {pkg.release_frequency_days && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Frekuensi Rilis (Hari)
                                    </div>
                                    <div className="text-gray-900">
                                        {parseFloat(
                                            pkg.release_frequency_days || 0
                                        ).toFixed(1)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* GitHub Information */}
                    {(pkg.github_stars ||
                        pkg.github_forks ||
                        pkg.repository) && (
                        <Card>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                                🔗 GitHub Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pkg.repository && (
                                    <div className="md:col-span-2">
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Repository
                                        </div>
                                        <a
                                            href={
                                                pkg.repository.startsWith(
                                                    "http"
                                                )
                                                    ? pkg.repository
                                                    : `https://${pkg.repository}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 hover:text-primary-700 hover:underline break-all"
                                        >
                                            {pkg.repository}
                                        </a>
                                    </div>
                                )}
                                {pkg.github_open_issues !== undefined && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Open Issues
                                        </div>
                                        <div className="text-gray-900">
                                            {pkg.github_open_issues || 0}
                                        </div>
                                    </div>
                                )}
                                {pkg.open_pull_requests !== undefined && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Open Pull Requests
                                        </div>
                                        <div className="text-gray-900">
                                            {pkg.open_pull_requests || 0}
                                        </div>
                                    </div>
                                )}
                                {pkg.contributors_count !== undefined && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Contributors
                                        </div>
                                        <div className="text-gray-900">
                                            {pkg.contributors_count || 0}
                                        </div>
                                    </div>
                                )}
                                {pkg.last_commit_date && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Last Commit
                                        </div>
                                        <div className="text-gray-900">
                                            {new Date(
                                                pkg.last_commit_date
                                            ).toLocaleDateString("id-ID")}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Links */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            🔗 Links
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pkg.npm_url && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        NPM Package
                                    </div>
                                    <a
                                        href={pkg.npm_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-700 hover:underline break-all"
                                    >
                                        {pkg.npm_url}
                                    </a>
                                </div>
                            )}
                            {pkg.homepage && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Homepage
                                    </div>
                                    <a
                                        href={pkg.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-700 hover:underline break-all"
                                    >
                                        {pkg.homepage}
                                    </a>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Keywords */}
                    {pkg.keywords && (
                        <Card>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                                🏷️ Keywords
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {pkg.keywords
                                    .split(",")
                                    .map((keyword, index) => (
                                        <Badge key={index} variant="default">
                                            {keyword.trim()}
                                        </Badge>
                                    ))}
                            </div>
                        </Card>
                    )}

                    {/* Package Size */}
                    {(pkg.package_size_kb || pkg.gzip_size_kb) && (
                        <Card>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                                📦 Ukuran Package
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pkg.package_size_kb && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Package Size
                                        </div>
                                        <div className="text-gray-900">
                                            {parseFloat(
                                                pkg.package_size_kb || 0
                                            ).toFixed(2)}{" "}
                                            KB
                                        </div>
                                    </div>
                                )}
                                {pkg.gzip_size_kb && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Gzip Size
                                        </div>
                                        <div className="text-gray-900">
                                            {parseFloat(
                                                pkg.gzip_size_kb || 0
                                            ).toFixed(2)}{" "}
                                            KB
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Dependencies */}
                    {(pkg.dependencies || pkg.dev_dependencies) && (
                        <Card>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                                📚 Dependencies
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pkg.dependencies && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Dependencies
                                        </div>
                                        <div className="text-gray-900">
                                            {pkg.dependencies}
                                        </div>
                                    </div>
                                )}
                                {pkg.dev_dependencies && (
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-1">
                                            Dev Dependencies
                                        </div>
                                        <div className="text-gray-900">
                                            {pkg.dev_dependencies}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Dates */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            📅 Informasi Tanggal
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pkg.created_date && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Dibuat
                                    </div>
                                    <div className="text-gray-900">
                                        {new Date(
                                            pkg.created_date
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            )}
                            {pkg.last_updated && (
                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-1">
                                        Terakhir Diupdate
                                    </div>
                                    <div className="text-gray-900">
                                        {new Date(
                                            pkg.last_updated
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </Container>
        </main>
    )
}
