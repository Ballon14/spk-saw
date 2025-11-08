// Fungsi helper untuk parsing nilai
function parseNumericValue(value) {
  if (value === "" || value === null || value === undefined) return 0
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

function parseBooleanValue(value) {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1"
  }
  return false
}

// Kriteria yang akan digunakan untuk SAW
export const CRITERIA = {
  downloads_last_month: {
    name: 'Downloads Bulan Terakhir',
    type: 'benefit', // Semakin tinggi semakin baik
    weight: 0.2
  },
  github_stars: {
    name: 'GitHub Stars',
    type: 'benefit',
    weight: 0.15
  },
  github_forks: {
    name: 'GitHub Forks',
    type: 'benefit',
    weight: 0.15
  },
  documentation_score: {
    name: 'Skor Dokumentasi',
    type: 'benefit',
    weight: 0.15
  },
  activity_score: {
    name: 'Skor Aktivitas',
    type: 'benefit',
    weight: 0.15
  },
  releases_per_year: {
    name: 'Rilis per Tahun',
    type: 'benefit',
    weight: 0.1
  },
  has_tests: {
    name: 'Memiliki Tests',
    type: 'benefit',
    weight: 0.05
  },
  has_ci: {
    name: 'Memiliki CI',
    type: 'benefit',
    weight: 0.05
  }
}

// Normalisasi data untuk kriteria benefit
function normalizeBenefit(value, min, max) {
  if (max === min) return 1
  return (value - min) / (max - min)
}

// Normalisasi data untuk kriteria cost
function normalizeCost(value, min, max) {
  if (max === min) return 1
  return (max - value) / (max - min)
}

// Normalisasi data boolean (true = 1, false = 0)
function normalizeBoolean(value) {
  return value ? 1 : 0
}

export function calculateSAW(data, weights = null) {
  // Gunakan bobot default jika tidak ada yang diberikan
  const criteriaWeights = weights || Object.keys(CRITERIA).reduce((acc, key) => {
    acc[key] = CRITERIA[key].weight
    return acc
  }, {})

  // Validasi bahwa total bobot = 1
  const totalWeight = Object.values(criteriaWeights).reduce((sum, w) => sum + w, 0)
  if (Math.abs(totalWeight - 1) > 0.01) {
    throw new Error(`Total bobot harus sama dengan 1. Total saat ini: ${totalWeight}`)
  }

  // Filter data yang valid
  const validData = data.filter(item => item.name && item.name.trim() !== '')

  if (validData.length === 0) {
    return []
  }

  // Hitung min dan max untuk setiap kriteria numerik
  const minMax = {}
  Object.keys(CRITERIA).forEach(key => {
    const criterion = CRITERIA[key]
    if (criterion.type === 'benefit' || criterion.type === 'cost') {
      const values = validData.map(item => {
        if (key.includes('has_')) {
          return parseBooleanValue(item[key]) ? 1 : 0
        }
        return parseNumericValue(item[key])
      })
      minMax[key] = {
        min: Math.min(...values),
        max: Math.max(...values)
      }
    }
  })

  // Normalisasi dan hitung skor SAW
  const results = validData.map(item => {
    let score = 0
    
    Object.keys(CRITERIA).forEach(key => {
      const criterion = CRITERIA[key]
      const weight = criteriaWeights[key] || 0
      let normalizedValue = 0

      if (key.includes('has_')) {
        // Kriteria boolean
        normalizedValue = normalizeBoolean(parseBooleanValue(item[key]))
      } else if (criterion.type === 'benefit') {
        // Kriteria benefit
        const value = parseNumericValue(item[key])
        normalizedValue = normalizeBenefit(value, minMax[key].min, minMax[key].max)
      } else if (criterion.type === 'cost') {
        // Kriteria cost
        const value = parseNumericValue(item[key])
        normalizedValue = normalizeCost(value, minMax[key].min, minMax[key].max)
      }

      score += normalizedValue * weight
    })

    return {
      ...item,
      score: score,
      downloads_last_month: parseNumericValue(item.downloads_last_month),
      github_stars: parseNumericValue(item.github_stars),
      github_forks: parseNumericValue(item.github_forks),
      documentation_score: parseNumericValue(item.documentation_score),
      activity_score: parseNumericValue(item.activity_score),
      releases_per_year: parseNumericValue(item.releases_per_year),
      has_tests: parseBooleanValue(item.has_tests),
      has_ci: parseBooleanValue(item.has_ci)
    }
  })

  // Urutkan berdasarkan skor tertinggi
  results.sort((a, b) => b.score - a.score)

  // Tambahkan ranking
  return results.map((item, index) => ({
    ...item,
    rank: index + 1
  }))
}

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toString()
}
