import { ApiService } from "../api/ApiService";
import { Project } from "../models/ProjectModel";
import { Story } from "../models/StoryModel";

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

    public readProjects(): Project[] {
        try {
            return this.apiCaller.getProject();
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

    public async setCurrentProject(project: string): Promise<void> {
        await this.apiCaller.setCurrentProject(project)
    }

    public getProjectById(): string | null {
        return this.apiCaller.getProjectById();
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

    // Stories
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
            const index = stories.findIndex((story) => story.id === id);

            if (index !== -1) {
                stories.splice(index, 1);
                await this.apiCaller.setStories(stories);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error deleting story:", error);
            return false;
        }
    }

    public setCurrentStory(id: string): void {
        this.apiCaller.setCurrentStory(id);
    }

    public getCurrentStory(): string | null {
        return this.apiCaller.getStoryById()
    }

}
