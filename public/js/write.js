/* --- dummy store in localStorage --- */
const KEY = "novel-editor-demo";
const state = JSON.parse(localStorage.getItem(KEY) || `{
"novelName":"ตัวอย่างเรื่อง",
"chapters":[
{"id":"c1","name":"ตอนที่ 1","content":"<p>พิมพ์เนื้อหาตอนที่ 1</p>"},
{"id":"c2","name":"ตอนที่ 2","content":""},
{"id":"c3","name":"ตอนที่ 3","content":""}
],
"active":"c1"
}`);

const title = document.getElementById("novelName");

// โหลดค่าที่บันทึกไว้
title.textContent = localStorage.getItem("novelName") || title.textContent;

// บันทึกเมื่อแก้ไข
title.addEventListener("input", () => {
  localStorage.setItem("novelName", title.textContent);
});

const els = {
  list: document.getElementById('chapterList'),
  title: document.getElementById('chapterTitle'),
  editor: document.getElementById('editor'),
  novelName: document.getElementById('novelName'),
  add: document.getElementById('addChapter'),
  btnDraft: document.getElementById('btnDraft'),
  btnPublish: document.getElementById('btnPublish')
};

function saveLocal() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function renderList() {
  els.list.innerHTML = "";
  state.chapters.forEach((ch, idx) => {
    const row = document.createElement('div');
    row.className = 'chapter' + (ch.id === state.active ? ' active' : '');
    row.onclick = () => activate(ch.id);
    row.innerHTML = `
  <div class="ch-num">#${idx + 1}</div>
  <div class="ch-name" title="${ch.name}">${ch.name || "ตอนนี้ยังไม่ได้ตั้งชื่อ"}</div>
  <div class="tools">
    <button class="ghost" title="เปลี่ยนชื่อ" onclick="event.stopPropagation(); renameChapter('${ch.id}')">✎</button>
    <button class="ghost" title="ลบ" onclick="event.stopPropagation(); deleteChapter('${ch.id}')">🗑</button>
  </div>`;
    els.list.appendChild(row);
  });
}

function activate(id) {
  const ch = state.chapters.find(c => c.id === id);
  state.active = id;
  els.title.value = ch.name || "";
  els.editor.innerHTML = ch.content || "";
  renderList();
  saveLocal();
}

function renameChapter(id) {
  const ch = state.chapters.find(c => c.id === id);
  const name = prompt("ตั้งชื่อตอน", ch.name || "");
  if (name !== null) { ch.name = name.trim(); saveLocal(); renderList(); if (id === state.active) els.title.value = ch.name; }
}

function deleteChapter(id) {
  if (!confirm("ลบตอนนี้?")) return;
  const i = state.chapters.findIndex(c => c.id === id);
  if (i > -1) { state.chapters.splice(i, 1); if (state.active === id && state.chapters[0]) state.active = state.chapters[0].id; saveLocal(); renderList(); activate(state.active); }
}

els.add.onclick = () => {
  const nid = 'c' + Math.random().toString(36).slice(2, 7);
  state.chapters.push({ id: nid, name: "ตอนใหม่", content: "" });
  saveLocal(); renderList(); activate(nid);
};

els.title.addEventListener('input', () => {
  const ch = state.chapters.find(c => c.id === state.active);
  ch.name = els.title.value;
  renderList(); saveLocal();
});

function autoSave() {
  const ch = state.chapters.find(c => c.id === state.active);
  ch.content = els.editor.innerHTML;
  saveLocal();
}
setInterval(autoSave, 3000);

document.querySelectorAll('[data-cmd]').forEach(b => {
  b.onclick = () => document.execCommand(b.dataset.cmd, false, null);
});
document.getElementById('btnH1').onclick = () => document.execCommand('formatBlock', false, 'h2');
document.getElementById('btnQuote').onclick = () => document.execCommand('formatBlock', false, 'blockquote');

els.btnDraft.onclick = () => { autoSave(); alert('บันทึกแบบร่างแล้ว (localStorage)'); };
els.btnPublish.onclick = () => { autoSave(); alert('เผยแพร่เดโม: ส่งข้อมูลไป backend จริงในโปรเจกต์ของคุณ'); };

window.addEventListener('load', () => {
  els.novelName.textContent = state.novelName;
  renderList();
  activate(state.active || state.chapters[0].id);
});
const novelName = document.getElementById("novelName");

// โหลดค่าที่เคยบันทึก
const savedTitle = localStorage.getItem("novelName");
if (savedTitle) {
  novelName.textContent = savedTitle;
}

// เวลาแก้ไข h1 → บันทึกลง localStorage
novelName.addEventListener("input", () => {
  localStorage.setItem("novelName", novelName.textContent.trim());
});