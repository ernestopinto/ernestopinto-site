export type ProjectStatus =
    | 'active'
    | 'maintained'
    | 'archived'
    | 'experiment'

export type Project = {
    id: string
    name: string
    description: string
    status: ProjectStatus
    featured?: boolean
    tags: string[]
    tech: string[]
    githubUrl?: string
    demoUrl?: string
    stars?: number
    forks?: number
    updatedAt?: string // ISO string
}
