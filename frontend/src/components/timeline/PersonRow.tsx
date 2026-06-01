import { useRef, useState } from 'react'
import type { Employee } from '../../types/employee'
import type { Allocation, Project } from '../../types/timeline'
import { MS_PER_WEEK, snapToDay } from '../../utils/timeline'
import { useTimelineStore } from '../../store/timelineStore'
import AllocationBar from './AllocationBar'

interface Props {
    person: Employee
    weeks: number
    allocations: Allocation[]
    projects: Project[]
    startDate: string
}

interface GhostBar {
    left: number
    width: number
}

export default function PersonRow({ person, weeks, allocations, projects, startDate }: Props) {
    const myAllocations = allocations.filter(a => a.personId === person.id)
    const timelineStart = new Date(startDate).getTime()
    const totalMs = weeks * MS_PER_WEEK

    function pctToMs(pct: number) {
        return timelineStart + (pct / 100) * totalMs
    }

    function snapPct(pct: number) {
        return ((snapToDay(pctToMs(pct)) - timelineStart) / totalMs) * 100
    }

    const dragStartX = useRef<number | null>(null)
    const rowRef = useRef<HTMLDivElement>(null)
    const [ghostBar, setGhostBar] = useState<GhostBar | null>(null)
    const addAllocation = useTimelineStore(state => state.addAllocation)
    const updateAllocation = useTimelineStore(state => state.updateAllocation)

    function handleMouseDown(e: React.MouseEvent) {
        e.preventDefault()
        dragStartX.current = e.clientX
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (dragStartX.current === null || !rowRef.current) return
        const rowRect = rowRef.current.getBoundingClientRect()
        const rowWidth = rowRect.width
        const startPct = ((dragStartX.current - rowRect.left) / rowWidth) * 100
        const endPct = ((e.clientX - rowRect.left) / rowWidth) * 100
        const snappedStart = snapPct(Math.min(startPct, endPct))
        const snappedEnd = snapPct(Math.max(startPct, endPct))
        setGhostBar({ left: snappedStart, width: snappedEnd - snappedStart })
    }

    function handleMouseUp(e: React.MouseEvent) {
        if (dragStartX.current === null || !rowRef.current) return
        const rowRect = rowRef.current.getBoundingClientRect()
        const rowWidth = rowRect.width
        const startPct = (dragStartX.current - rowRect.left) / rowWidth
        const endPct = (e.clientX - rowRect.left) / rowWidth
        const startMs = snapToDay(timelineStart + Math.min(startPct, endPct) * totalMs)
        const endMs = snapToDay(timelineStart + Math.max(startPct, endPct) * totalMs)
        const toDate = (ms: number) => new Date(ms).toISOString().split('T')[0]
        addAllocation({
            id: crypto.randomUUID(),
            personId: person.id,
            projectId: 'proj-1',
            startDate: toDate(startMs),
            endDate: toDate(endMs),
            utilization: 100,
        })
        dragStartX.current = null
        setGhostBar(null)
    }

    return (
        <div className="flex border-b border-gray-200 hover:bg-gray-50">
            <div className="w-48 shrink-0 px-4 py-3 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-900">{person.name}</div>
                <div className="text-xs text-gray-500">{person.role}</div>
            </div>
            <div
                ref={rowRef}
                className="flex flex-1 relative cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
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
                            allocationId={allocation.id}
                            left={left}
                            width={width}
                            color={project.color}
                            label={project.name}
                            timelineStart={timelineStart}
                            totalMs={totalMs}
                            onUpdate={updateAllocation}
                        />
                    )
                })}
                {ghostBar && (
                    <div
                        className="absolute top-1.5 bottom-1.5 rounded-full bg-indigo-300 opacity-60 pointer-events-none"
                        style={{ left: `${ghostBar.left}%`, width: `${ghostBar.width}%` }}
                    />
                )}
            </div>
        </div>
    )
}
