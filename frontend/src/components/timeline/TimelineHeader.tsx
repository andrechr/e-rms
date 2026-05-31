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
            <div key={i} className="flex-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 py-2">
                {label}
            </div>
        )
    }

    return (
        <div className="flex border-b border-gray-200 bg-gray-50 ml-48">
            {headers}
        </div>
    )
}
