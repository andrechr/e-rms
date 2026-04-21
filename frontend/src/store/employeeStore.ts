import { create } from 'zustand'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '../types/employee'
import toast from 'react-hot-toast'

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
      try {
        const res = await fetch(`${API}/employees`)
        const data = await res.json()
        set({ employees: data, loading: false })
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
        const employee = await res.json()
        set((state) => ({ employees: [...state.employees, employee] }))
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
        const updated = await res.json()
        set((state) => ({
          employees: state.employees.map((e) => (e.id === id ? updated : e)),
        }))
        toast('Employee updated!', { icon: 'ℹ️ ' })
      } catch {
        toast.error('Failed to update employee')
      }
    },

    removeEmployee: async (id) => {
      try {
        await fetch(`${API}/employees/${id}`, { method: 'DELETE' })
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        }))
        toast('Employee deleted!', { icon: '🗑️' })
      } catch {
        toast.error('Failed to delete employee')
      }
    },
}))