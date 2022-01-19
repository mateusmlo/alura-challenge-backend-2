export const dbConfig = () => {
  return {
    pgUser: process.env.POSTGRES_USER,
    pgPassword: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
    pgPort: process.env.POSTGRES_PORT,
  };
};
