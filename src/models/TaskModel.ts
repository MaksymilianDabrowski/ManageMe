export interface Task {
    id: string,
    name: string,
    description: string,
    priority: "Low" | "Medium" | "High",
    storyId: string,
    estTime: number,
    status: "Todo" | "Doing" | "Done",
    startTime?: Date,
    endTime?: Date,
    mockUserId: string,
}