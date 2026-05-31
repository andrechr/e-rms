import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import TimelinePage from './pages/timeline/TimelinePage'
import EmployeesPage from './pages/employees/EmployeesPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<TimelinePage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}