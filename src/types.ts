export type Page = 'landing' | 'auth' | 'dashboard' | 'portfolio' | 'jobs' | 'applications' | 'public' | 'admin' | 'post-job' | 'review-application';

export interface User {
    id: string;
    email: string;
    name?: string;
    full_name?: string;
    role: 'seeker' | 'hirer' | 'admin';
    avatar_url?: string;
}
