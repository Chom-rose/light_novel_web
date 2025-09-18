document.addEventListener("DOMContentLoaded", () => {
  const novelList = document.getElementById("novelList");
  if (!novelList) return; // ถ้าไม่มี element นี้ ไม่ต้องทำอะไร

  fetch("/light-novel/api/novels")
    .then(res => res.json())
    .then(novels => {
      console.log("NOVELS =", novels);
      if (novels.length === 0) {
        novelList.innerHTML = `<p class="text-gray-500 col-span-full">ยังไม่มีนิยาย</p>`;
      } else {
        novels.forEach(novel => {
          const card = document.createElement("article");
          card.className = "bg-white rounded-xl shadow p-2";
          card.innerHTML = `
            <a href="/novel/${novel.id}" class="block hover:shadow-lg transition rounded-lg overflow-hidden">
              <img src="${novel.image || 'https://picsum.photos/200/300'}"
                   alt="${novel.name}"
                   class="rounded-lg w-full h-48 object-cover">
              <h4 class="font-semibold mt-2">${novel.name}</h4>
              <p class="text-sm text-zinc-500">${novel.author || 'ไม่ระบุผู้แต่ง'}</p>
            </a>
          `;
          novelList.appendChild(card);
        });
      }
    })
    .catch(() => {
      novelList.innerHTML = `<p class="text-red-500 col-span-full">โหลดข้อมูลผิดพลาด</p>`;
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const popularNovels = document.getElementById("popularNovels");
  if (popularNovels) {
    fetch("/light-novel/api/novels")
      .then(res => res.json())
      .then(novels => {
        if (novels.length === 0) {
          popularNovels.innerHTML = `<div class="swiper-slide text-gray-500">ยังไม่มีนิยาย</div>`;
        } else {
          novels.forEach(novel => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.innerHTML = `
              <div class="relative">
                <a href="/novel/${novel.id}">
                  <img src="${novel.image || 'https://picsum.photos/800/400'}"
                       class="w-full rounded-xl object-cover h-60">
                  <div class="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-lg">
                    ${novel.name}
                  </div>
                </a>
              </div>
            `;
            popularNovels.appendChild(slide);
          });

          // init swiper หลังจากเติมข้อมูลแล้ว
          new Swiper(".popularSwiper", {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            breakpoints: {
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }
          });
        }
      })
      .catch(() => {
        popularNovels.innerHTML = `<div class="swiper-slide text-red-500">โหลดข้อมูลผิดพลาด</div>`;
      });
  }
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
            <li><a href="/create" class="block px-4 py-2 hover:bg-gray-100">สร้างผลงาน</a></li>
            <li><button onclick="logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100">ออกจากระบบ</button></li>
          </ul>
        `;
  } else {
    content.innerHTML = `
          <ul>
            <li><a href="/login" class="block px-4 py-2 hover:bg-gray-100">เข้าสู่ระบบ</a></li>
            <li><a href="/register" class="block px-4 py-2 hover:bg-gray-100">สมัครสมาชิก</a></li>
          </ul>
        `;

  }
}

function logout() {
  fetch("/auth/logout", { method: "POST" })
    .then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");

      const statusEl = document.getElementById("userStatus");
      if (statusEl) statusEl.textContent = "ยังไม่ได้เข้าสู่ระบบ";

      const btnPremium = document.getElementById("btnPremium");
      if (btnPremium) btnPremium.style.display = "inline-block";

      renderProfileMenu();
      alert("ออกจากระบบแล้ว");
      window.location.href = "/login"; // redirect ไปหน้า login
    })
    .catch(err => {
      console.error("Logout error:", err);
      alert("เกิดข้อผิดพลาดตอนออกจากระบบ");
    });
}

if (content) renderProfileMenu();

// ========== create.html ==========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("novel-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const name = form.elements["name"].value.trim();
      const category = form.elements["category"].value;
      const author = form.elements["author"].value.trim();
      const description = form.elements["description"]?.value || "";
      const coverImage = form.elements["coverImage"]?.value || "";
      const type = form.elements["type"]?.value || "short";

      if (!name || !category || !author) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      fetch("/light-novel/api/novels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, category, author, description, coverImage, type })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            alert("สร้างนิยายสำเร็จ!");
            if (type === "short") {
              // นิยายสั้น → ไปหน้า write.html
              window.location.href = "/write/" + data.data.id;
            } else if (type === "long") {
              // นิยายยาว → ไปหน้า write_chapter.html พร้อม id ของนิยาย
              window.location.href = "/write_chapter/" + data.data.id;
            } else {
              window.location.href = "/";
            }
          }
        })
        .catch(() => alert("เกิดข้อผิดพลาด"));
    });
  }
});

// ========== login.html ==========
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        return;
      }

      fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", data.user.username);
            alert("เข้าสู่ระบบสำเร็จ 🎉");
            window.location.href = "/";
          }
        })
        .catch(() => alert("เกิดข้อผิดพลาด"));
    });
  }
});

// ========== register.html ==========
document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("register-form");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const birthdate = document.getElementById("reg-birthdate").value.trim();

      if (!username || !password || !email) {
        alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
        return;
      }

      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, birthdate })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert("สมัครไม่สำเร็จ: " + data.error);
          } else {
            alert("สมัครสมาชิกสำเร็จ 🎉 กรุณาเข้าสู่ระบบ");
            window.location.href = "/login";
          }
        })
        .catch(() => {
          alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        });
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("userStatus");
  const btnPremium = document.getElementById("btnPremium");

  if (!statusEl) return;

  const token = localStorage.getItem("token");

  if (token) {
    // กรณีมี token → ใช้ Bearer
    fetch("/auth/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => handleUser(data, statusEl, btnPremium))
      .catch(() => setGuest(statusEl, btnPremium));
  } else {
    // กรณีไม่มี token → ใช้ cookie
    fetch("/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => handleUser(data, statusEl, btnPremium))
      .catch(() => setGuest(statusEl, btnPremium));
  }

  function handleUser(data, statusEl, btnPremium) {
    if (data.error || !data.user) {
      setGuest(statusEl, btnPremium);
      return;
    }

    if (data.user.is_premium === 1) {
      statusEl.textContent = "สมาชิกพรีเมี่ยม";
      if (btnPremium) btnPremium.style.display = "none";
    } else {
      statusEl.textContent = "สมาชิกฟรี";
      if (btnPremium) {
        btnPremium.style.display = "inline-block";
        btnPremium.onclick = () => {
          window.location.href = "/premium";
        };
      }
    }
  }

  function setGuest(statusEl, btnPremium) {
    statusEl.textContent = "ยังไม่ได้เข้าสู่ระบบ";
    if (btnPremium) {
      btnPremium.style.display = "inline-block";
      btnPremium.onclick = () => {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/login";
      };
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.getElementById("deleteNovelBtn");
  const editBtn = document.getElementById("editNovelBtn");
  const novelId = window.location.pathname.split("/").pop();
  const token = localStorage.getItem("token");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (confirm("คุณแน่ใจว่าจะลบนิยายนี้?")) {
        const res = await fetch(`/light-novel/api/novels/${novelId}`, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        if (res.ok) {
          alert("ลบนิยายสำเร็จ");
          window.location.href = "/";
        } else {
          alert("ลบไม่สำเร็จ: " + (data.error || "ไม่ทราบสาเหตุ"));
        }
      }
    });
  }

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const editModal = document.getElementById("editModal");
      if (editModal) {
        editModal.classList.remove("hidden");
        editModal.classList.add("flex"); // ให้ modal ใช้ flex layout
      }
    });
  }
});

const closeEditModal = document.getElementById("closeEditModal");
if (closeEditModal) {
  closeEditModal.addEventListener("click", () => {
    const editModal = document.getElementById("editModal");
    if (editModal) {
      editModal.classList.add("hidden");
      editModal.classList.remove("flex");
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const pathParts = window.location.pathname.split("/");
  const novelId = pathParts[2];
  const chapterId = pathParts[4];

  const editBtn = document.getElementById("editChapterBtn");
  const deleteBtn = document.getElementById("deleteChapterBtn");
  const editModal = document.getElementById("editChapterModal");
  const closeEditModal = document.getElementById("closeEditChapterModal");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      editModal.classList.remove("hidden");
      editModal.classList.add("flex");
    });
  }

  if (closeEditModal) {
    closeEditModal.addEventListener("click", () => {
      editModal.classList.add("hidden");
      editModal.classList.remove("flex");
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (confirm("คุณแน่ใจว่าจะลบตอนนี้?")) {
        const res = await fetch(`/light-novel/api/novels/${novelId}/chapters/${chapterId}`, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (res.ok) {
          alert("ลบตอนสำเร็จ");
          window.location.href = `/novel/${novelId}`;
        } else {
          alert("ลบไม่สำเร็จ: " + (data.error || "ไม่ทราบสาเหตุ"));
        }
      }
    });
  }
});

// Toolbar สำหรับ modal edit chapter
document.querySelectorAll("#editChapterModal .tbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    if (cmd) document.execCommand(cmd, false, null);
    if (btn.id === "btnH1") document.execCommand("formatBlock", false, "h1");
    if (btn.id === "btnQuote") document.execCommand("formatBlock", false, "blockquote");
  });
});

// Save edit chapter
const saveEditChapter = document.getElementById("saveEditChapter");
if (saveEditChapter) {
  saveEditChapter.addEventListener("click", async () => {
    const pathParts = window.location.pathname.split("/");
    const novelId = pathParts[2];
    const chapterId = pathParts[4];
    const token = localStorage.getItem("token");

    const title = document.getElementById("editChapterTitle").value.trim();
    const content = document.getElementById("editChapterContent").innerHTML.trim();

    const res = await fetch(`/chapter/api/novels/${novelId}/chapters/${chapterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();
    if (res.ok) {
      alert("อัปเดตตอนสำเร็จ");
      location.reload();
    } else {
      alert("แก้ไขไม่สำเร็จ: " + (data.error || "ไม่ทราบสาเหตุ"));
    }
  });
}