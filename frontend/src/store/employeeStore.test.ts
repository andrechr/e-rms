import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useEmployeeStore } from './employeeStore'

// Mock react-hot-toast so toast calls don't throw in test env
vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

const mockEmployee = {
  id: '1',
  name: 'Boodi Santoso',
  email: 'boodi@example.com',
  department: 'Engineering',
  role: 'Developer',
  createdAt: '2024-01-01T00:00:00.000Z',
}

const mockEmployee2 = {
  id: '2',
  name: 'Maja Putri',
  email: 'maja@example.com',
  department: 'HR',
  role: 'Manager',
  createdAt: '2024-01-02T00:00:00.000Z',
}

function mockFetch(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => body,
  })
}

beforeEach(() => {
  useEmployeeStore.setState({ employees: [], loading: false, error: null, page: 1, limit: 5, total: 0, totalPages: 1 })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchAll', () => {
  it('loads employees into state on success', async () => {
    vi.stubGlobal('fetch', mockFetch({ data: [mockEmployee, mockEmployee2], total: 2, page: 1, limit: 5, totalPages: 1 }))

    await useEmployeeStore.getState().fetchAll()

    const { employees, loading, error } = useEmployeeStore.getState()
    expect(employees).toHaveLength(2)
    expect(employees[0].name).toBe('Boodi Santoso')
    expect(loading).toBe(false)
    expect(error).toBeNull()
  })

  it('sets error state on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    await useEmployeeStore.getState().fetchAll()

    const { employees, loading, error } = useEmployeeStore.getState()
    expect(employees).toHaveLength(0)
    expect(loading).toBe(false)
    expect(error).toBe('Failed to fetch employees')
  })
})

describe('addEmployee', () => {
  it('appends new employee to state', async () => {
    useEmployeeStore.setState({ employees: [mockEmployee] })
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockEmployee2 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [mockEmployee, mockEmployee2], total: 2, page: 1, limit: 5, totalPages: 1 }) })
    )

    await useEmployeeStore.getState().addEmployee({
      name: 'Maja Putri',
      email: 'maja@example.com',
      department: 'HR',
      role: 'Manager',
    })

    const { employees } = useEmployeeStore.getState()
    expect(employees).toHaveLength(2)
    expect(employees[1].name).toBe('Maja Putri')
  })
})

describe('editEmployee', () => {
  it('updates the correct employee in state', async () => {
    useEmployeeStore.setState({ employees: [mockEmployee, mockEmployee2] })
    const updated = { ...mockEmployee, role: 'Senior Developer' }
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => updated })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [updated, mockEmployee2], total: 2, page: 1, limit: 5, totalPages: 1 }) })
    )

    await useEmployeeStore.getState().editEmployee({ id: '1', name: 'Boodi Santoso', email: 'boodi@example.com', role: 'Senior Developer' })

    const { employees } = useEmployeeStore.getState()
    expect(employees.find(e => e.id === '1')?.role).toBe('Senior Developer')
    expect(employees).toHaveLength(2)
  })
})

describe('removeEmployee', () => {
  it('removes the correct employee from state', async () => {
    useEmployeeStore.setState({ employees: [mockEmployee, mockEmployee2] })
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => null })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [mockEmployee2], total: 1, page: 1, limit: 5, totalPages: 1 }) })
    )

    await useEmployeeStore.getState().removeEmployee('1')

    const { employees } = useEmployeeStore.getState()
    expect(employees).toHaveLength(1)
    expect(employees[0].id).toBe('2')
  })
})
