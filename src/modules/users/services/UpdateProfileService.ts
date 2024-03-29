import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { compare, hash } from 'bcryptjs';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    password: string;
    old_password: string;
}

class UpdateProfileService {
    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const usersRepository = getCustomRepository(UsersRepository);

        const user = await usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        const userUpdateEmail = await usersRepository.findByEmail(email);

        if (userUpdateEmail && userUpdateEmail.id !== user_id) {
            throw new AppError('There is already one user with this email.');
        }

        if (password && !old_password) {
            throw new AppError('Old password is required.');
        }

        if (password && old_password) {
            const validateOldPassword = await compare(
                old_password,
                user.password,
            );

            if (!validateOldPassword) {
                throw new AppError('Old password is invalid.', 400);
            }

            user.password = await hash(password, 8);
        }

        user.name = name;
        user.email = email;
        await usersRepository.save(user);
        return user;
    }
}

export default UpdateProfileService;
