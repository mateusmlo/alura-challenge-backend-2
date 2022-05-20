export const dbConfig = () => {
  return {
    uri: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@finance-control.oooo8.mongodb.net/finance-control?retryWrites=true&w=majority`,
  };
};
