export interface Employee {
    id: string
    name: string
    email: string
    department: string | null
    role: string | null
    createdAt: string
}

export interface CreateEmployeeInput {
    name: string
    email: string
    department?: string
    role?: string
}

export interface UpdateEmployeeInput extends CreateEmployeeInput {
    id: string
}
