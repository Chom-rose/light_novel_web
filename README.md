# 📚 Light Novel Web

โปรเจกต์เว็บ **Light Novel CRUD Demo**  
ใช้ **Express + SQLite3 + JWT Authentication**  
เพื่อให้ผู้ใช้สามารถ **สมัครสมาชิก / ล็อกอิน / สร้างนิยาย / เพิ่มตอน / แก้ไข / ลบ** ได้

---

## Tech Stack

- [Express.js](https://expressjs.com/) – Web framework
- [SQLite3](https://www.sqlite.org/) – ฐานข้อมูล
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) – Hash password
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) – JWT Auth
- [Nodemon](https://www.npmjs.com/package/nodemon) – Dev auto reload

---
ติดตั้ง package.json:
```bash
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


- เทสสมัครพรีเมี่ยม ก็อปโค้ดใส่devtool/console

const t = localStorage.getItem('token');

fetch('/premium/upgrade', {

  method: 'POST',
  
  headers: t ? { Authorization: 'Bearer ' + t } : {}
  
})

  .then(r => r.json())
  
  .then(console.log)
  
  .catch(console.error);


  - เอาพรีเมี่ยมออก
  
  const t = localStorage.getItem('token');
  
fetch('/premium/cancel', { method: 'POST', headers: { Authorization: 'Bearer ' + t }})

  .then(r => r.json()).then(console.log).catch(console.error);

