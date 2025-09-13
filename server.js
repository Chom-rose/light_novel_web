const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use("/admin", adminRouter);

const adminRouter = require("./router/admin");
const lightNovelRouter = require("./router/novel");
const registerRouter = require("./router/register");
const chapterRouter = require("./router/chapter");
const authRouter = require("./router/auth");

app.use("/admin", adminRouter);
app.use("/register", registerRouter);
app.use("/light-novel", lightNovelRouter);
app.use("/chapter", chapterRouter);
app.use("/auth", authRouter);

// ---------- Page render ----------
app.get("/", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/main.html"));
    res.render("main");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/create", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/create.html"));
    res.render("create");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/writePage", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/write.html"));
    res.render("write");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/write_chapterPage", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/write_chapter.html"));
    res.render("write_chapter");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/searchPage", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/search.html"));
    res.render("search");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/loginPage", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/login.html"));
    res.render("login");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/registerPage", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/register.html"));
    res.render("register");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
