import { supabase } from "../supabase.js";

const grid = document.getElementById("anime-grid");
const ADMINS = ["anilord71@gmail.com"];
let currentUser = null;

async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    currentUser = data.session.user;
  } else {
    window.location.href = "../login/index.html";
  }
}

async function loadAnimes() {
  const { data, error } = await supabase.from("animes").select("*");
  if (error) {
    grid.innerHTML = "<p>Xatolik: " + error.message + "</p>";
    return;
  }

  grid.innerHTML = "";
  data.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${anime.rasm_url}" alt="${anime.nomi}">
      <h3>${anime.nomi}</h3>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("admin-btn")) {
        window.location.href = `../detail/index.html?id=${anime.id}`;
      }
    });

    if (currentUser && ADMINS.includes(currentUser.email)) {
      const btnWrap = document.createElement("div");
      btnWrap.innerHTML = `
        <button class="admin-btn" onclick="window.location.href='../edit/index.html?id=${anime.id}'">✏️ Tahrirlash</button>
        <button class="admin-btn" onclick="deleteAnime(${anime.id})">🗑 O‘chirish</button>
      `;
      card.appendChild(btnWrap);
    }

    grid.appendChild(card);
  });
}

window.deleteAnime = async (id) => {
  if (confirm("Haqiqatan ham o‘chirilsinmi?")) {
    await supabase.from("animes").delete().eq("id", id);
    loadAnimes();
  }
}

document.getElementById("logout").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "../login/index.html";
});

checkSession().then(loadAnimes);
