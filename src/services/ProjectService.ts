import { ApiService } from "../api/ApiService";
import { Project } from "../models/ProjectModel";
import { Story } from "../models/StoryModel";
import { Task } from "../models/TaskModel";

export class ProjectService {

    private apiCaller: ApiService;

    constructor(apiCaller: ApiService) {
        this.apiCaller = apiCaller;
    }

    // Project methods
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
        } catch (error) {
            console.error("Error creating project:", error);
        }
    }

    public readProjects(): Project[] {
        try {
            return this.apiCaller.getProject();
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            console.error("Error deleting project:", error);
            return false;
        }
    }

    public async setCurrentProject(project: string): Promise<void> {
        try {
            await this.apiCaller.setCurrentProject(project);
        } catch (error) {
            console.error("Error setting current project:", error);
        }
    }

    public getProjectById(): string | null {
        try {
            return this.apiCaller.getProjectById();
        } catch (error) {
            console.error("Error getting project by ID:", error);
            return null;
        }
    }

    public getProjectByName(projectId: string): string {
        try {
            const projects = this.readProjects();
            const project = projects.find((project) => project.id === projectId);
            return project ? project.name : "Unknown";
        } catch (error) {
            console.error("Error getting project by name:", error);
            return "Unknown";
        }
    }

    // Story methods
    public async createStory(
        name: string,
        description: string,
        priority: "Low" | "Medium" | "High",
        status: "Todo" | "Doing" | "Done",
        ownerId: string
    ): Promise<void> {
        try {
            const story: Story = {
                id: crypto.randomUUID(),
                name,
                description,
                priority,
                status,
                ownerId,
                projectId: this.getProjectById() || "",
                date: new Date(),
            };
            const stories = await this.apiCaller.getStories();
            stories.push(story);
            await this.apiCaller.setStories(stories);
        } catch (error) {
            console.error("Error creating story:", error);
        }
    }

    public readStories(): Story[] {
        try {
            const stories = this.apiCaller.getStories();
            const currentProjectId = this.getProjectById();
            return stories.filter((story) => story.projectId === currentProjectId);
        } catch (error) {
            console.error("Error retrieving stories:", error);
            return [];
        }
    }

    public async updateStory(
        id: string,
        updName: string,
        updDesc: string,
        updPriority: "Low" | "Medium" | "High",
        updStatus: "Todo" | "Doing" | "Done"
    ): Promise<boolean> {
        try {
            const stories = await this.apiCaller.getStories();
            const index = stories.findIndex((story) => story.id === id);

            if (index !== -1) {
                stories[index] = {
                    ...stories[index],
                    name: updName,
                    description: updDesc,
                    priority: updPriority,
                    status: updStatus
                };
                await this.apiCaller.setStories(stories);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error updating story:", error);
            return false;
        }
    }

    public async deleteStory(id: string): Promise<boolean> {
        try {
            const stories = await this.apiCaller.getStories();
            const updatedStories = stories.filter((story) => story.id !== id);
            if (updatedStories.length !== stories.length) {
                await this.apiCaller.setStories(updatedStories);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting story:", error);
            return false;
        }
    }

    public setCurrentStory(id: string): void {
        try {
            this.apiCaller.setCurrentStory(id);
        } catch (error) {
            console.error("Error setting current story:", error);
        }
    }

    public getCurrentStory(): string | null {
        try {
            return this.apiCaller.getStoryById();
        } catch (error) {
            console.error("Error getting current story ID:", error);
            return null;
        }
    }

    public getStoryByName(storyId: string): string {
        try {
            const stories = this.readStories();
            const story = stories.find((story) => story.id === storyId);
            return story ? story.name : "Unknown";
        } catch (error) {
            console.error("Error getting story by name:", error);
            return "Unknown";
        }
    }

    // Task methods
    public async createTask(
        name: string,
        description: string,
        priority: "Low" | "Medium" | "High",
        status: "Todo" | "Doing" | "Done",
        estTime: number,
    ): Promise<void> {
        try {
            const task: Task = {
                id: crypto.randomUUID(),
                name,
                description,
                priority,
                storyId: this.getCurrentStory() || "",
                estTime,
                status,
            };
            const tasks = await this.apiCaller.getTasks();
            tasks.push(task);
            await this.apiCaller.setTasks(tasks);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    }

    public async readTasks(): Promise<Task[]> {
        try {
            const tasks = await this.apiCaller.getTasks();
            const currentStoryId = this.getCurrentStory();
            return tasks.filter((task) => task.storyId === currentStoryId);
        } catch (error) {
            console.error("Error retrieving tasks:", error);
            return [];
        }
    }

    public async updateTask(
        id: string,
        updName: string,
        updDesc: string,
        updPriority: "Low" | "Medium" | "High",
        updStatus: "Todo" | "Doing" | "Done"
    ): Promise<boolean> {
        try {
            const tasks = await this.apiCaller.getTasks();
            const index = tasks.findIndex((task) => task.id === id);

            if (index !== -1) {
                tasks[index] = {
                    ...tasks[index],
                    name: updName,
                    description: updDesc,
                    priority: updPriority,
                    status: updStatus
                };
                if (updStatus === "Done") {
                    tasks[index].endTime = new Date();
                }
                await this.apiCaller.setTasks(tasks);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error updating task:", error);
            return false;
        }
    }

    public async deleteTask(id: string): Promise<boolean> {
        try {
            const tasks = await this.apiCaller.getTasks();
            const updatedTasks = tasks.filter((task) => task.id !== id);
            if (updatedTasks.length !== tasks.length) {
                await this.apiCaller.setTasks(updatedTasks);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting task:", error);
            return false;
        }
    }

    public async setCurrentTask(id: string): Promise<void> {
        try {
            await this.apiCaller.setCurrentTask(id);
        } catch (error) {
            console.error("Error setting current task:", error);
        }
    }

    public getCurrentTask(): string | null {
        try {
            return this.apiCaller.getTaskById();
        } catch (error) {
            console.error("Error getting current task ID:", error);
            return null;
        }
    }
}
