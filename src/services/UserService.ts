import { User, mockUsers } from "../models/UserModel";

export class UserService {
    private static currentUserKey = "currentUser"

    public static getUser(): User | null {
        const userData = localStorage.getItem(UserService.currentUserKey);
        return userData ? JSON.parse(userData): null
    }

    public static setUser(user: User) : void {
        localStorage.setItem(UserService.currentUserKey, JSON.stringify(user))
    }
    public static getAllMockUsers(): User[] {
        return mockUsers;
    }
    public static fetchUsers(): User[] {
        const usersData = localStorage.getItem("users")
        return usersData ? JSON.parse(usersData): [];
    }
}

UserService.setUser(mockUsers[0])
