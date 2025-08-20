// Подключение к Supabase
const SUPABASE_URL = "https://shihhijsqpypgsjagqle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaWhoaWpzcXB5cGdzamFncWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDA4NDMsImV4cCI6MjA3MTI3Njg0M30.rNM6LjZ5gUk4KT2s6OeWVEDJmIIKILFvtCh4Wop2XQk";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Регистрация
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Регистрация успешна!");
}

// Вход
async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else window.location.href = "index.html";
}

// Загрузка видео
async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const title = document.getElementById("videoTitle").value;
  const desc = document.getElementById("videoDesc").value;
  if (!file) return alert("Выберите файл");

  const { data, error } = await supabase.storage.from("videos").upload(Date.now()+"_"+file.name, file);
  if (error) return alert(error.message);

  const url = `${SUPABASE_URL}/storage/v1/object/public/videos/${data.path}`;
  await supabase.from("videos").insert([{ title, description: desc, video_url: url }]);

  alert("Видео загружено!");
  window.location.href = "index.html";
}

// Загрузка ленты
async function loadFeed() {
  const feed = document.getElementById("video-feed");
  if (!feed) return;

  const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
  if (error) return console.error(error);

  feed.innerHTML = "";
  data.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="https://img.youtube.com/vi/ScMzIvxBSi4/mqdefault.jpg">
                      <h4>${v.title}</h4>`;
    card.onclick = () => window.location.href = `watch.html?id=${v.id}`;
    feed.appendChild(card);
  });
}
loadFeed();

// Страница просмотра
async function loadVideo() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  const { data, error } = await supabase.from("videos").select("*").eq("id", id).single();
  if (error) return;

  document.getElementById("watchVideo").src = data.video_url;
  document.getElementById("videoTitle").innerText = data.title;
  document.getElementById("videoDesc").innerText = data.description;
}
loadVideo();