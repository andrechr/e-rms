import { useMemo } from 'react'
import { useTimelineStore } from '../../store/timelineStore'
import TimelineHeader from './TimelineHeader'  
import PersonRow from './PersonRow'

export default function TimelineGrid() {
    const { people, allocations, projects } = useTimelineStore()
    const { startDate, weeks } = useMemo(() => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          const end = new Date(now.getFullYear(), now.getMonth() + 4, 0)
          const weeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))
          return {
              startDate: start.toISOString().split('T')[0],
              weeks,
          }
    },[])
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <TimelineHeader startDate={startDate} weeks={weeks} />
            {people.map((person) => (
                <PersonRow key={person.id} person={person} weeks={weeks} allocations={allocations} projects={projects} startDate={startDate} />
            ))}
        </div>
    )
}
