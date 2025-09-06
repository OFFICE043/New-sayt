import { supabase } from "../supabase.js";

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

const titleEl = document.getElementById("anime-title");
const rasmEl = document.getElementById("anime-rasm");
const tavsifEl = document.getElementById("anime-tavsif");
const janrEl = document.getElementById("anime-janr");
const jamiEl = document.getElementById("anime-jami");
const chiqqanEl = document.getElementById("anime-chiqqan");
const episodeButtonsEl = document.getElementById("episode-buttons");
const player = document.getElementById("player");
const downloadEl = document.getElementById("download");

const commentsList = document.getElementById("comments-list");
const commentForm = document.getElementById("comment-form");
const loginMessage = document.getElementById("login-message");

let currentUser = null;
const ADMINS = ["anilord71@gmail.com"];

// === Session tekshirish ===
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    currentUser = data.session.user;
    commentForm.classList.remove("hidden");
    loginMessage.style.display = "none";
  } else {
    commentForm.classList.add("hidden");
    loginMessage.style.display = "block";
  }
}

// === Anime yuklash ===
async function loadAnime() {
  const { data, error } = await supabase
    .from("animes")
    .select("*")
    .eq("id", animeId)
    .single();

  if (error) {
    alert("Xatolik: " + error.message);
    return;
  }

  const anime = data;
  titleEl.textContent = anime.nomi;
  rasmEl.src = anime.rasm_url;
  tavsifEl.textContent = anime.tavsif;
  janrEl.textContent = anime.janr;
  jamiEl.textContent = anime.qismlar_soni;
  chiqqanEl.textContent = anime.chiqqan_qismlar;
  downloadEl.href = anime.yuklab_url;

  episodeButtonsEl.innerHTML = "";
  if (anime.episodes && Array.isArray(anime.episodes)) {
    anime.episodes.forEach((url, index) => {
      const btn = document.createElement("button");
      btn.textContent = (index + 1) + "-qism";
      btn.addEventListener("click", () => {
        player.src = url;
        player.play();
        saveHistory(index + 1); // ✅ tarixga yozamiz
      });
      episodeButtonsEl.appendChild(btn);
    });
  }
}

// === Tarixni saqlash ===
async function saveHistory(episodeNum) {
  if (!currentUser) return;
  await supabase.from("history").upsert({
    user_id: currentUser.id,
    anime_id: animeId,
    last_watched: episodeNum,
    updated_at: new Date().toISOString()
  });
}

// === Kommentlar yuklash ===
async function loadComments() {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("anime_id", animeId)
    .order("created_at", { ascending: false });

  if (error) {
    commentsList.innerHTML = "<p>Xatolik: " + error.message + "</p>";
    return;
  }

  commentsList.innerHTML = "";
  data.forEach(c => {
    const div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `
      <p><b>${c.username || "Anonim"}:</b> ${c.text}</p>
      <small>${new Date(c.created_at).toLocaleString()}</small>
    `;

    if (currentUser && ADMINS.includes(currentUser.email)) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑 O‘chirish";
      delBtn.style.marginLeft = "10px";
      delBtn.addEventListener("click", async () => {
        if (confirm("Kommentni o‘chirishni xohlaysizmi?")) {
          await supabase.from("comments").delete().eq("id", c.id);
          loadComments();
        }
      });
      div.appendChild(delBtn);
    }

    commentsList.appendChild(div);
  });
}

// === Komment yuborish ===
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Avval login qiling!");
    return;
  }

  const text = document.getElementById("comment-text").value;
  const username = currentUser.email.split("@")[0];

  const { error } = await supabase.from("comments").insert([
    { anime_id: animeId, username, text }
  ]);

  if (error) {
    alert("Xatolik: " + error.message);
  } else {
    document.getElementById("comment-text").value = "";
    loadComments();
  }
});

checkSession().then(() => {
  loadAnime();
  loadComments();
});
