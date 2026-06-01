import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useAppStore } from '../store/appStore'
import { useEmployeeStore } from '../store/employeeStore'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function AppLayout() {
    const { demoMode, setDemoMode } = useAppStore()
    const [checking, setChecking] = useState(false)

    async function handleToggle() {
        const next = !demoMode
        if (next === false) {
            setChecking(true)
            try {
                const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) })
                if (!res.ok) throw new Error()
            } catch {
                toast.error("Backend is offline. Let's stay in Dummy mode")
                setChecking(false)
                return
            }
            setChecking(false)
        }
        setDemoMode(next)
        useEmployeeStore.getState().fetchAll()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {checking && (
                <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center cursor-wait" />
            )}
            <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
                <span className="font-semibold text-gray-900">e-RMS</span>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'
                    }
                >
                    Timeline
                </NavLink>
                <NavLink
                    to="/employees"
                    className={({ isActive }) =>
                        isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'
                    }
                >
                    Employees
                </NavLink>
                <div className="ml-auto flex items-center gap-2 text-sm">
                    <span className={!demoMode ? 'font-medium text-gray-900' : 'text-gray-400'}>Real DB</span>
                    <button
                        onClick={handleToggle}
                        disabled={checking}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${demoMode ? 'bg-indigo-500' : 'bg-gray-300'} disabled:opacity-60`}
                    >
                        {checking ? (
                            <svg className="absolute inset-0 m-auto h-3 w-3 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${demoMode ? 'translate-x-5' : 'translate-x-1'}`} />
                        )}
                    </button>
                    <span className={demoMode ? 'font-medium text-gray-900' : 'text-gray-400'}>Dummy</span>
                </div>
            </nav>
            <Outlet />
            <Toaster position="bottom-right" />
        </div>
    )
}
