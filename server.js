require("dotenv").config();
console.log("OMISE_PUBLIC_KEY loaded?", !!process.env.OMISE_PUBLIC_KEY);
console.log("OMISE_SECRET_KEY loaded?", !!process.env.OMISE_SECRET_KEY);

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

require("./db/db");

const app = express();
const port = process.env.PORT || 3000;

/* ---------- Middlewares ---------- */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

/* ---------- View Engine (EJS) ---------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------- Routers ---------- */
const adminRouter      = require("./router/admin");
const lightNovelRouter = require("./router/novel");
const registerRouter   = require("./router/register");
const chapterRouter    = require("./router/chapter");
const authRouter       = require("./router/auth");     // /auth/login, /auth/me
const premiumRouter    = require("./router/premium");  // /premium/upgrade, /premium/cancel
const paymentRouter    = require("./router/payment");  // /payment/start, /payment/webhook
const novelViewRouter  = require("./router/novelView");// /novel/:id, /novel/:id/chapter/:chapterId, /write/:id, ...

app.use("/admin", adminRouter);
app.use("/register", registerRouter);
app.use("/light-novel", lightNovelRouter);
app.use("/chapter", chapterRouter);
app.use("/auth", authRouter);
app.use("/premium", premiumRouter);
app.use("/payment", paymentRouter);

/* ---------- Page render (EJS pages) ---------- */
app.get("/", (_req, res) => {
  res.render("main");
});

app.get("/create", (_req, res) => {
  res.render("create");
});

app.get("/search", (_req, res) => {
  res.render("search");
});

app.get("/login", (_req, res) => {
  res.render("login");
});

app.get("/register", (_req, res) => {
  res.render("register");
});

app.get("/premium", (_req, res) => {
  res.render("premium");
});

app.use("/", novelViewRouter);

/* ---------- 404 fallback ---------- */
app.use((req, res) => {
  res.status(404).send("Not Found");
});

/* ---------- Start ---------- */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
