import { userService } from '../services/userService.js';

export const userController = {
  async listUsers(_req, res, next) {
    try {
      const users = await userService.listUsers();
      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
};
