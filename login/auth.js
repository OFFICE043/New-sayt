hereimport { supabase } from "../supabase.js";

// Ro‘yxatdan o‘tish
document.querySelector("#register-box form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.querySelector("input[type=text]").value;
  const password = e.target.querySelector("#parol1").value;

  const { error } = await supabase.auth.signUp({
    email: username + "@example.com",
    password: password,
  });

  if (error) {
    alert("Xatolik: " + error.message);
  } else {
    window.location.href = "../anime-list/index.html";
  }
});

// Kirish
document.querySelector("#login-box form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.querySelector("input[type=text]").value;
  const password = e.target.querySelector("#parol2").value;

  const { error } = await supabase.auth.signInWithPassword({
    email: username + "@example.com",
    password: password,
  });

  if (error) {
    alert("Xatolik: " + error.message);
  } else {
    window.location.href = "../anime-list/index.html";
  }
});
