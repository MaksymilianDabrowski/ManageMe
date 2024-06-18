import { ApiService } from "../api/ApiService";
import { Project } from "../models/ProjectModel";

export class ProjectService {

    private apiCaller: ApiService

    constructor(apiCaller: ApiService) {
        this.apiCaller = apiCaller;
    }

    public async createProject(name: string, desc: string): Promise<void> {
        try {
            const projects = await this.apiCaller.getProject();
            const project: Project = {
                id: crypto.randomUUID(),
                name,
                desc,
            };
            projects.push(project);
            await this.apiCaller.setProject(projects);
        }
        catch (error) {
            console.error("Error creating project:", error);
        }
    }

    public async readProjects(): Promise<Project[]> {
        try {
            return await this.apiCaller.getProject();
        }
        catch (error) {
            console.error("Error reading projects:", error);
            return [];
        }
    }

    public async updateProject(id: string, updName: string, updDesc: string): Promise<boolean> {
        try {
            const projects = await this.apiCaller.getProject();
            const index = projects.findIndex((project) => project.id === id);
            if (index !== -1) {
                projects[index].name = updName;
                projects[index].desc = updDesc;
                await this.apiCaller.setProject(projects);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Error updating project:", error);
            return false;
        }
    }

    public async deleteProject(id: string): Promise<boolean> {
        try {
            const projects = await this.apiCaller.getProject();
            const updatedProjects = projects.filter((project) => project.id !== id);
            if (updatedProjects.length !== projects.length) {
                await this.apiCaller.setProject(updatedProjects);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Error deleting project:", error);
            return false;
        }
    }
}
