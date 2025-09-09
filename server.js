const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// const adminRouter = require("./router/admin");
const lightNovelRouter = require("./router/novel");

// app.use("/admin", adminRouter);
=======
const adminRouter = require("./router/admin");
const lightNovelRouter = require("./router/novel");

app.use("/admin", adminRouter);
>>>>>>> 626a386e48e7e1c81cc649e0acae38601e8e38fb
app.use("/light-novel", lightNovelRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});