export interface Department {
    id: string
    name: string
    createdAt: string
}

export interface Employee {
    id: string
    name: string
    email: string
    departmentId: string | null
    department: Department | null
    role: string | null
    createdAt: string
}

export interface CreateEmployeeInput {
    name: string
    email: string
    departmentId?: string
    role?: string
}

export interface UpdateEmployeeInput extends CreateEmployeeInput {
    id: string
}
