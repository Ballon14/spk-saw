import Input from '../ui/Input'

export default function WeightInput({ criterion, value, onChange }) {
  return (
    <Input
      label={
        <>
          {criterion.name}
          <span className="text-xs text-gray-500 ml-2">
            ({criterion.type === 'benefit' ? 'Benefit' : 'Cost'})
          </span>
        </>
      }
      type="number"
      min="0"
      max="1"
      step="0.01"
      value={value}
      onChange={(e) => onChange(criterion.key, e.target.value)}
      className="w-full"
    />
  )
}
