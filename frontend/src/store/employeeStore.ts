import { create } from 'zustand'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee'
import toast from 'react-hot-toast'

interface EmployeeStore {
    employees: Employee[]
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

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
    employees: [],
    loading: false,
    error: null,
    limit: 5,
    page: 1,
    total: 0,
    totalPages: 1,

    fetchAll: async () => {
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