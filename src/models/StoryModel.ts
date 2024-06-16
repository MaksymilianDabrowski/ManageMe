export interface Story {
    id: string,
    name: string,
    description: string,
    priority: "Low" | "Medium" | "High",
    projectId: string, 
    date: Date,
    status: "Todo" | "Doing" | "Done",
    ownerId: string
}