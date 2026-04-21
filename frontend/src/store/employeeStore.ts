import { create } from 'zustand'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee'

interface EmployeeStore {
    employees: Employee[]
    loading: boolean
    error: string | null
    fetchAll: () => Promise<void>
    addEmployee: (data: CreateEmployeeInput) => Promise<void>
    editEmployee: (data: UpdateEmployeeInput) => Promise<void>
    removeEmployee: (id: string) => Promise<void>
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    employees: [],
    loading: false,
    error: null,

    fetchAll: async () => {
    set({ loading: true, error: null })
    const res = await fetch(`${API}/employees`)
    const data = await res.json()
    set({ employees: data, loading: false })
    },

    addEmployee: async (input) => {
    const res = await fetch(`${API}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })
    const employee = await res.json()
    set((state) => ({ employees: [...state.employees, employee] }))
    },

    editEmployee: async ({ id, ...data }) => {
    const res = await fetch(`${API}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    const updated = await res.json()
    set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? updated : e)),
    }))
    },

    removeEmployee: async (id) => {
    await fetch(`${API}/employees/${id}`, { method: 'DELETE' })
    set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
    }))
    },
}))