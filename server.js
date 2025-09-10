const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/admin", adminRouter);

const adminRouter = require("./router/admin");
const lightNovelRouter = require("./router/novel");

app.use("/admin", adminRouter);
app.use("/light-novel", lightNovelRouter);

// พาไปยังหน้า light-novel
app.get("/", (_req, res) => {
res.redirect("/light-novel");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

});
