export interface Person {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string;
}
export interface Project {
    id: number;
    name: string;
    color: string;
}
export interface Allocation {
    id: number;
    personId: number;
    projectId: number;
    startDate: string;
    endDate: string;
    utilization: number; // percentage of time allocated
}