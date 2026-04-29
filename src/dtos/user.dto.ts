export type CreateUserDto = {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: "male" | "female" | "other";
    bio?: string;
    avatar?: string;
    isActive?: boolean;
    role: "user" | "admin";
};

export type UpdateUserDto = {
    email?: string;
    password?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    gender?: "male" | "female" | "other";
    bio?: string;
    avatar?: string;
    isActive?: boolean;
};
