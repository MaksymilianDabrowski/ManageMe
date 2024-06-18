import { Project } from "../models/ProjectModel";

export interface ApiService {
    getProject(): Project[]
    setProject(projects: Project[]): void
}

export class LocalStorageRepository implements ApiService {
    private static storageKey = "projects";

    public getProject(): Project[] {
        const projectData = localStorage.getItem(LocalStorageRepository.storageKey)
        return projectData ? JSON.parse(projectData) : [];
    }

    public setProject(projects: Project[]): void {
        localStorage.setItem(LocalStorageRepository.storageKey, JSON.stringify(projects))
    }
}