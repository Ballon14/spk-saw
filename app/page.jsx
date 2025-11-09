'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CRITERIA } from '@/lib/saw'
import Header from '@/components/layout/Header'
import Container from '@/components/layout/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import WeightInput from '@/components/saw/WeightInput'
import WeightSummary from '@/components/saw/WeightSummary'
import RankingTable from '@/components/saw/RankingTable'

export default function Home() {
  const [weights, setWeights] = useState({})
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalWeight, setTotalWeight] = useState(0)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Initialize weights dengan nilai default
  useEffect(() => {
    const defaultWeights = {}
    Object.keys(CRITERIA).forEach(key => {
      defaultWeights[key] = CRITERIA[key].weight
    })
    setWeights(defaultWeights)
    calculateTotalWeight(defaultWeights)
  }, [])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        if (data.success) {
          setCategories(data.categories)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  const calculateTotalWeight = (w) => {
    const total = Object.values(w).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
    setTotalWeight(total)
  }

  const handleWeightChange = (key, value) => {
    const newWeights = {
      ...weights,
      [key]: parseFloat(value) || 0
    }
    setWeights(newWeights)
    calculateTotalWeight(newWeights)
    setError('')
  }

  const handleCalculate = async () => {
    // Validasi total weight
    if (Math.abs(totalWeight - 1) > 0.01) {
      setError(`Total bobot harus sama dengan 1. Total saat ini: ${totalWeight.toFixed(2)}`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          weights,
          category: selectedCategory
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
      } else {
        setError(data.error || 'Terjadi kesalahan saat menghitung')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghitung SAW')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetWeights = () => {
    const defaultWeights = {}
    Object.keys(CRITERIA).forEach(key => {
      defaultWeights[key] = CRITERIA[key].weight
    })
    setWeights(defaultWeights)
    calculateTotalWeight(defaultWeights)
    setSelectedCategory('all')
    setResults([])
    setError('')
  }

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ]

  return (
    <main>
      <Header
        title="🏆 Sistem Pendukung Keputusan"
        description="Metode Simple Additive Weighting (SAW) untuk Evaluasi Package NPM"
        actions={
          <>
            <Link
              href="/packages"
              className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200"
            >
              📦 Packages
            </Link>
            <Link
              href="/statistics"
              className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200"
            >
              📊 Statistik
            </Link>
          </>
        }
      />

      <Container>
        {/* Form Input Bobot */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Input Bobot Kriteria</h2>
          
          {error && <Alert variant="error">{error}</Alert>}

          {/* Filter Kategori */}
          <div className="mb-6">
            <Select
              label="📦 Kategori Package"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categoryOptions}
              disabled={loadingCategories}
            />
            {loadingCategories && (
              <div className="text-gray-600 text-sm">Memuat kategori...</div>
            )}
            {selectedCategory !== 'all' && (
              <div className="mt-2 text-sm text-primary-600">
                Filter aktif: <strong>{selectedCategory}</strong>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.keys(CRITERIA).map(key => (
              <WeightInput
                key={key}
                criterion={{ ...CRITERIA[key], key }}
                value={weights[key] || 0}
                onChange={handleWeightChange}
              />
            ))}
          </div>

          <WeightSummary totalWeight={totalWeight} />

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'Menghitung...' : 'Hitung Ranking'}
            </Button>
            <Button
              variant="secondary"
              onClick={resetWeights}
            >
              Reset Bobot
            </Button>
          </div>
        </Card>

        {/* Hasil Ranking */}
        {results.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📈 Hasil Ranking ({results.length} package)
            </h2>
            <RankingTable results={results} selectedCategory={selectedCategory} />
          </Card>
        )}

        {loading && (
          <Card>
            <div className="py-10">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-center text-gray-600">
                ⏳ Sedang memproses data dan menghitung ranking...
              </p>
            </div>
          </Card>
        )}
      </Container>
    </main>
  )
}