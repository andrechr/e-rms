import { useState, useEffect } from 'react'
import { useEmployeeStore } from './store/employeeStore'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from './types/employee'
import EmployeeTable from './components/EmployeeTable'
import SearchBar from './components/SearchBar'
import EmployeeModal from './components/EmployeeModal'
import DeleteConfirm from './components/DeleteConfirm'
import { Toaster } from 'react-hot-toast'

export default function App() {
    const { employees, fetchAll, addEmployee, editEmployee, removeEmployee } = useEmployeeStore()

    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)

    useEffect(() => {
        fetchAll()
    }, [])

    const filtered = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee)
        setModalOpen(true)
    }

    const handleDelete = (employee: Employee) => {
        setDeleteTarget(employee)
    }

    const handleSubmit = async (data: CreateEmployeeInput) => {
        if (selectedEmployee) {
          await editEmployee({ ...data, id: selectedEmployee.id } as UpdateEmployeeInput)
        } else {
          await addEmployee(data)
        }
        setSelectedEmployee(null)
    }

    const handleConfirmDelete = async () => {
        if (deleteTarget) {
          await removeEmployee(deleteTarget.id)
          setDeleteTarget(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Employee Directory</h1>
              <button
                onClick={() => { setSelectedEmployee(null); setModalOpen(true) }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                + Add Employee
              </button>
            </div>
            <div className="mb-4">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <EmployeeTable
              employees={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <EmployeeModal
              isOpen={modalOpen}
              employee={selectedEmployee}
              onClose={() => { setModalOpen(false); setSelectedEmployee(null) }}
              onSubmit={handleSubmit}
            />
            <DeleteConfirm
              employee={deleteTarget}
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeleteTarget(null)}
            />
            <Toaster position="bottom-right" />
          </div>
        </div>
    )
}