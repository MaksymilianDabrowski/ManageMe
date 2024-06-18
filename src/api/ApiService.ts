import { Project } from "../models/ProjectModel";

export interface ApiService {
    getProject(): Project[]
    setProject(projects: Project[]): void

    setCurrentProject(project: string): void;
    getProjectById(): string | null; //> ?
}

export class LocalStorageRepository implements ApiService {
    private static storageKey = "projects";
    static currentProjectKey = "projectById";

    public getProject(): Project[] {
        const projectData = localStorage.getItem(LocalStorageRepository.storageKey)
        return projectData ? JSON.parse(projectData) : [];
    }

    public setProject(projects: Project[]): void {
        localStorage.setItem(LocalStorageRepository.storageKey, JSON.stringify(projects))
    }

    public setCurrentProject(projectIndex: string): void {
        localStorage.setItem(LocalStorageRepository.currentProjectKey, projectIndex)
    }
    getProjectById(): string | null {
        const currentProjectId = localStorage.getItem(LocalStorageRepository.currentProjectKey)
        console.log("Id projektu to: " + { currentProjectId })
        return currentProjectId;
    }

}