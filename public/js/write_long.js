document.addEventListener("DOMContentLoaded", () => {
  const btnPublish = document.getElementById("btnPublish");
  const btnPublishAll = document.getElementById("btnPublishAll");
  const btnAdd = document.getElementById("addChapter");
  const chapterList = document.getElementById("chapterList");
  const inputTitle = document.getElementById("chapterTitle");
  const inputContent = document.getElementById("editor");

  const state = {
    chapters: [],
    active: null
  };

  // ===== Toolbar =====
  document.querySelectorAll(".tbtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.cmd;
      if (cmd) document.execCommand(cmd, false, null);
      if (btn.id === "btnH1") document.execCommand("formatBlock", false, "H1");
      if (btn.id === "btnQuote") document.execCommand("formatBlock", false, "BLOCKQUOTE");
      inputContent.focus();
    });
  });

  // ===== Render list =====
  function renderList() {
    chapterList.innerHTML = "";
    state.chapters.forEach((ch) => {
      const row = document.createElement("div");
      row.className =
        "chapter-row p-2 border-b cursor-pointer hover:bg-gray-100 flex justify-between items-center" +
        (state.active === ch.id ? " bg-gray-200" : "");

      const titleSpan = document.createElement("span");
      titleSpan.textContent = ch.title || "ตอนใหม่";
      if (!ch.title) titleSpan.classList.add("text-gray-400");

      const rightBox = document.createElement("div");
      rightBox.className = "flex items-center gap-2";

      if (ch.isPremium) {
        const badge = document.createElement("span");
        badge.textContent = "PREMIUM";
        badge.className = "text-xs bg-yellow-400 text-white px-2 py-0.5 rounded";
        rightBox.appendChild(badge);
      }

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = !!ch.isPremium;
      check.className = "form-checkbox h-4 w-4 text-yellow-500 cursor-pointer";

      check.addEventListener("change", (e) => {
        ch.isPremium = e.target.checked;
        renderList();
      });

      rightBox.appendChild(check);

      row.appendChild(titleSpan);
      row.appendChild(rightBox);
      row.addEventListener("click", () => activate(ch.id));
      chapterList.appendChild(row);
    });
  }

  function activate(id) {
    const ch = state.chapters.find((c) => c.id === id);
    if (!ch) return;
    state.active = id;
    inputTitle.value = ch.title || "";
    inputContent.innerHTML = ch.content || "";
  }

  function saveActive() {
    const ch = state.chapters.find((c) => c.id === state.active);
    if (ch) {
      ch.title = inputTitle.value.trim();
      ch.content = inputContent.innerHTML.trim();
      renderList();
    }
  }

  inputTitle.addEventListener("input", saveActive);
  inputContent.addEventListener("input", saveActive);

  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const id = "tmp-" + Date.now();
      state.chapters.push({ id, title: "", content: "", isPremium: 0 });
      activate(id);
      renderList();
    });
  }

  // --- publish ตอนเดียว ---
  if (btnPublish) {
    btnPublish.addEventListener("click", async () => {
      const novelId = window.location.pathname.split("/").pop();
      const token = localStorage.getItem("token");
      const ch = state.chapters.find((c) => c.id === state.active);

      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/login";
        return;
      }
      if (!ch || !ch.title || !ch.content) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }

      try {
        const res = await fetch(`/chapter/api/novels/${novelId}/chapters`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            title: ch.title,
            content: ch.content,
            is_premium: ch.isPremium ? 1 : 0
          })
        });

        const data = await res.json();
        if (data.error) {
          alert("ผิดพลาด: " + data.error);
        } else {
          ch.id = data.id;
          renderList();
          alert("เผยแพร่ตอนสำเร็จ 🎉");
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }
    });
  }

  // --- publish ทั้งหมด ---
  if (btnPublishAll) {
    btnPublishAll.addEventListener("click", async () => {
      const novelId = window.location.pathname.split("/").pop();
      const token = localStorage.getItem("token");

      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "/login";
        return;
      }

      const chaptersToSave = state.chapters.filter(ch => ch.title && ch.content);

      if (chaptersToSave.length === 0) {
        alert("ไม่มีตอนที่พร้อมบันทึก");
        return;
      }

      try {
        for (const ch of chaptersToSave) {
          const res = await fetch(`/chapter/api/novels/${novelId}/chapters`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              title: ch.title,
              content: ch.content,
              is_premium: ch.isPremium ? 1 : 0
            })
          });

          const data = await res.json();
          if (!data.error) {
            ch.id = data.id;
          }
        }
        renderList();
        alert("บันทึกทุกตอนสำเร็จ 🎉");
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }
    });
  }
});
