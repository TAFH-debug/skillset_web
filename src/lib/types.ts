export interface Clip {
    data: [
        {
            url: string;
        },
        {
            title: string;
        }
    ]
}

export interface Project {
    id: string;
    name: string;
    description: string;
    url: string;
    clips: Clip[];
}