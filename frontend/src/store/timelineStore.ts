import { create } from 'zustand';
import type { Person, Project, Allocation } from '../types/timeline';

interface TimelineState {
  people: Person[];
  projects: Project[];
  allocations: Allocation[];
  demoMode: boolean;
  addAllocation: (allocation: Allocation) => void;
  updateAllocation: (id: number, startDate: string, endDate: string) => void;
  setDemoMode: (mode: boolean) => void;
}

const dummyPeople: Person[] = [
    { id: 1, name: 'Tony Stark', role: 'Engineer' },
    { id: 2, name: 'Mark Ruffalo', role: 'Designer' },
    { id: 3, name: 'Natasha Romanoff', role: 'Manager' },
    { id: 4, name: 'Steve Rogers', role: 'Engineer' },
]

const dummyProjects: Project[] = [
    { id: 1, name: 'Project Alpha', color: '#6366f1' },
    { id: 2, name: 'Project Beta', color: '#f59e0b' },
    { id: 3, name: 'Project Gamma', color: '#10b981' },
]

const dummyAllocations: Allocation[] = [
    { id: 1, personId: 1, projectId: 1, startDate: '2026-06-01', endDate: '2026-06-15', utilization: 100 },
    { id: 2, personId: 1, projectId: 2, startDate: '2026-06-16', endDate: '2026-06-30', utilization: 50 },
    { id: 3, personId: 2, projectId: 2, startDate: '2026-06-01', endDate: '2026-06-30', utilization: 100 },
    { id: 4, personId: 3, projectId: 3, startDate: '2026-06-10', endDate: '2026-06-25', utilization: 75 },
    { id: 5, personId: 4, projectId: 1, startDate: '2026-06-05', endDate: '2026-06-20', utilization: 50 },
]

export const useTimelineStore = create<TimelineState>((set) => ({
    people: dummyPeople,
    projects: dummyProjects,
    allocations: dummyAllocations,
    demoMode: true,
    addAllocation: (allocation: Allocation) => set((state) => ({
        allocations: [...state.allocations, allocation],
    })),
    updateAllocation: (id: number, startDate: string, endDate: string) => set((state) => ({
        allocations: state.allocations.map(a =>
              a.id === id ? { ...a, startDate, endDate } : a
          ),
    })),
    setDemoMode: (mode: boolean) => set({ demoMode: mode }),
}));