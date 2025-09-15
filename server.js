require("dotenv").config();
const db = require("./db/db");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRouter = require("./router/admin");
const lightNovelRouter = require("./router/novel");
const registerRouter = require("./router/register");
const chapterRouter = require("./router/chapter");
const authRouter = require("./router/auth");
const premiumRouter = require("./router/premium");
const paymentRouter = require("./router/payment");
const novelViewRouter = require("./router/novelView");

app.use("/admin", adminRouter);
app.use("/register", registerRouter);
app.use("/light-novel", lightNovelRouter);
app.use("/chapter", chapterRouter);
app.use("/auth", authRouter);
app.use("/premium", premiumRouter);
app.use("/payment", paymentRouter);
app.use("/", novelViewRouter);


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

// ไปหน้าเขียนนิยายสั้น (ต้องมี id)
app.get("/write/:id", (req, res) => {
  const novelId = req.params.id;

  db.get("SELECT * FROM novels WHERE id = ?", [novelId], (err, novel) => {
    if (err) return res.status(500).send("DB Error");
    if (!novel) return res.status(404).send("Novel not found");

    res.render("write", { novel }); // ✅ ส่ง novel ไป
  });
});


app.get("/write_chapter/:id", (req, res) => {
  const novelId = req.params.id;

  db.get("SELECT * FROM novels WHERE id = ?", [novelId], (err, novel) => {
    if (err) return res.status(500).send("DB Error");
    if (!novel) return res.status(404).send("Novel not found");

    res.render("write_chapter", { novel });
  });
});


app.get("/search", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/search.html"));
    res.render("search");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/login", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/login.html"));
    res.render("login");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/register", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/register.html"));
    res.render("register");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/premium", (req, res) => {
  try {
    //res.sendFile(path.join(__dirname, "../views/premium.html"));
    res.render("premium");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
