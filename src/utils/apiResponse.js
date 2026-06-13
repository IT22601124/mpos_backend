export const apiResponse = {
  success(res, data, statusCode = 200) {
    return res.status(statusCode).json({ data });
  },

  error(res, message, statusCode = 500) {
    return res.status(statusCode).json({ message });
  }
};
