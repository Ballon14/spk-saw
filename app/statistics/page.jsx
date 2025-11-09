"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Container from "@/components/layout/Container"
import Card from "@/components/ui/Card"
import Spinner from "@/components/ui/Spinner"
import Alert from "@/components/ui/Alert"
import Badge from "@/components/ui/Badge"

export default function StatisticsPage() {
    const [statistics, setStatistics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        loadStatistics()
    }, [])

    const loadStatistics = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/statistics")
            const data = await response.json()

            if (data.success) {
                setStatistics(data.statistics)
            } else {
                setError(data.error || "Terjadi kesalahan saat memuat statistik")
            }
        } catch (err) {
            setError("Terjadi kesalahan saat memuat statistik")
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
        return num.toFixed(2)
    }

    const formatPercentage = (value, total) => {
        return ((value / total) * 100).toFixed(1)
    }

    if (loading) {
        return (
            <main>
                <Header title="📊 Statistik Dataset" />
                <Container>
                    <Card>
                        <div className="py-10">
                            <Spinner size="lg" className="mx-auto mb-4" />
                            <p className="text-center text-gray-600">
                                ⏳ Memuat statistik...
                            </p>
                        </div>
                    </Card>
                </Container>
            </main>
        )
    }

    if (error || !statistics) {
        return (
            <main>
                <Header title="📊 Statistik Dataset" />
                <Container>
                    <Alert variant="error">
                        {error || "Gagal memuat statistik"}
                    </Alert>
                </Container>
            </main>
        )
    }

    const stats = statistics

    return (
        <main>
            <Header
                title="📊 Statistik Dataset"
                description="Analisis lengkap dataset package NPM"
                actions={
                    <>
                        <Link href="/">
                            <span className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200">
                                🏆 SAW
                            </span>
                        </Link>
                        <Link href="/packages">
                            <span className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200">
                                📦 Packages
                            </span>
                        </Link>
                    </>
                }
            />

            <Container>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary-600 mb-2">
                                {stats.totalPackages.toLocaleString()}
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Total Packages
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {stats.quality.withTests.toLocaleString()}
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Dengan Tests
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                (
                                {formatPercentage(
                                    stats.quality.withTests,
                                    stats.totalPackages
                                )}
                                %)
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.quality.withCI.toLocaleString()}
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Dengan CI
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                (
                                {formatPercentage(
                                    stats.quality.withCI,
                                    stats.totalPackages
                                )}
                                %)
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                {stats.quality.withVulnerabilities.toLocaleString()}
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Dengan Vulnerabilities
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                (
                                {formatPercentage(
                                    stats.quality.withVulnerabilities,
                                    stats.totalPackages
                                )}
                                %)
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Average Statistics */}
                <Card className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                        📈 Rata-rata Statistik
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-primary-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary-600 mb-1">
                                {formatNumber(stats.averages.downloads)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Avg Downloads
                            </div>
                        </div>
                        <div className="text-center p-4 bg-pink-50 rounded-lg">
                            <div className="text-2xl font-bold text-pink-600 mb-1">
                                {formatNumber(stats.averages.stars)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Avg Stars
                            </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {formatNumber(stats.averages.forks)}
                            </div>
                            <div className="text-sm text-gray-600">Avg Forks</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {stats.averages.docScore.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Avg Doc Score
                            </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {stats.averages.activityScore.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Avg Activity
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Categories */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            🏷️ Top 10 Kategori
                        </h2>
                        <div className="space-y-3">
                            {stats.topCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Badge variant="primary">
                                            #{index + 1}
                                        </Badge>
                                        <span className="font-semibold text-gray-900">
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary-600">
                                            {category.count.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            (
                                            {formatPercentage(
                                                category.count,
                                                stats.totalPackages
                                            )}
                                            %)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Top Licenses */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            📜 Top 10 License
                        </h2>
                        <div className="space-y-3">
                            {stats.topLicenses.map((license, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Badge variant="success">
                                            #{index + 1}
                                        </Badge>
                                        <span className="font-semibold text-gray-900">
                                            {license.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-600">
                                            {license.count.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            (
                                            {formatPercentage(
                                                license.count,
                                                stats.totalPackages
                                            )}
                                            %)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Downloads */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            ⬇️ Top 10 Downloads
                        </h2>
                        <div className="space-y-3">
                            {stats.topDownloads.map((pkg, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Badge
                                            variant={
                                                index === 0
                                                    ? "gold"
                                                    : index === 1
                                                    ? "silver"
                                                    : index === 2
                                                    ? "bronze"
                                                    : "default"
                                            }
                                        >
                                            #{index + 1}
                                        </Badge>
                                        <Link
                                            href={`/packages/${encodeURIComponent(
                                                pkg.name
                                            )}`}
                                            className="font-semibold text-primary-600 hover:text-primary-700 hover:underline truncate"
                                        >
                                            {pkg.name}
                                        </Link>
                                    </div>
                                    <div className="text-right ml-3">
                                        <div className="font-bold text-primary-600">
                                            {formatNumber(pkg.value)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Top Stars */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                            ⭐ Top 10 Stars
                        </h2>
                        <div className="space-y-3">
                            {stats.topStars.map((pkg, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Badge
                                            variant={
                                                index === 0
                                                    ? "gold"
                                                    : index === 1
                                                    ? "silver"
                                                    : index === 2
                                                    ? "bronze"
                                                    : "default"
                                            }
                                        >
                                            #{index + 1}
                                        </Badge>
                                        <Link
                                            href={`/packages/${encodeURIComponent(
                                                pkg.name
                                            )}`}
                                            className="font-semibold text-primary-600 hover:text-primary-700 hover:underline truncate"
                                        >
                                            {pkg.name}
                                        </Link>
                                    </div>
                                    <div className="text-right ml-3">
                                        <div className="font-bold text-pink-600">
                                            {formatNumber(pkg.value)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Top Activity */}
                <Card className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-500 pb-2">
                        🚀 Top 10 Activity Score
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {stats.topActivity.slice(0, 5).map((pkg, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="default" className="bg-white/20 text-white">
                                        #{index + 1}
                                    </Badge>
                                </div>
                                <Link
                                    href={`/packages/${encodeURIComponent(
                                        pkg.name
                                    )}`}
                                    className="font-bold text-sm block mb-2 hover:underline truncate"
                                >
                                    {pkg.name}
                                </Link>
                                <div className="text-2xl font-bold">
                                    {pkg.value.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-2">
                        {stats.topActivity.slice(5).map((pkg, index) => (
                            <div
                                key={index + 5}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Badge variant="default">
                                        #{index + 6}
                                    </Badge>
                                    <Link
                                        href={`/packages/${encodeURIComponent(
                                            pkg.name
                                        )}`}
                                        className="font-semibold text-primary-600 hover:text-primary-700 hover:underline truncate"
                                    >
                                        {pkg.name}
                                    </Link>
                                </div>
                                <div className="text-right ml-3">
                                    <div className="font-bold text-purple-600">
                                        {pkg.value.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </Container>
        </main>
    )
}
