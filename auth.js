/* ==========================================================
   Cyberio — auth.js
   Firebase Authentication (Email & Password).
   GANTI nilai firebaseConfig dengan konfigurasi project kamu.
   ========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_PROJECT_ID.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_PROJECT_ID.appspot.com",
  messagingSenderId: "ISI_SENDER_ID",
  appId: "ISI_APP_ID"
};

const isConfigured = !firebaseConfig.apiKey.startsWith("ISI_");
const auth = isConfigured ? getAuth(initializeApp(firebaseConfig)) : null;

const $ = (id) => document.getElementById(id);
const el = {
  btnLogin: $("btnLogin"),
  btnLogout: $("btnLogout"),
  userChip: $("userChip"),
  userName: $("userName"),
  modal: $("authModal"),
  modalTitle: $("modalTitle"),
  modalTabs: document.querySelector(".modal-tabs"),
  mtabs: [...document.querySelectorAll(".mtab")],
  loginForm: $("loginForm"),
  registerForm: $("registerForm"),
  resetForm: $("resetForm"),
  formMsg: $("formMsg")
};
const TITLES = {
  login: "Masuk ke Cyberio",
  register: "Buat akun Cyberio",
  reset: "Atur ulang kata sandi"
};
const NOT_CONFIGURED = "Firebase belum dikonfigurasi. Lihat README.md.";
let lastFocus = null;

const ERRORS = {
  "auth/invalid-email": "Format email tidak valid.",
  "auth/user-not-found": "Email atau kata sandi salah.",
  "auth/wrong-password": "Email atau kata sandi salah.",
  "auth/invalid-credential": "Email atau kata sandi salah.",
  "auth/email-already-in-use": "Email sudah terdaftar. Silakan masuk.",
  "auth/weak-password": "Kata sandi terlalu lemah.",
  "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi beberapa saat.",
  "auth/network-request-failed": "Koneksi internet bermasalah.",
  "auth/unauthorized-domain": "Domain ini belum diizinkan di Firebase. Lihat README.md.",
  "auth/operation-not-allowed": "Metode Email/Password belum diaktifkan di Firebase."
};
function errMsg(err) {
  return ERRORS[err && err.code] || "Terjadi kesalahan. Coba lagi.";
}
function setMsg(text, type = "") {
  el.formMsg.textContent = text;
  el.formMsg.className = "form-msg " + type;
}
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function validPassword(v) {
  if (v.length < 8) return "Minimal 8 karakter.";
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Harus mengandung huruf dan angka.";
  return "";
}
function fieldError(input, msg) {
  input.classList.toggle("invalid", !!msg);
  const small = input.parentElement.querySelector("small");
  if (small) small.textContent = msg || "";
  return !msg;
}

function showView(view) {
  el.loginForm.hidden = view !== "login";
  el.registerForm.hidden = view !== "register";
  el.resetForm.hidden = view !== "reset";
  el.modalTabs.hidden = view === "reset";
  el.mtabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === view)));
  el.modalTitle.textContent = TITLES[view];
  setMsg("");
  document.querySelectorAll(".modal form input").forEach((i) => fieldError(i, ""));
  const first = document.querySelector(".modal form:not([hidden]) input");
  if (first) first.focus();
}
function openModal(view = "login") {
  lastFocus = document.activeElement;
  el.modal.hidden = false;
  document.body.classList.add("modal-open");
  showView(view);
  if (!auth) setMsg(NOT_CONFIGURED, "error");
}
function closeModal() {
  el.modal.hidden = true;
  document.body.classList.remove("modal-open");
  [el.loginForm, el.registerForm, el.resetForm].forEach((f) => f.reset());
  setMsg("");
  if (lastFocus) lastFocus.focus();
}

async function withBusy(form, label, fn) {
  const btn = form.querySelector('button[type="submit"]');
  const old = btn.textContent;
  btn.disabled = true;
  btn.textContent = label;
  try {
    await fn();
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
}

el.btnLogin.addEventListener("click", () => openModal("login"));
document.querySelectorAll("[data-close]").forEach((n) => n.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el.modal.hidden) closeModal();
});
document.querySelectorAll("[data-view]").forEach((n) => {
  n.addEventListener("click", () => showView(n.dataset.view));
});

el.loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!auth) return setMsg(NOT_CONFIGURED, "error");
  const email = $("loginEmail");
  const pass = $("loginPass");
  const okEmail = fieldError(email, validEmail(email.value) ? "" : "Format email tidak valid.");
  const okPass = fieldError(pass, pass.value ? "" : "Kata sandi wajib diisi.");
  if (!(okEmail && okPass)) return;

  await withBusy(el.loginForm, "Memproses...", async () => {
    try {
      await signInWithEmailAndPassword(auth, email.value.trim(), pass.value);
      closeModal();
    } catch (err) {
      setMsg(errMsg(err), "error");
    }
  });
});

el.registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!auth) return setMsg(NOT_CONFIGURED, "error");
  const email = $("regEmail");
  const pass = $("regPass");
  const confirm = $("regConfirm");
  const okEmail = fieldError(email, validEmail(email.value) ? "" : "Format email tidak valid.");
  const okPass = fieldError(pass, validPassword(pass.value));
  const okConfirm = fieldError(confirm, confirm.value === pass.value ? "" : "Kata sandi tidak sama.");
  if (!(okEmail && okPass && okConfirm)) return;

  await withBusy(el.registerForm, "Memproses...", async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.value.trim(), pass.value);
      closeModal();
    } catch (err) {
      setMsg(errMsg(err), "error");
    }
  });
});

el.resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!auth) return setMsg(NOT_CONFIGURED, "error");
  const email = $("resetEmail");
  if (!fieldError(email, validEmail(email.value) ? "" : "Format email tidak valid.")) return;

  await withBusy(el.resetForm, "Mengirim...", async () => {
    try {
      await sendPasswordResetEmail(auth, email.value.trim());
      setMsg("Jika email terdaftar, tautan reset kata sandi sudah dikirim. Cek kotak masuk atau folder spam.", "ok");
    } catch (err) {
      setMsg(errMsg(err), "error");
    }
  });
});

el.btnLogout.addEventListener("click", async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (err) {
    alert(errMsg(err));
  }
});

if (auth) {
  onAuthStateChanged(auth, (user) => {
    const loggedIn = !!user;
    el.btnLogin.hidden = loggedIn;
    el.userChip.hidden = !loggedIn;
    if (loggedIn) {
      el.userName.textContent = user.email.split("@")[0];
      el.userName.title = user.email;
    }
  });
} else {
  el.btnLogin.title = "Firebase belum dikonfigurasi";
}
