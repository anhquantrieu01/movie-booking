type Props = {
  title: string
  value: number | string
  subtitle?: string
}

export default function StatsCard({
  title,
  value,
  subtitle
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-3xl font-bold text-red-600 mt-1">
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-gray-400 mt-2">
          {subtitle}
        </p>
      )}

    </div>
  )
}