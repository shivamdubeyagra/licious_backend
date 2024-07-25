const express = require("express");
const connectDB = require("./src/config/db.js");
const cors = require("cors");
const userRouter = require("./src/routes/user.routes.js");
const postRouter = require("./src/routes/post.routes.js");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running at port ${process.env.PORT}`);
});
