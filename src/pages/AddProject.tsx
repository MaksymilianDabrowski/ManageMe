import React, { useEffect, useState } from 'react'
import { LocalStorageRepository } from '../api/ApiService'
import { ProjectService } from '../services/ProjectService'
import { Project } from '../models/ProjectModel'

export default function AddProject() {
    const [projects, setProjects] = useState<Project[]>([])
    const [projectName, setProjectName] = useState("")
    const [projectDesc, setProjectDesc] = useState("")

    useEffect(() => {
        refreshProjectList();
    }, []);

    const projectService = new ProjectService(new LocalStorageRepository())

    const handleAddProject = async (event: React.FormEvent) => {
        event.preventDefault();

        if (projectName && projectDesc) {
            await projectService.createProject(projectName, projectDesc)
            setProjectName("")
            setProjectDesc("")
            refreshProjectList()
        }
    }

    const refreshProjectList = async () => {
        const projects = await projectService.readProjects();
        setProjects(projects);
    };

    const handleEditProject = async (id: string) => {
        const newName = prompt('Nowa nazwa projektu:');
        const newDescription = prompt('Nowy opis projektu:');

        if (newName !== null && newDescription !== null) {
            const updated = await projectService.updateProject(id, newName, newDescription);
            if (updated) {
                refreshProjectList();
            } else {
                alert('Nie można zaktualizować projektu - projekt o podanym ID nie istnieje.');
            }
        }
    };

    const handleDeleteProject = async (id: string) => {
        const deleted = await projectService.deleteProject(id);
        if (deleted) {
            refreshProjectList();
        } else {
            alert('Nie można usunąć projektu - projekt o podanym ID nie istnieje.');
        }
    };

    return (
        <div>
            <form onSubmit={handleAddProject}>
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project Name"
                    required
                />
                <input
                    type="text"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Project Description"
                    required
                />
                <button type="submit">Add Project</button>
            </form>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        {project.name} - {project.desc}
                        <button onClick={() => handleEditProject(project.id)}>Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
