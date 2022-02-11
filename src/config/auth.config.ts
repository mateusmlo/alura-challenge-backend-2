export const authConfig = () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
  };
};
