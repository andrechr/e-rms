import type { Person } from '../../types/timeline'

interface Props {
    person: Person
    weeks: number
}

export default function PersonRow({ person, weeks }: Props) {
    return (
        <div className="flex border-b border-gray-200 hover:bg-gray-50">
            <div className="w-48 shrink-0 px-4 py-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">{person.name}</div>
                <div className="text-xs text-gray-500">{person.role}</div>
            </div>
            <div className="flex flex-1 relative">
                {Array.from({ length: weeks }, (_, i) => (
                    <div key={i} className="flex-1 border-r border-gray-100" />
                ))}
            </div>
        </div>
    )
}
