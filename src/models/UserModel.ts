export interface User {
    id: string,
    firstName: string,
    surname: string,
    role: "Admin" | "DevOps" | "Dev"
}

export const mockUsers: User[] = [
    {
        id: "1",
        firstName: "Maksymilian",
        surname: "Dąbrowski",
        role: "Admin",
    },
    {
        id: "2",
        firstName: "Borys",
        surname: "Bojan",
        role: "DevOps",
    },
    {
        id: "3",
        firstName: "Krzysztof",
        surname: "Popiela",
        role: "Dev",
    },
]