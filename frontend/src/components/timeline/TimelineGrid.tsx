import { useMemo } from 'react'
import { useTimelineStore } from '../../store/timelineStore'
import { useEmployeeStore } from '../../store/employeeStore'
import { useAppStore } from '../../store/appStore'
import { MS_PER_WEEK } from '../../utils/timeline'
import TimelineHeader from './TimelineHeader'
import PersonRow from './PersonRow'

export default function TimelineGrid() {
    const { allocations, projects } = useTimelineStore()
    const demoMode = useAppStore(state => state.demoMode)
    const pool = useEmployeeStore(state => state.pool)
    const people = demoMode ? pool : []

    const { startDate, weeks } = useMemo(() => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 3, 0)
        const weeks = Math.ceil((end.getTime() - start.getTime()) / MS_PER_WEEK)
        return {
            startDate: start.toISOString().split('T')[0],
            weeks,
        }
    }, [])

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TimelineHeader startDate={startDate} weeks={weeks} />
            {people.map((person) => (
                <PersonRow key={person.id} person={person} weeks={weeks} allocations={allocations} projects={projects} startDate={startDate} />
            ))}
        </div>
    )
}
