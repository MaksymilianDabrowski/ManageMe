import { Project } from "../models/ProjectModel";
import { Story } from "../models/StoryModel";
import { Task } from "../models/TaskModel";

export interface ApiService {
    getProject(): Project[];
    setProject(projects: Project[]): void;

    setCurrentProject(projectId: string): void;
    getProjectById(): string | null;

    // stories
    getStories(): Story[];
    setStories(stories: Story[]): void;

    setCurrentStory(storyId: string): void;
    getStoryById(): string | null;

    // tasks
    getTasks(): Task[];
    setTasks(tasks: Task[]): void;

    setCurrentTask(taskId: string): void;
    getTaskById(): string | null;
}

export class LocalStorageRepository implements ApiService {
    private static storageKeys = {
        projects: "projectsKey",
        currentProject: "projectByIdKey",
        stories: "storiesKey",
        currentStory: "storyByIdKey",
        tasks: "tasksKey",
        currentTask: "taskByIdKey"
    };

    private getItem<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    private setItem<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public getProject(): Project[] {
        return this.getItem<Project[]>(LocalStorageRepository.storageKeys.projects) || [];
    }

    public setProject(projects: Project[]): void {
        this.setItem(LocalStorageRepository.storageKeys.projects, projects);
    }

    public setCurrentProject(projectId: string): void {
        this.setItem(LocalStorageRepository.storageKeys.currentProject, projectId);
    }

    public getProjectById(): string | null {
        return this.getItem<string>(LocalStorageRepository.storageKeys.currentProject);
    }

    // Stories
    public getStories(): Story[] {
        return this.getItem<Story[]>(LocalStorageRepository.storageKeys.stories) || [];
    }

    public setStories(stories: Story[]): void {
        this.setItem(LocalStorageRepository.storageKeys.stories, stories);
    }

    public setCurrentStory(storyId: string): void {
        this.setItem(LocalStorageRepository.storageKeys.currentStory, storyId);
    }

    public getStoryById(): string | null {
        return this.getItem<string>(LocalStorageRepository.storageKeys.currentStory);
    }

    // Tasks
    public getTasks(): Task[] {
        return this.getItem<Task[]>(LocalStorageRepository.storageKeys.tasks) || [];
    }

    public setTasks(tasks: Task[]): void {
        this.setItem(LocalStorageRepository.storageKeys.tasks, tasks);
    }

    public setCurrentTask(taskId: string): void {
        this.setItem(LocalStorageRepository.storageKeys.currentTask, taskId);
    }

    public getTaskById(): string | null {
        return this.getItem<string>(LocalStorageRepository.storageKeys.currentTask);
    }
}
