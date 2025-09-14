document.addEventListener("DOMContentLoaded", () => {
    const btnPublish = document.getElementById("btnPublish");
    const editor = document.getElementById("editor");
  
    // ===== Toolbar =====
    document.querySelectorAll(".tbtn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cmd = btn.dataset.cmd;
        if (cmd) {
          document.execCommand(cmd, false, null);
        }
        if (btn.id === "btnH1") {
          document.execCommand("formatBlock", false, "H1");
        }
        if (btn.id === "btnQuote") {
          document.execCommand("formatBlock", false, "BLOCKQUOTE");
        }
        editor.focus();
      });
    });
  
    // ===== Publish (update novel เดิม) =====
    if (btnPublish) {
      btnPublish.addEventListener("click", async () => {
        const novelId = window.location.pathname.split("/").pop();
        const token = localStorage.getItem("token");
        const content = editor.innerHTML.trim();
  
        if (!token) {
          alert("กรุณาเข้าสู่ระบบก่อน");
          window.location.href = "/login";
          return;
        }
        if (!content) {
          alert("กรุณากรอกเนื้อหา");
          return;
        }
  
        try {
          const res = await fetch(`/light-novel/api/novels/${novelId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ description: null, coverImage: null, category: null, name: null, content })
          });
  
          const data = await res.json();
          if (data.error) {
            alert("ผิดพลาด: " + data.error);
          } else {
            alert("บันทึกเนื้อหาสำเร็จ 🎉");
          }
        } catch (err) {
          alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
      });
    }
  });
  