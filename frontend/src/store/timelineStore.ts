import { create } from 'zustand'
import type { Project, Allocation } from '../types/timeline'
import { dummyProjects, dummyAllocations } from '../data/dummyData'

interface TimelineState {
    projects: Project[]
    allocations: Allocation[]
    addAllocation: (allocation: Allocation) => void
    updateAllocation: (id: string, startDate: string, endDate: string) => void
}

export const useTimelineStore = create<TimelineState>((set) => ({
    projects: dummyProjects,
    allocations: dummyAllocations,
    addAllocation: (allocation) => set((state) => ({
        allocations: [...state.allocations, allocation],
    })),
    updateAllocation: (id, startDate, endDate) => set((state) => ({
        allocations: state.allocations.map(a =>
            a.id === id ? { ...a, startDate, endDate } : a
        ),
    })),
}))
