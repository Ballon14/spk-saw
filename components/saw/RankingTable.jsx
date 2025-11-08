import Link from 'next/link'
import Badge from '../ui/Badge'
import { formatNumber } from '@/lib/saw'

export default function RankingTable({ results, selectedCategory }) {
  const getRankVariant = (rank) => {
    if (rank === 1) return 'gold'
    if (rank === 2) return 'silver'
    if (rank === 3) return 'bronze'
    return 'default'
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="bg-primary-500 text-white">
            <th className="px-4 py-3 text-left">Rank</th>
            <th className="px-4 py-3 text-left">Nama Package</th>
            <th className="px-4 py-3 text-left">Skor SAW</th>
            <th className="px-4 py-3 text-left">Downloads</th>
            <th className="px-4 py-3 text-left">Stars</th>
            <th className="px-4 py-3 text-left">Forks</th>
            <th className="px-4 py-3 text-left">Doc Score</th>
            <th className="px-4 py-3 text-left">Activity</th>
            <th className="px-4 py-3 text-left">Releases/Year</th>
            <th className="px-4 py-3 text-left">Tests</th>
            <th className="px-4 py-3 text-left">CI</th>
            <th className="px-4 py-3 text-left">Kategori</th>
            <th className="px-4 py-3 text-left">Version</th>
          </tr>
        </thead>
        <tbody>
          {results.slice(0, 100).map((item, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <Badge variant={getRankVariant(item.rank)}>
                  #{item.rank}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/packages/${encodeURIComponent(item.name)}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                >
                  {item.name}
                </Link>
                {item.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {item.description.substring(0, 60)}...
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="font-bold text-primary-600">
                  {item.score.toFixed(4)}
                </span>
              </td>
              <td className="px-4 py-3">{formatNumber(item.downloads_last_month)}</td>
              <td className="px-4 py-3">{formatNumber(item.github_stars)}</td>
              <td className="px-4 py-3">{formatNumber(item.github_forks)}</td>
              <td className="px-4 py-3">{item.documentation_score.toFixed(2)}</td>
              <td className="px-4 py-3">{item.activity_score.toFixed(2)}</td>
              <td className="px-4 py-3">{item.releases_per_year.toFixed(1)}</td>
              <td className="px-4 py-3">
                {item.has_tests ? '✓' : '✗'}
              </td>
              <td className="px-4 py-3">
                {item.has_ci ? '✓' : '✗'}
              </td>
              <td className="px-4 py-3">
                <Badge variant="primary" className="text-xs">
                  {item.categories || '-'}
                </Badge>
              </td>
              <td className="px-4 py-3">{item.version || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length > 100 && (
        <p className="text-center text-gray-600 mt-4">
          Menampilkan 100 dari {results.length} hasil
        </p>
      )}
      {selectedCategory !== 'all' && (
        <p className="text-center text-primary-600 font-semibold mt-4">
          📦 Menampilkan hasil untuk kategori: <strong>{selectedCategory}</strong>
        </p>
      )}
    </div>
  )
}
