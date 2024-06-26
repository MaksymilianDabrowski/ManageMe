export interface Task {
    id: string,
    name: string,
    description: string,
    priority: "Low" | "Medium" | "High",
    storyId: string,
    estTime: number,
    status: "Todo" | "Doing" | "Done",
    // buildTime: Date,
    startTime?: Date,
    endTime?: Date,
    mockUserId: string,
}