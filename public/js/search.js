// ========== search.js ==========
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    const category = params.get("category") || "";
    const type = params.get("type") || "";

    const keywordEl = document.getElementById("keyword");
    if (keywordEl) {
        let text = q ? `ชื่อ/ผู้แต่ง: ${q}` : "";
        if (category) text += (text ? " | " : "") + `แนว: ${category}`;
        if (type) text += (text ? " | " : "") + `ประเภท: ${type}`;
        keywordEl.textContent = text || "ทั้งหมด";
    }

    const resultsDiv = document.getElementById("results");
    if (resultsDiv) {
        fetch("/light-novel/api/novels")
            .then(res => res.json())
            .then(novels => {
                const filtered = novels.filter(n => {
                    const matchName = q ? (n.name.includes(q) || n.author.includes(q)) : true;
                    const matchCategory = category ? n.category === category : true;
                    const matchType = type ? n.type === type : true;
                    return matchName && matchCategory && matchType;
                });

                resultsDiv.innerHTML = "";
                if (filtered.length === 0) {
                    resultsDiv.innerHTML = `<p class="text-gray-500 col-span-full">ไม่พบนิยายที่ค้นหา</p>`;
                } else {
                    filtered.forEach(novel => {
                        const card = document.createElement("div");
                        card.className = "bg-white rounded-xl shadow p-2";
                        card.innerHTML = `
                <a href="/novel/${novel.id}">
                  <img src="${novel.image || 'https://picsum.photos/200/300'}"
                       alt="${novel.name}"
                       class="rounded-lg w-full">
                  <h4 class="font-semibold mt-2">${novel.name}</h4>
                  <p class="text-sm text-zinc-500">${novel.author || "ไม่ระบุผู้แต่ง"}</p>
                  <p class="text-xs text-zinc-400">${novel.category} • ${novel.type}</p>
                </a>
              `;
                        resultsDiv.appendChild(card);
                    });
                }
            })
            .catch(() => {
                resultsDiv.innerHTML = `<p class="text-red-500">โหลดข้อมูลผิดพลาด</p>`;
            });
    }
});


function doSearch() {
    const q = document.getElementById("searchInput").value.trim();
    const category = document.getElementById("searchCategory").value;
    const type = document.getElementById("searchType").value;

    // redirect ไปหน้า /search พร้อม query string
    const url = new URL("/search", window.location.origin);
    if (q) url.searchParams.set("q", q);
    if (category) url.searchParams.set("category", category);
    if (type) url.searchParams.set("type", type);

    window.location.href = url.toString();
}