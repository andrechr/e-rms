import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
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
            </nav>
            <Outlet />
        </div>
    )
}
