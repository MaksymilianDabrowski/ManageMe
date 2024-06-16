import { Story } from "./StoryModel";
import { User } from "./UserModel";

export interface Task {
    name: string,
    desc: string,
    priority: "Low" | "Medium" | "High",
    story: Story,
    estTime: Date, // ??? 
    status: "Todo" | "Doing" | "Done",
    buildTime: Date,
    startTime?: Date,
    endTime?: Date,
    user?: User
}