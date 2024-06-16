export interface User {
    id: string,
    firstName: string,
    surname: string,
    role: "Admin" | "DevOps" | "Dev"
}