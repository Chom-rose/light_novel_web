# 📚 Light Novel Web

A **Light Novel CRUD Demo Web Application** that allows users to:

**Register / Log in / Create novels / Add chapters / Edit / Delete**

---

## ✨ Features

- User registration, login, and logout
- Create, edit, and delete novels
  - Define novel type when creating a novel:
    - **Short novel**: single-chapter story (no additional chapters allowed)
    - **Long novel**: multi-chapter story (chapters can be added, edited, and deleted)
  - Create **premium chapters** (available only to premium members)
- Search novels
- Filter by category or novel type
- Premium membership system with access to premium content

---

## 🚀 Tech Stack  

![Express.js](https://img.shields.io/badge/Express.js-9C9C9C?style=for-the-badge&logo=express&logoColor=white)
![SQLite Viewer](https://img.shields.io/badge/SQLite%20Viewer-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![sqlite3](https://img.shields.io/badge/sqlite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![bcryptjs](https://img.shields.io/badge/bcryptjs-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=black)
![cookie-parser](https://img.shields.io/badge/cookie--parser-000000?style=for-the-badge&logo=node.js&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![ejs](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![omise](https://img.shields.io/badge/Omise-1A6AFF?style=for-the-badge&logo=omise&logoColor=white)

### Libraries Overview

- **express** → Main web framework for API creation and routing
- **sqlite3** → Database driver for connecting Node.js with SQLite `.db` files
- **bcryptjs** → Password hashing and verification for secure authentication
- **jsonwebtoken** → JWT creation and validation for authentication
- **cookie-parser** → Read/write cookies (e.g., auth tokens) from requests
- **dotenv** → Load environment variables from `.env`
- **ejs** → Template engine for rendering web pages (`views/*.ejs`)
- **omise** → Omise SDK for payment integration (PromptPay)

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=dev_secret_change_me
COOKIE_SECRET=some_cookie_secret
OMISE_PUBLIC_KEY=your_public_key
OMISE_SECRET_KEY=your_secret_key
```


### ติดตั้ง package.json:

```bash
npm init -y
```

```bash
npm install express sqlite3 bcryptjs jsonwebtoken cookie-parser dotenv ejs omise
```

ติดตั้ง Nodemon:
```bash
npm install nodemon --save-dev
```

```json
"scripts": {
  "dev": "nodemon server.js",
},
```

## 🌐 Webhook with ngrok

สำหรับทดสอบการชำระเงิน (Omise) จำเป็นต้องมี public URL เพื่อให้ Omise เรียก Webhook กลับมา  
ใน dev environment สามารถใช้ [ngrok](https://ngrok.com/) ได้:

ติดตั้ง ngrok (Windows/Mac/Linux):
```bash
npm install -g ngrok
```

#### How to run
```bash
npm run dev

```
```js
// เทสสมัครพรีเมี่ยม ก็อปโค้ดใส่ devtool/console
const t = localStorage.getItem('token');

fetch('/premium/upgrade', {

method: 'POST',

headers: t ? { Authorization: 'Bearer ' + t } : {}

})

.then(r => r.json())

.then(console.log)

.catch(console.error);

// เอาพรีเมี่ยมออก
const t = localStorage.getItem('token');

fetch('/premium/cancel', { method: 'POST', headers: { Authorization: 'Bearer ' + t }})

.then(r => r.json()).then(console.log).catch(console.error);

```
## Contributors

- #### [@Chom-rose](https://github.com/Chom-rose)
- #### [@JOMPOL-C](https://github.com/JOMPOL-C)
- #### [@Wipoosana50](https://github.com/Wipoosana50)

