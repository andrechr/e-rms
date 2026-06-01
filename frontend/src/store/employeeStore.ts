import { create } from 'zustand'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee'
import toast from 'react-hot-toast'
import { useAppStore } from './appStore'
import { dummyEmployees, dummyDepartments } from '../data/dummyData'

interface EmployeeStore {
    employees: Employee[]
    pool: Employee[]
    loading: boolean
    page: number
    limit: number
    total: number
    totalPages: number
    error: string | null
    fetchAll: () => Promise<void>
    addEmployee: (data: CreateEmployeeInput) => Promise<void>
    editEmployee: (data: UpdateEmployeeInput) => Promise<void>
    removeEmployee: (id: string) => Promise<void>
    setPage: (page: number) => void
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function slicePool(pool: Employee[], page: number, limit: number) {
    const start = (page - 1) * limit
    return {
        employees: pool.slice(start, start + limit),
        total: pool.length,
        totalPages: Math.ceil(pool.length / limit),
    }
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
    employees: [],
    pool: dummyEmployees,
    loading: false,
    error: null,
    limit: 5,
    page: 1,
    total: 0,
    totalPages: 1,

    fetchAll: async () => {
        const { demoMode } = useAppStore.getState()
        if (demoMode) {
            const { pool, page, limit } = get()
            set({ loading: false, error: null, ...slicePool(pool, page, limit) })
            return
        }
        set({ loading: true, error: null })
        try {
            const { page, limit } = get()
            const res = await fetch(`${API}/employees?page=${page}&limit=${limit}`)
            const json = await res.json()
            set({ employees: json.data, total: json.total, totalPages: json.totalPages, loading: false })
        } catch {
            set({ error: 'Failed to fetch employees', loading: false })
            toast.error('Failed to load employees')
        }
    },

    addEmployee: async (input) => {
        const { demoMode } = useAppStore.getState()
        if (demoMode) {
            const dept = input.departmentId
                ? (dummyDepartments.find(d => d.id === input.departmentId) ?? null)
                : null
            const newEmp: Employee = {
                id: crypto.randomUUID(),
                name: input.name,
                email: input.email,
                role: input.role || null,
                departmentId: input.departmentId || null,
                department: dept,
                createdAt: new Date().toISOString(),
            }
            const newPool = [...get().pool, newEmp]
            const { page, limit } = get()
            set({ pool: newPool, ...slicePool(newPool, page, limit) })
            toast.success('Employee added!')
            return
        }
        try {
            const res = await fetch(`${API}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            })
            if (!res.ok) {
                const err = await res.json()
                toast.error(err.error || 'Failed to add employee')
                return
            }
            await get().fetchAll()
            toast.success('Employee added!')
        } catch {
            toast.error('Failed to add employee')
        }
    },

    editEmployee: async ({ id, ...data }) => {
        const { demoMode } = useAppStore.getState()
        if (demoMode) {
            const newPool = get().pool.map(e =>
                e.id === id ? { ...e, ...data, role: data.role || null, departmentId: data.departmentId || null } : e
            )
            const { page, limit } = get()
            set({ pool: newPool, ...slicePool(newPool, page, limit) })
            toast('Employee updated!', { icon: 'ℹ️ ' })
            return
        }
        try {
            const res = await fetch(`${API}/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const err = await res.json()
                toast.error(err.error || 'Failed to update employee')
                return
            }
            await get().fetchAll()
            toast('Employee updated!', { icon: 'ℹ️ ' })
        } catch {
            toast.error('Failed to update employee')
        }
    },

    removeEmployee: async (id) => {
        const { demoMode } = useAppStore.getState()
        if (demoMode) {
            const newPool = get().pool.filter(e => e.id !== id)
            const { page, limit } = get()
            set({ pool: newPool, ...slicePool(newPool, page, limit) })
            toast('Employee deleted!', { icon: '🗑️' })
            return
        }
        try {
            await fetch(`${API}/employees/${id}`, { method: 'DELETE' })
            await get().fetchAll()
            toast('Employee deleted!', { icon: '🗑️' })
        } catch {
            toast.error('Failed to delete employee')
        }
    },

    setPage: (page) => set({ page }),
}))
