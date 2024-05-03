require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());

const userRouter = require("./routes/users");
const chapterRouter = require("./routes/chapter");
const studioRouter = require("./routes/studio");
const animeRouter = require("./routes/anime");

app.use("/user", userRouter);
app.use("/chapter", chapterRouter);
app.use("/studio", studioRouter);
app.use("/anime", animeRouter);

app.get("/", (req, res) => {
   res.send("Hello world");
});

app.listen(PORT, () => {
   console.log(`Server running at port: ${PORT}`);
});
