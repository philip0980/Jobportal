import mongoose from "mongoose";

const Database = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

export { Database };
