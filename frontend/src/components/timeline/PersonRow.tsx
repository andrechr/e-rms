import type { Allocation, Person, Project } from '../../types/timeline'
import AllocationBar from './AllocationBar'

interface Props {
    person: Person
    weeks: number
    allocations: Allocation[]
    projects: Project[]
    startDate: string
}

export default function PersonRow({ person, weeks, allocations, projects, startDate }: Props) {
    const myAllocations = allocations.filter(a => a.personId === person.id)
    const timelineStart = new Date(startDate).getTime()
    const totalMs = weeks * 7 * 24 * 60 * 60 * 1000

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
                {myAllocations.map(allocation => {
                    const project = projects.find(p => p.id === allocation.projectId)
                    if (!project) return null
                    const start = new Date(allocation.startDate).getTime()
                    const end = new Date(allocation.endDate).getTime()
                    const left = ((start - timelineStart) / totalMs) * 100
                    const width = ((end - start) / totalMs) * 100
                    return (
                        <AllocationBar
                            key={allocation.id}
                            left={left}
                            width={width}
                            color={project.color}
                            label={project.name}
                        />
                    )
                })}
            </div>
        </div>
    )
}
