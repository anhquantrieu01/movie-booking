export const RatingBar = ({ star, percent }: { star: number, percent: number }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-sm">{star}★</span>

      <div className="flex-1 h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-yellow-400 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <span className="w-10 text-sm text-gray-500">
        {percent}%
      </span>
    </div>
  )
}