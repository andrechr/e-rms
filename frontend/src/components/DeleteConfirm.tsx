import type { Employee } from '../types/employee'

interface Props {
    employee: Employee | null
    onConfirm: () => void
    onCancel: () => void
}

export default function DeleteConfirm({ employee, onConfirm, onCancel }: Props) {
    if (!employee) return null

    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Delete Employee</h2>
        <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to delete <span className="font-medium text-gray-900">{employee.name}</span>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
            <button onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Cancel
            </button>
            <button onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
            </button>
        </div>
        </div>
    </div>
    )
}
