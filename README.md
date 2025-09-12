# 📚 Light Novel Web

โปรเจกต์เว็บ **Light Novel CRUD Demo**  
ใช้ **Express + SQLite Viewer + Authentication**  
เพื่อให้ผู้ใช้สามารถ **สมัครสมาชิก / ล็อกอิน / สร้างนิยาย / เพิ่มตอน / แก้ไข / ลบ** ได้
- กําหนด ประเภทตอนสร5างนิยายได5 เช่น สั้น หรือ ยาว
  
## Feature
- สมัครสมาชิก, เข้าสู่ระบบ, ออกจากระบบ
- สร้าง ลบ แก้ไข นิยายได้
  - กําหนด ประเภทตอนสร้างนิยายได้ เช่น สั้น หรือ ยาว
    - แบบสั้น จะเป็นนิยายตอนเดียวจบ เพิ่มตอนไม่ได้
    - แบบยาว จะเป็นนิยายหลายตอน เพิ่ม, แก้ไข, ลบ ตอนได้
- ค้นหานิยาย
- กรองหมวดหมู่ หรือ ประเภท นิยาย
---

## Tech Stack

- [Express.js](https://expressjs.com/) – Web framework
- [SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) – ตัวดูฐานข้อมูล SQLite
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) – Hash password
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) – JWT Auth
- [Nodemon](https://www.npmjs.com/package/nodemon) – Dev auto reload

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
