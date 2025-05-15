import { UserDto } from "../dto/request/user";

export interface IdentityService {
    createUser(request: UserDto): Promise<UserDto>;
    
    getUserById(id: string): Promise<UserDto>;

    getAllUsers(): Promise<UserDto[]>;

    updateUser(request: UserDto): Promise<UserDto>;

    deleteUser(id: string): void;

    createPassword(request: UserDto): Promise<UserDto>;
}