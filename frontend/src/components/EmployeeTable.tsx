import type { Employee } from '../types/employee'

interface Props {
    employees: Employee[]
    onEdit: (employee: Employee) => void
    onDelete: (employee: Employee) => void
}

export default function EmployeeTable({ employees, onEdit, onDelete }: Props) {
    return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                <td className="px-6 py-4 text-gray-600">{emp.department ?? '—'}</td>
                <td className="px-6 py-4 text-gray-600">{emp.role ?? '—'}</td>
                <td className="px-6 py-4 flex gap-2">
                <button
                    onClick={() => onEdit(emp)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(emp)}
                    className="text-red-500 hover:text-red-700 font-medium"
                >
                    Delete
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    )
}