import type { Project } from '@/types/projects'

export const PROJECTS: Project[] = [
    {
        id: 'tracer',
        name: 'Tracer',
        description:
            'Interactive function tracer/plotter built with Vue + Tailwind. Published as an npm package — install with `npm install @ernestopinto/tracer` — and embeddable as a live component.',
        status: 'active',
        featured: true,
        tags: ['personal', 'frontend', 'math', 'npm'],
        tech: ['Vue', 'Vite', 'TypeScript', 'Tailwind', 'NPM'],
        githubUrl: 'https://github.com/ernestopinto/tracer',
        updatedAt: '2026-01-16',
    },
    {
        id: 'clapline',
        name: 'Clapline',
        description:
            'Experimental playground for video-editing tools. Pointer scrubbing on the timeline updates playback time and sets the TCIN marker. Play a single subsection or play all subsections sequentially',
        status: 'active',
        featured: true,
        tags: ['personal', 'frontend', 'math', 'npm'],
        tech: ['Angular', 'TypeScript', 'Tailwind', 'NPM'],
        githubUrl: 'https://github.com/ernestopinto/clapline',
        demoUrl: 'https://ernestopinto.github.io/clapline/',
        updatedAt: '2026-01-26',
    },
    {
        id: 'korma',
        name: 'Korma',
        description:
            'Multicontext implementation of an web API on top of Javalin.',
        status: 'maintained',
        featured: true,
        tags: ['work', 'backend', 'scripting'],
        tech: ['Java', 'KOTLIN'],
        githubUrl: 'https://github.com/ernestopinto/Korma',
        updatedAt: '2026-01-03',
    },
    {
        id: 'nuxt',
        name: 'Nuxt-base-static',
        description:
            'NUTX implementation example for STATIC / NO SSR WEB APP.',
        status: 'active',
        featured: true,
        tags: ['javascript', 'NEXT', 'SSR'],
        tech: ['Nutx','Next', 'Vite', 'TypeScript', 'SSR'],
        githubUrl: 'https://github.com/ernestopinto/nuxt-base-static',
        updatedAt: '2020-01-05',
    },
    {
        id: 'Arkoflight-nuxt',
        name: 'Arkoflight',
        description:
            'VUE/NUXT Implementation - Arkoflight code base.',
        status: 'archived',
        featured: false,
        tags: ['Vue', 'javascript', 'NEXT', 'SSR'],
        tech: ['Vue', 'Vite', 'TypeScript', 'Tailwind', 'i18n'],
        githubUrl: 'https://github.com/ernestopinto/nuxt-base-static',
        updatedAt: '2015-01-05',
    },
    {
        id: 'channels',
        name: 'Angular Channels',
        description:
            'Demonstration of the use of a Behaviour Subjects single pattern regarding state transition on a very minimalistic but powerful way.',
        status: 'maintained',
        featured: true,
        tags: ['Frontend', 'javascript', 'Angular'],
        tech: ['Angular', 'Vite', 'TypeScript', 'Tailwind'],
        githubUrl: 'https://github.com/ernestopinto/angularchannels',
        updatedAt: '2019-07-25',
    },
    {
        id: 'arcadeluz',
        name: 'Arcadeluz',
        description:
            'Photography ecosystem: galleries, blog, metadata tagging, ImageKit integration, and a growing creative archive.',
        status: 'maintained',
        featured: true,
        tags: ['personal', 'photography', 'backend', 'frontend'],
        tech: ['Laravel', 'Postgres', 'Blade', 'ImageKit', 'Tailwind', 'AI Google Vision', 'Vanilla Javascript', 'Typescript', 'REST'],
        demoUrl: 'https://arcadeluz.net',
        githubUrl: '',
        updatedAt: '2025-12-22',
    },
    {
        id: 'ernestopinto-site',
        name: 'ernestopinto.net',
        description:
            'Personal site built with Vue 3 + Vite + i18n. Essays, projects, and experiments.',
        status: 'active',
        featured: false,
        tags: ['personal', 'writing'],
        tech: ['Vue', 'Vite', 'TypeScript', 'Tailwind', 'i18n'],
        githubUrl: 'https://github.com/your-user/your-repo',
        updatedAt: '2026-01-05',
    },
    {
        id: 'teotokos-site',
        name: 'TEOTOKOS - A Remix Project',
        description:
            'Example of a Remix site that can be deployed to Vercel with zero configuration.',
        status: 'active',
        featured: true,
        tags: ['frontend', 'javascript'],
        tech: ['Remix', 'Vite', 'TypeScript', 'Tailwind'],
        githubUrl: 'https://github.com/ernestopinto/teotokos-remix-project',
        updatedAt: '2022-01-09',
    },
]
