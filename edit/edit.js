import { supabase } from "../supabase.js";

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

const form = document.getElementById("edit-form");
const episodesDiv = document.getElementById("episodes");
const addEpisodeBtn = document.getElementById("add-episode");

let animeData = null;

// 🔹 Epizod row yaratish
function addEpisodeRow(url = "") {
  const row = document.createElement("div");
  row.classList.add("episode-row");
  row.innerHTML = `
    <input type="text" placeholder="Epizod URL" value="${url}">
    <button type="button" class="remove">➖</button>
  `;
  row.querySelector(".remove").addEventListener("click", () => row.remove());
  episodesDiv.appendChild(row);
}

// 🔹 Anime ma’lumotini yuklash
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

  animeData = data;

  document.getElementById("nomi").value = data.nomi;
  document.getElementById("tavsif").value = data.tavsif;
  document.getElementById("janr").value = data.janr;
  document.getElementById("jami").value = data.qismlar_soni;
  document.getElementById("chiqqan").value = data.chiqqan_qismlar;
  document.getElementById("rasm").value = data.rasm_url;
  document.getElementById("yuklab").value = data.yuklab_url;

  episodesDiv.innerHTML = "";
  if (data.episodes && Array.isArray(data.episodes)) {
    data.episodes.forEach(url => addEpisodeRow(url));
  }
}

// 🔹 Yangi epizod qo‘shish tugmasi
addEpisodeBtn.addEventListener("click", () => addEpisodeRow());

// 🔹 Formani yuborish (update)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomi = document.getElementById("nomi").value;
  const tavsif = document.getElementById("tavsif").value;
  const janr = document.getElementById("janr").value;
  const qismlar_soni = parseInt(document.getElementById("jami").value);
  const chiqqan_qismlar = parseInt(document.getElementById("chiqqan").value);
  const rasm_url = document.getElementById("rasm").value;
  const yuklab_url = document.getElementById("yuklab").value;

  const episodeInputs = episodesDiv.querySelectorAll("input");
  const episodes = Array.from(episodeInputs).map(input => input.value).filter(v => v);

  const { error } = await supabase
    .from("animes")
    .update({
      nomi,
      tavsif,
      janr,
      qismlar_soni,
      chiqqan_qismlar,
      rasm_url,
      yuklab_url,
      episodes
    })
    .eq("id", animeId);

  if (error) {
    alert("Xatolik: " + error.message);
  } else {
    alert("O‘zgartirish saqlandi!");
    window.location.href = "../detail/index.html?id=" + animeId;
  }
});

// Sahifa ochilganda avtomatik yuklash
loadAnime();
