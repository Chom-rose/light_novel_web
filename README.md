# 📚 Light Novel Web

โปรเจกต์เว็บ **Light Novel CRUD Demo** เพื่อให้ผู้ใช้สามารถ 

**สมัครสมาชิก / ล็อกอิน / สร้างนิยาย / เพิ่มตอน / แก้ไข / ลบ**
  
## Feature
- สมัครสมาชิก, เข้าสู่ระบบ, ออกจากระบบ
- สร้าง ลบ แก้ไข นิยายได้
  - กําหนด ประเภทตอนสร้างนิยายได้ เช่น สั้น หรือ ยาว
    - แบบสั้น จะเป็นนิยายตอนเดียวจบ เพิ่มตอนไม่ได้
    - แบบยาว จะเป็นนิยายหลายตอน เพิ่ม, แก้ไข, ลบ ตอนได้

    - สร้างนิยายให้เป็นตอนแบบพรีเมี่ยมได้ สำหรับสมาชิกพรีเมี่ยม
- ค้นหานิยาย
- กรองหมวดหมู่ หรือ ประเภท นิยาย
- สมัครสมาชิกแบบพรีเมี่ยม พร้อมอ่านนิยายแบบพรีเมี่ยม


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

- #### express → Web framework หลัก ใช้สร้าง API + จัดการ routing
- #### sqlite3 → Database driver ให้ Node.js คุยกับไฟล์ SQLite .db ได้
- #### bcryptjs → Hash/ตรวจสอบรหัสผ่าน ปลอดภัยเวลาล็อกอิน
- #### jsonwebtoken → สร้าง/ตรวจสอบ JWT token สำหรับระบบ authentication
- #### cookie-parser → ใช้อ่าน/เขียนค่า cookie (เช่น token) จาก request
- #### dotenv → โหลดค่าจากไฟล์ .env เข้ามาเป็น environment variables
- #### ejs → Template engine สำหรับ render หน้าเว็บ (views/*.ejs)
- #### omise → SDK ของ Omise ใช้เชื่อมระบบจ่ายเงิน (PromptPay)


## 🔑 Environment Variables

สร้างไฟล์ `.env` ใน root:

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

