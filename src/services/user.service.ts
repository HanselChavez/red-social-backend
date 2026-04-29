import { AppDataSource } from "../config/data-source";
import { CreateUserDto } from "../dtos/user.dto";
import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";
import { AppError } from "../errors/AppError";
import { ErrorCode } from "../utils/errorCodes";
import { hashPassword } from "../utils/hash";
import { HttpStatus } from "../utils/httpStatus";
import { validateUserFormat } from "../utils/validators";

const userRepo = AppDataSource.getRepository(User);
const profileRepo = AppDataSource.getRepository(UserProfile);

export const createUser = async (data: CreateUserDto) => {
    validateUserFormat(data);

    const existingEmail = await userRepo.findOne({
        where: { email: data.email },
    });

    if (existingEmail) {
        throw new AppError(
            "El correo ya está registrado",
            HttpStatus.CONFLICT,
            ErrorCode.USER_ALREADY_EXISTS,
        );
    }

    const existingUsername = await profileRepo.findOne({
        where: { username: data.username },
    });

    if (existingUsername) {
        throw new AppError(
            "El nombre de usuario ya está en uso",
            HttpStatus.CONFLICT,
            ErrorCode.USER_ALREADY_EXISTS,
        );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = userRepo.create({
        email: data.email,
        password: hashedPassword,
        role: data.role || "user",
        profile: {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            gender: data.gender,
            bio: data.bio,
            avatar: data.avatar,
        },
    });

    await userRepo.save(user);

    const { password, ...userSafe } = user;
    return userSafe;
};

export const getUsers = async () => {
    const users = await userRepo.find({
        relations: ["profile"],
    });

    return users.map(({ password, ...u }) => u);
};

export const getUserById = async (id: number) => {
    const user = await userRepo.findOne({
        where: { id },
        relations: ["profile"],
    });

    if (!user) {
        throw new AppError(
            "Usuario no encontrado",
            HttpStatus.NOT_FOUND,
            ErrorCode.USER_NOT_FOUND,
        );
    }

    const { password, ...userSafe } = user;
    return userSafe;
};

export const updateUser = async (id: number, data: Partial<CreateUserDto>) => {
    const user = await userRepo.findOne({
        where: { id },
        relations: ["profile"],
    });

    if (!user) {
        throw new AppError(
            "Usuario no encontrado",
            HttpStatus.NOT_FOUND,
            ErrorCode.USER_NOT_FOUND,
        );
    }

    if (data.email && data.email !== user.email) {
        const exists = await userRepo.findOne({
            where: { email: data.email },
        });

        if (exists) {
            throw new AppError(
                "El correo ya está en uso",
                HttpStatus.CONFLICT,
                ErrorCode.USER_ALREADY_EXISTS,
            );
        }

        user.email = data.email;
    }

    if (data.password) {
        user.password = await hashPassword(data.password);
    }

    if (data.username && data.username !== user.profile.username) {
        const exists = await profileRepo.findOne({
            where: { username: data.username },
        });

        if (exists) {
            throw new AppError(
                "El nombre de usuario ya está en uso",
                HttpStatus.CONFLICT,
                ErrorCode.USER_ALREADY_EXISTS,
            );
        }

        user.profile.username = data.username;
    }

    user.profile.firstName = data.firstName ?? user.profile.firstName;
    user.profile.lastName = data.lastName ?? user.profile.lastName;
    user.profile.birthDate = data.birthDate ?? user.profile.birthDate;
    user.profile.gender = data.gender ?? user.profile.gender;
    user.profile.bio = data.bio ?? user.profile.bio;
    user.profile.avatar = data.avatar ?? user.profile.avatar;

    await userRepo.save(user);

    const { password, ...userSafe } = user;
    return userSafe;
};

export const deleteUser = async (id: number) => {
    const user = await userRepo.findOne({ where: { id } });

    if (!user) {
        throw new AppError(
            "Usuario no encontrado",
            HttpStatus.NOT_FOUND,
            ErrorCode.USER_NOT_FOUND,
        );
    }

    await userRepo.remove(user);

    return true;
};
