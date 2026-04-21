import { useState, useEffect } from 'react'
import type { Employee, CreateEmployeeInput } from '../types/employee'

interface Props {
    isOpen: boolean
    employee: Employee | null
    onClose: () => void
    onSubmit: (data: CreateEmployeeInput) => void
}

export default function EmployeeModal({ isOpen, employee, onClose, onSubmit }: Props) {
    const [form, setForm] = useState({ name: '', email: '', department: '', role: '' })

    useEffect(() => {
    if (employee) {
        setForm({
        name: employee.name,
        email: employee.email,
        department: employee.department ?? '',
        role: employee.role ?? '',
        })
    } else {
        setForm({ name: '', email: '', department: '', role: '' })
    }
    }, [employee])

    if (!isOpen) return null

    const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
    }

    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
            {employee ? 'Edit Employee' : 'Add Employee'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Cancel
            </button>
            <button type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {employee ? 'Save Changes' : 'Add Employee'}
            </button>
            </div>
        </form>
        </div>
    </div>
    )
}