import { userRepository } from '../repositories/userRepository.js';

export const userService = {
  async listUsers() {
    return userRepository.findAll();
  },

  async getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  async createUser(payload) {
    try {
      return await userRepository.create(payload);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const conflictError = new Error('Email already exists');
        conflictError.statusCode = 409;
        throw conflictError;
      }

      throw error;
    }
  }
};
