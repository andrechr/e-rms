import { useState, useEffect } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'
import type { Department } from '../types/employee'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface Props {
    value: Department | null
    onChange: (department: Department) => void
}

export default function DepartmentCombobox({ value, onChange }: Props) {
    const [departments, setDepartments] = useState<Department[]>([])
    const [query, setQuery] = useState('')

    useEffect(() => {
        fetch(`${API}/departments`)
            .then((res) => res.json())
            .then(setDepartments)
    }, [])

    const filtered = query === ''
        ? departments
        : departments.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))

    const showCreate = query.trim() !== '' && !departments.some(
        (d) => d.name.toLowerCase() === query.trim().toLowerCase()
    )

    async function handleCreate() {
        const res = await fetch(`${API}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: query.trim() }),
        })
        const created: Department = await res.json()
        setDepartments((prev) => [...prev, created])
        onChange(created)
        setQuery('')
    }

    return (
        <Combobox value={value} onChange={(dept) => dept && onChange(dept)}>
            <div className="relative">
                <ComboboxInput
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Department"
                    displayValue={(dept: Department | null) => dept?.name ?? ''}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto text-sm">
                    {filtered.map((dept) => (
                        <ComboboxOption
                            key={dept.id}
                            value={dept}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-50 data-[focus]:bg-blue-50"
                        >
                            {dept.name}
                        </ComboboxOption>
                    ))}
                    {showCreate && (
                        <div
                            className="px-4 py-2 cursor-pointer text-blue-600 hover:bg-blue-50"
                            onMouseDown={handleCreate}
                        >
                            + Create "{query.trim()}"
                        </div>
                    )}
                    {filtered.length === 0 && !showCreate && (
                        <div className="px-4 py-2 text-gray-400">No departments found</div>
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    )
}
