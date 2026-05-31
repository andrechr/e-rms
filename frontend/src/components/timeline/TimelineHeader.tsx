interface Props {
    startDate: string
    weeks: number
}

export default function TimelineHeader({ startDate, weeks }: Props) {
    const headers = []

    for (let i = 0; i < weeks; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i * 7)
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        headers.push(
            <div key={i} className="flex-1 flex items-center justify-center border-r border-gray-200 py-2 bg-gray-100">
                <span className="text-[10px] font-medium text-gray-600 bg-white rounded-full px-2 py-0.5">
                    {label}
                </span>
            </div>
        )
    }

    return (
        <div className="flex border-b border-gray-200">
            <div className="w-48 shrink-0 border-r border-gray-200 bg-gray-100" />
            <div className="flex flex-1">
                {headers}
            </div>
        </div>
    )
}
