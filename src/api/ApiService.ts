import { Project } from "../models/ProjectModel";
import { Story } from "../models/StoryModel";

export interface ApiService {
    getProject(): Project[]
    setProject(projects: Project[]): void

    setCurrentProject(project: string): void;
    getProjectById(): string | null; //> ?

    // stories
    getStories(): Story[]
    setStories(stories: Story[]): void;

    setCurrentStory(id: string): void;
    getStoryById(): string | null;
}

export class LocalStorageRepository implements ApiService {
    private static storageKey = "projectsKey";
    static currentProjectKey = "projectByIdKey";
    static storiesStorageKey = "storiesKey"
    static currentStoryKey = "storybyIdKey"

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
    public getProjectById(): string | null {
        const currentProjectId = localStorage.getItem(LocalStorageRepository.currentProjectKey)
        console.log("Id projektu to: " + currentProjectId)
        return currentProjectId;
    }


    // Stories
    public getStories(): Story[] {
        const storiesData = localStorage.getItem(LocalStorageRepository.storiesStorageKey)
        return storiesData ? JSON.parse(storiesData) : [];
    }

    public setStories(stories: Story[]): void {
        localStorage.setItem(LocalStorageRepository.storiesStorageKey, JSON.stringify(stories));
    }

    public setCurrentStory(id: string): void {
        localStorage.setItem(LocalStorageRepository.currentStoryKey, id)
    }

    public getStoryById(): string | null {
        const currentStoryId = localStorage.getItem(LocalStorageRepository.currentStoryKey)
        console.log("Id projektu to: " + { currentStoryId })
        return currentStoryId;
    }
}