import Alert from '../ui/Alert'

export default function WeightSummary({ totalWeight }) {
  const isValid = Math.abs(totalWeight - 1) < 0.01

  return (
    <div className="mt-4">
      <div
        className={`p-4 rounded-lg font-semibold ${
          isValid
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}
      >
        Total Bobot: {totalWeight.toFixed(2)}{' '}
        {isValid ? '✓' : '(Harus sama dengan 1.00)'}
      </div>
    </div>
  )
}
