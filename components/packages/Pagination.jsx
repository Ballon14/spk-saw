import Button from '../ui/Button'

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center items-center gap-5 bg-white rounded-lg shadow-md p-6">
      <Button
        variant="primary"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={!pagination.hasPrev}
      >
        ← Previous
      </Button>
      <span className="text-gray-700 font-semibold">
        Halaman {pagination.page} dari {pagination.totalPages}
      </span>
      <Button
        variant="primary"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!pagination.hasNext}
      >
        Next →
      </Button>
    </div>
  )
}
