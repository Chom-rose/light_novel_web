# 📚 Light Novel Web

โปรเจกต์เว็บ **Light Novel CRUD Demo**  
ใช้ **Express + SQLite Viewer + Authentication**  
เพื่อให้ผู้ใช้สามารถ **สมัครสมาชิก / ล็อกอิน / สร้างนิยาย / เพิ่มตอน / แก้ไข / ลบ** ได้
  
## Feature
- สมัครสมาชิก, เข้าสู่ระบบ, ออกจากระบบ
- สร้าง ลบ แก้ไข นิยายได้
  - กําหนด ประเภทตอนสร้างนิยายได้ เช่น สั้น หรือ ยาว
    - แบบสั้น จะเป็นนิยายตอนเดียวจบ เพิ่มตอนไม่ได้
    - แบบยาว จะเป็นนิยายหลายตอน เพิ่ม, แก้ไข, ลบ ตอนได้
- ค้นหานิยาย
- กรองหมวดหมู่ หรือ ประเภท นิยาย
---

## 🚀 Tech Stack  

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite Viewer](https://img.shields.io/badge/SQLite%20Viewer-003B57?style=for-the-badge&logo=sqlite&logoColor=white) 
![bcryptjs](https://img.shields.io/badge/bcryptjs-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) 
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=black)

---

```bash
ติดตั้ง package.json:
npm init -y
```

ติดตั้ง Express:
```bash
npm install express
```

ติดตั้ง Nodemon:
```bash
npm install nodemon --save-dev
```
