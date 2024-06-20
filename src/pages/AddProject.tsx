import React, { useEffect, useState } from 'react'
import { LocalStorageRepository } from '../api/ApiService'
import { ProjectService } from '../services/ProjectService'
import { Project } from '../models/ProjectModel'
import { Link, useNavigate } from 'react-router-dom'

export default function AddProject() {
    const [projects, setProjects] = useState<Project[]>([])
    const [projectName, setProjectName] = useState("")
    const [projectDesc, setProjectDesc] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        refreshProjectList();
    }, []);

    const projectService = new ProjectService(new LocalStorageRepository())

    const refreshProjectList = async () => {
        const projects = await projectService.readProjects();
        setProjects(projects);
    };

    const handleCreateProject = async (event: React.FormEvent) => {
        event.preventDefault();

        if (projectName && projectDesc) {
            await projectService.createProject(projectName, projectDesc)
            setProjectName("")
            setProjectDesc("")
            refreshProjectList()
        }
    }

    // update dla edycji projektu

    const handleEditProject = async (id: string) => {
        const updName = prompt('Nowa nazwa projektu:');
        const updDescription = prompt('Nowy opis projektu:');

        if (updName !== null && updDescription !== null) {
            const updated = await projectService.updateProject(id, updName, updDescription);
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

    const handleOpenProject = (id: string) => {
        projectService.setCurrentProject(id);
        navigate(`/projects/${id}/story`);
    };

    return (
        <div className="w-full m-auto justify-center items-center py-12">
            <form onSubmit={handleCreateProject}>
                <h1 className="text-4xl font-bold text-center text-[#2c2c2c] mb-8">Dodaj projekt</h1>
                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                    <div className="flex flex-wrap m-2">
                        <div className="p-2 w-full">
                            <div className="relative">
                                <label className="leading-7 text-sm text-[#3d3d3d]">
                                    Nazwa projektu
                                </label>
                                <input
                                    name="Name"
                                    autoComplete="off"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                        </div>
                        <div className="p-2 w-full">
                            <div className="relative">
                                <label className="leading-7 text-sm text-[#3d3d3d]">
                                    Opis projektu
                                </label>
                                <textarea
                                    name="Desc"
                                    autoComplete="off"
                                    value={projectDesc}
                                    onChange={(e) => setProjectDesc(e.target.value)}
                                    required
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                />
                            </div>
                        </div>
                        <div className="p-10 m-8 w-full">
                            <button
                                type='submit'
                                className="flex mx-auto text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg "
                            >
                                Zatwierdź
                            </button>
                        </div>
                        <Link
                            to="/"
                            className="flex mx-auto text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mb-16"
                        >Powrót
                        </Link>
                    </div>
                </div>
            </form>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}
                        className="text-[#2c2c2c] text-4xl border-4 mb-16 p-6">
                        {project.name} - {project.desc}
                        <button
                            onClick={() => handleOpenProject(project.id)} // open 
                            className="flex mx-auto text-white bg-gray-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                            Otwórz projekt
                        </button>
                        <button
                            onClick={() => handleEditProject(project.id)}
                            className="flex mx-auto text-white bg-yellow-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mt-4 mb-4">
                            Edytuj projekt
                        </button>
                        <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg">
                            Usuń projekt
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
