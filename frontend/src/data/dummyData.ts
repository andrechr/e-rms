import type { Employee, Department } from '../types/employee'
import type { Project, Allocation } from '../types/timeline'

export const dummyDepartments: Department[] = [
    { id: 'dept-1', name: 'Engineering', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'dept-2', name: 'Design', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'dept-3', name: 'Management', createdAt: '2026-01-01T00:00:00.000Z' },
]

const depts = dummyDepartments

export const dummyEmployees: Employee[] = [
    { id: 'emp-1', name: 'Tony Stark', email: 'tony@avengers.io', role: 'Engineer', departmentId: 'dept-1', department: depts[0], createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'emp-2', name: 'Mark Ruffalo', email: 'mark@avengers.io', role: 'Designer', departmentId: 'dept-2', department: depts[1], createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'emp-3', name: 'Natasha Romanoff', email: 'natasha@avengers.io', role: 'Manager', departmentId: 'dept-3', department: depts[2], createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'emp-4', name: 'Steve Rogers', email: 'steve@avengers.io', role: 'Engineer', departmentId: 'dept-1', department: depts[0], createdAt: '2026-01-01T00:00:00.000Z' },
]

export const dummyProjects: Project[] = [
    { id: 'proj-1', name: 'Project Alpha', color: '#6366f1' },
    { id: 'proj-2', name: 'Project Beta', color: '#f59e0b' },
    { id: 'proj-3', name: 'Project Gamma', color: '#10b981' },
]

export const dummyAllocations: Allocation[] = [
    { id: 'alloc-1', personId: 'emp-1', projectId: 'proj-1', startDate: '2026-06-01', endDate: '2026-06-15', utilization: 100 },
    { id: 'alloc-2', personId: 'emp-1', projectId: 'proj-2', startDate: '2026-06-16', endDate: '2026-06-30', utilization: 50 },
    { id: 'alloc-3', personId: 'emp-2', projectId: 'proj-2', startDate: '2026-06-01', endDate: '2026-06-30', utilization: 100 },
    { id: 'alloc-4', personId: 'emp-3', projectId: 'proj-3', startDate: '2026-06-10', endDate: '2026-06-25', utilization: 75 },
    { id: 'alloc-5', personId: 'emp-4', projectId: 'proj-1', startDate: '2026-06-05', endDate: '2026-06-20', utilization: 50 },
]
