import Link from 'next/link'
import Badge from '../ui/Badge'

export default function PackageCard({ pkg }) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K'
    }
    return num.toString()
  }

  return (
    <Link
      href={`/packages/${encodeURIComponent(pkg.name)}`}
      className="block bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 flex-1 break-words">
          {pkg.name}
        </h3>
        {pkg.version && (
          <Badge variant="primary" className="ml-2 whitespace-nowrap">
            v{pkg.version}
          </Badge>
        )}
      </div>
      
      {pkg.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[3rem]">
          {pkg.description.length > 100
            ? `${pkg.description.substring(0, 100)}...`
            : pkg.description}
        </p>
      )}
      
      <div className="space-y-2 mb-4">
        {pkg.author && (
          <div className="flex items-center text-sm">
            <span className="font-semibold text-gray-700 min-w-[70px]">Author:</span>
            <span className="text-gray-600">{pkg.author}</span>
          </div>
        )}
        {pkg.categories && (
          <div className="flex items-center text-sm">
            <span className="font-semibold text-gray-700 min-w-[70px]">Kategori:</span>
            <Badge variant="primary" className="text-xs">
              {pkg.categories}
            </Badge>
          </div>
        )}
        {pkg.downloads_last_month && (
          <div className="flex items-center text-sm">
            <span className="font-semibold text-gray-700 min-w-[70px]">Downloads:</span>
            <span className="text-gray-600">
              {formatNumber(parseInt(pkg.downloads_last_month) || 0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-3">
        <span className="text-primary-600 font-semibold text-sm hover:underline">
          Lihat Detail →
        </span>
      </div>
    </Link>
  )
}
