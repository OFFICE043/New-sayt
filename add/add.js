import { supabase } from "../supabase.js";

const form = document.getElementById("add-form");
const episodesDiv = document.getElementById("episodes");
const addEpisodeBtn = document.getElementById("add-episode");

let episodeCount = 0;

// 🔹 Epizod qo‘shish qatori
function addEpisodeRow(url = "") {
  episodeCount++;
  const row = document.createElement("div");
  row.classList.add("episode-row");
  row.innerHTML = `
    <input type="text" placeholder="${episodeCount}-qism URL" value="${url}">
    <button type="button" class="remove">➖</button>
  `;
  row.querySelector(".remove").addEventListener("click", () => row.remove());
  episodesDiv.appendChild(row);
}

// Bosilganda yangi epizod qo‘shish
addEpisodeBtn.addEventListener("click", () => addEpisodeRow());

// Forma yuborish
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

  const { error } = await supabase.from("animes").insert([
    {
      nomi,
      tavsif,
      janr,
      qismlar_soni,
      chiqqan_qismlar,
      rasm_url,
      yuklab_url,
      episodes
    }
  ]);

  if (error) {
    alert("Xatolik: " + error.message);
  } else {
    alert("Anime muvaffaqiyatli qo‘shildi!");
    window.location.href = "../anime-list/index.html";
  }
});
