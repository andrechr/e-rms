export interface Project {
    id: string
    name: string
    color: string
}

export interface Allocation {
    id: string
    personId: string
    projectId: string
    startDate: string
    endDate: string
    utilization: number
}
