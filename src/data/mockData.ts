export const mockUserProfile = {
    id: 'mock-user-id',
    email: 'jane.doe@craftfolio.com',
    full_name: 'Jane Doe',
    title: 'Senior Product Designer',
    bio: 'Passionate product designer with over 8 years of experience in building digital experiences. Specialized in UI/UX, Design Systems, and Prototyping. Dedicated to creating intuitive and impactful user journeys.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'seeker',
    resume_url: '#',
    social_links: {
        github: 'https://github.com/janedoe',
        linkedin: 'https://linkedin.com/in/janedoe',
        website: 'https://janedoe.design'
    },
    skills: [
        'User Interface Design', 'User Experience (UX)', 'Figma', 'Prototyping',
        'HTML/CSS', 'React Basic', 'Design Systems', 'Agile Methodology',
        'User Research', 'Wireframing'
    ],
    experience: [
        {
            id: '1',
            title: 'Senior Product Designer',
            position: 'Senior Product Designer',
            company: 'TechFlow Solutions',
            location: 'San Francisco, CA',
            start_date: '2021-03',
            end_date: null,
            current: true,
            duration: '2021 - Present',
            description: 'Leading the design team for the core SaaS product. Implemented a new design system that improved development velocity by 40%.',
            technologies: ['Figma', 'React', 'Jira']
        },
        {
            id: '2',
            title: 'Product Designer',
            position: 'Product Designer',
            company: 'Creative Pulse',
            location: 'New York, NY',
            start_date: '2018-06',
            end_date: '2021-02',
            current: false,
            duration: '2018 - 2021',
            description: 'Designed mobile-first interfaces for fintech clients. Collaborated closely with engineers to ensure pixel-perfect implementation.',
            technologies: ['Adobe XD', 'Sketch', 'Zeplin']
        },
        {
            id: '3',
            title: 'Junior UX Designer',
            position: 'Junior UX Designer',
            company: 'StartUp Inc',
            location: 'Remote',
            start_date: '2016-05',
            end_date: '2018-05',
            current: false,
            duration: '2016 - 2018',
            description: 'Conducted user research and usability testing. Created wireframes and user flows for new feature development.',
            technologies: ['Balsamiq', 'InVision']
        }
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Fine Arts in Interaction Design',
            school: 'California College of the Arts',
            location: 'San Francisco, CA',
            start_date: '2012-09',
            end_date: '2016-05',
            description: 'Graduated with Honors. Senior thesis focused on accessible design patterns for elderly users.'
        }
    ],
    projects: [
        {
            id: '1',
            title: 'E-Commerce Dashboard Redesign',
            description: 'Complete overhaul of an analytics dashboard for a major e-commerce platform. Improved user engagement by 25%.',
            image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            link: 'https://dribbble.com',
            technologies: ['Figma', 'Data Viz', 'Dashboard']
        },
        {
            id: '2',
            title: 'Fintech Mobile App',
            description: 'Designed a secure and user-friendly mobile banking application. Featured biometric login and budget tracking tools.',
            image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
            link: 'https://behance.net',
            technologies: ['iOS Design', 'Android', 'Mobile']
        },
        {
            id: '3',
            title: 'Travel Booking System',
            description: 'A responsive web application for booking flights and hotels. Focused on simplifying the complex checkout process.',
            image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
            link: '#',
            technologies: ['Web Design', 'Responsive', 'prototyping']
        }
    ]
};
