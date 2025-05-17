import { Project } from "@/lib/types";
import { Button } from "@heroui/button";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";

function ProjectCard({ project }: { project: Project }) {
    return (
        <Card>
            <CardHeader>
                {project.name}
            </CardHeader>
            <CardBody>
                <p>{project.description}</p>
            </CardBody>
            <CardFooter className="justify-between">
                <Button variant="flat" color="success">Edit</Button>
                <Button variant="flat" color="danger">Delete</Button>
            </CardFooter>
        </Card>
    )
}

const project: Project = {
    id: "1",
    name: "Project 1",
    description: "Description of project 1",
    clips: [
        {
            data: [
                {
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
                {
                    title: "Clip 1",
                }
            ]
        }
    ],
    url: ""
}

export default function Projects() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Your Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProjectCard project={project} />
                <ProjectCard project={project} />
                <ProjectCard project={project} />
            </div>
        </div>
    )
}