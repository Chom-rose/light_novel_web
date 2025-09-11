// ========== main.html ==========
var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  });
  
  // เปิดกล่องค้นหา
  const openBtn = document.getElementById("openSearch");
  const closeBtn = document.getElementById("closeSearch");
  const overlay = document.getElementById("searchOverlay");
  
  if (openBtn && closeBtn && overlay) {
    openBtn.addEventListener("click", () => overlay.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));
  }
  
  // ====== โปรไฟล์ ======
  const btn = document.getElementById("profileBtn");
  const menu = document.getElementById("profileMenu");
  const content = document.getElementById("profileContent");
  
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  }
  
  function renderProfileMenu() {
    if (!content) return;
    const isLoggedIn = localStorage.getItem("isLoggedIn");
  
    if (isLoggedIn) {
      content.innerHTML = `
        <div class="dropdown-header border-b p-3">
          <strong>สมาชิก</strong><br>
          <small>${localStorage.getItem("username") || "guest"}</small>
        </div>
        <ul>
          <li><a href="/light-novel/create" class="block px-4 py-2 hover:bg-gray-100">สร้างผลงาน</a></li>
          <li><button onclick="logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100">ออกจากระบบ</button></li>
        </ul>
      `;
    } else {
        content.innerHTML = `
        <ul>
          <li><a href="/light-novel/login" class="block px-4 py-2 hover:bg-gray-100">เข้าสู่ระบบ</a></li>
          <li><a href="/light-novel/register" class="block px-4 py-2 hover:bg-gray-100">สมัครสมาชิก</a></li>
        </ul>
      `;
      
    }
  }
  
  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    renderProfileMenu();
    alert("ออกจากระบบแล้ว");
  }
  
  if (content) renderProfileMenu();
  
  // ========== search.html ==========
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") || "";
  const keywordEl = document.getElementById("keyword");
  if (keywordEl) keywordEl.textContent = q;
  
  const novels = [
    { id: 1, title: "หอคอยกระจก", author: "Mina K.", cover: "https://picsum.photos/200/300?random=11" },
    { id: 2, title: "แชตลับฉบับรัก", author: "tenten", cover: "https://picsum.photos/200/300?random=12" },
    { id: 3, title: "กาลครั้งในอาณาจักรชา", author: "Sora", cover: "https://picsum.photos/200/300?random=13" },
    { id: 4, title: "ดาวเคราะห์หมายเลข 404", author: "Null", cover: "https://picsum.photos/200/300?random=14" }
  ];
  
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    const filtered = novels.filter(n => n.title.includes(q) || n.author.includes(q));
    if (filtered.length === 0) {
      resultsDiv.innerHTML = `<p class="text-gray-500 col-span-full">ไม่พบนิยายที่ค้นหา</p>`;
    } else {
      filtered.forEach(novel => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-xl shadow p-2";
        card.innerHTML = `
          <img src="${novel.cover}" alt="${novel.title}" class="rounded-lg w-full">
          <h4 class="font-semibold mt-2">${novel.title}</h4>
          <p class="text-sm text-zinc-500">${novel.author}</p>
        `;
        resultsDiv.appendChild(card);
      });
    }
  }
  
  // ========== create.html ==========
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("novel-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const type = document.getElementById("novelType").value;
        if (type === "long") {
          window.location.href = "/light-novel/write_chapter";
        } else if (type === "short") {
          window.location.href = "/light-novel/write";
        } else {
          alert("กรุณาเลือกประเภทก่อนค่ะ 💡");
        }
      });
    }
  });

  // ========== login.html ==========
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
  
        if (!username || !password) {
          alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
          return;
        }
  
        // mock login
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
  
        alert("เข้าสู่ระบบสำเร็จ 🎉");
        window.location.href = "/light-novel"; // กลับหน้าหลัก
      });
    }
  });
  
  // ========== register.html ==========
  document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value.trim();
  
        if (!username || !password) {
          alert("กรุณากรอกข้อมูลให้ครบ");
          return;
        }
  
        // mock register
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
  
        alert("สมัครสมาชิกสำเร็จ 🎉");
        window.location.href = "/light-novel"; // กลับหน้าหลัก
      });
    }
  });
  
  