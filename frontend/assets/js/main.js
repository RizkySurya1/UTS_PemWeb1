// =======================================
// KONFIGURASI API
// =======================================
const API_BASE_URL = "http://localhost:3000/api";

// =======================================
// STATE
// =======================================
let currentUser = null;
let portfolioItems = [];

// =======================================
// UTIL UMUM
// =======================================
function getCurrentPage() {
  const path = window.location.pathname;
  return path.split("/").pop();
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }
}

function loadCurrentUser() {
  const saved = localStorage.getItem("currentUser");
  currentUser = saved ? JSON.parse(saved) : null;
}

function requireAuth() {
  if (!currentUser) {
    window.location.href = "login.html";
  }
}

// Pesan cantik di bawah form (login & register)
function showMessage(text, type = "info") {
  const box = document.getElementById("messageBox");
  if (!box) {
    // fallback kalau tidak ada messageBox di halaman
    alert(text);
    return;
  }

  box.textContent = text;
  box.style.padding = "10px";
  box.style.marginTop = "10px";
  box.style.borderRadius = "8px";
  box.style.textAlign = "center";
  box.style.fontSize = "0.9rem";

  if (type === "error") {
    box.style.background = "#ffdddd";
    box.style.color = "#cc0000";
  } else if (type === "success") {
    box.style.background = "#ddffdd";
    box.style.color = "#006600";
  } else {
    box.style.background = "#e6e6e6";
    box.style.color = "#333";
  }

  setTimeout(() => {
    box.textContent = "";
    box.style.padding = "0";
  }, 3000);
}

// =======================================
// NAVBAR
// =======================================
function updateNavbar() {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn || !registerBtn || !dashboardBtn || !logoutBtn) return;

  if (currentUser) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    dashboardBtn.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    dashboardBtn.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// HERO button state di halaman index
function updateHeroButtons() {
  if (getCurrentPage() !== "index.html") return;

  const heroLoggedOut = document.getElementById("heroLoggedOut");
  const heroLoggedIn = document.getElementById("heroLoggedIn");
  if (!heroLoggedOut || !heroLoggedIn) return;

  if (currentUser) {
    heroLoggedOut.style.display = "none";
    heroLoggedIn.style.display = "flex";
  } else {
    heroLoggedOut.style.display = "flex";
    heroLoggedIn.style.display = "none";
  }
}

function setupLogout() {
  const logoutLink = document.getElementById("logoutLink");
  if (!logoutLink) return;

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    currentUser = null;
    saveCurrentUser();
    window.location.href = "index.html";
  });
}

// =======================================
// AUTH: REGISTER & LOGIN
// =======================================
function initRegisterPage() {
  if (getCurrentPage() !== "register.html") return;

  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bandName = document.getElementById("regBandName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;

    // VALIDASI FRONTEND
    if (bandName.length < 3) {
      showMessage("Nama band terlalu pendek.", "error");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      showMessage("Format email tidak valid.", "error");
      return;
    }
    if (username.length < 4) {
      showMessage("Username minimal 4 karakter.", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("Password minimal 6 karakter.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bandName, email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Gagal registrasi.", "error");
        return;
      }

      showMessage("Registrasi berhasil! Mengalihkan ke halaman login...", "success");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } catch (err) {
      console.error(err);
      showMessage("Terjadi kesalahan koneksi ke server.", "error");
    }
  });
}

function initLoginPage() {
  if (getCurrentPage() !== "login.html") return;

  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailOrUsername = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // VALIDASI FRONTEND
    if (emailOrUsername.length < 3) {
      showMessage("Masukkan email atau username yang benar.", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("Password minimal 6 karakter.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Login gagal.", "error");
        return;
      }

      const u = data.user;
      currentUser = {
        id: u.id,
        bandName: u.band_name,
        email: u.email,
        username: u.username,
      };

      saveCurrentUser();
      showMessage("Login berhasil, mengalihkan ke dashboard...", "success");

      setTimeout(() => {
        window.location.href = "main.html";
      }, 1000);
    } catch (err) {
      console.error(err);
      showMessage("Terjadi kesalahan koneksi ke server.", "error");
    }
  });
}

// =======================================
// PORTFOLIO API
// =======================================
async function fetchPortfolio(userId) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/portfolio?userId=${encodeURIComponent(userId)}`
    );
    if (!res.ok) {
      console.error("Gagal mengambil portfolio");
      portfolioItems = [];
      return;
    }
    const data = await res.json();
    portfolioItems = data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      fileName: item.fileName,
      date: new Date(item.createdAt).toLocaleDateString("id-ID"),
    }));
  } catch (err) {
    console.error(err);
    portfolioItems = [];
  }
}

async function createPortfolioItem(payload) {
  const res = await fetch(`${API_BASE_URL}/portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat portofolio");
  }
  return data;
}

async function updatePortfolioItem(id, payload) {
  const res = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate portofolio");
  }
  return data;
}

async function deletePortfolioItemAPI(id) {
  const res = await fetch(`${API_BASE_URL}/portfolio/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus portofolio");
  }
  return data;
}

// =======================================
// DASHBOARD (main.html)
// =======================================
function updateStats() {
  const photoCountEl = document.getElementById("photoCount");
  const songCountEl = document.getElementById("songCount");
  const viewCountEl = document.getElementById("viewCount");

  if (!photoCountEl || !songCountEl || !viewCountEl) return;

  const photoCount = portfolioItems.filter((i) => i.type === "photo").length;
  const songCount = portfolioItems.filter((i) => i.type === "song").length;

  photoCountEl.textContent = photoCount;
  songCountEl.textContent = songCount;
  viewCountEl.textContent = Math.floor(Math.random() * 1000);
}

function renderDashboardPortfolio() {
  const grid = document.getElementById("portfolioGrid");
  if (!grid) return;

  if (!portfolioItems.length) {
    grid.innerHTML =
      '<p style="opacity: 0.7; text-align: center; grid-column: 1/-1;">Belum ada portofolio. Mulai upload sekarang!</p>';
    return;
  }

  const icons = { photo: "📸", song: "🎵", video: "🎬" };

  grid.innerHTML = portfolioItems
    .map(
      (item) => `
      <div class="portfolio-item">
        <div class="portfolio-image">${icons[item.type] || "🎵"}</div>
        <div class="portfolio-content">
          <h3>${item.title}</h3>
          <p>${item.description || ""}</p>
          <p style="font-size: 0.8rem; opacity: 0.5;">${item.date}</p>
          <div class="portfolio-actions">
            <button class="btn btn-small btn-secondary" onclick="editItem(${item.id})">Edit</button>
            <button class="btn btn-small btn-danger" onclick="deleteItem(${item.id})">Hapus</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function initDashboardPage() {
  if (getCurrentPage() !== "main.html") return;

  requireAuth();

  const bandNameDisplay = document.getElementById("bandNameDisplay");
  if (bandNameDisplay && currentUser) {
    bandNameDisplay.textContent = currentUser.bandName;
  }

  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("uploadTitle").value.trim();
      const desc = document.getElementById("uploadDesc").value.trim();
      const type = document.getElementById("uploadType").value;
      const file = fileInput.files[0];

      if (!title || !desc) {
        alert("Judul dan deskripsi wajib diisi.");
        return;
      }

      const fileName = file ? file.name : "";

      try {
        await createPortfolioItem({
          userId: currentUser.id,
          title,
          description: desc,
          type,
          fileName,
        });

        alert("Upload berhasil!");

        uploadForm.reset();
        fileInput.value = "";

        await fetchPortfolio(currentUser.id);
        renderDashboardPortfolio();
        updateStats();
      } catch (err) {
        console.error(err);
        alert(err.message || "Gagal upload portofolio.");
      }
    });
  }

  const viewPublicBtn = document.getElementById("viewPublicBtn");
  if (viewPublicBtn) {
    viewPublicBtn.addEventListener("click", () => {
      window.location.href = "detail.html";
    });
  }

  if (currentUser) {
    fetchPortfolio(currentUser.id).then(() => {
      renderDashboardPortfolio();
      updateStats();
    });
  }
}

// Edit bisa dikembangkan, sekarang hanya placeholder
function editItem(id) {
  alert("Fitur edit (PUT API) bisa kamu tambahkan nanti sebagai pengembangan.");
}

async function deleteItem(id) {
  if (!confirm("Yakin ingin menghapus item ini?")) return;
  try {
    await deletePortfolioItemAPI(id);
    await fetchPortfolio(currentUser.id);
    renderDashboardPortfolio();
    updateStats();
  } catch (err) {
    console.error(err);
    alert(err.message || "Gagal menghapus portofolio.");
  }
}

// =======================================
// DETAIL / PUBLIC PORTFOLIO (detail.html)
// =======================================
async function initDetailPage() {
  if (getCurrentPage() !== "detail.html") return;

  const bandNameEl = document.getElementById("publicBandName");
  const bandBioEl = document.getElementById("publicBandBio");
  const publicGrid = document.getElementById("publicPortfolioGrid");
  const publicNotice = document.getElementById("publicNotice");

  if (!bandNameEl || !publicGrid) return;

  // Cek apakah ada ?userId= di URL
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get("userId");

  let userIdToShow;
  let bandNameToShow;

  if (paramId) {
    userIdToShow = Number(paramId);
    bandNameToShow = "Band Terdaftar #" + paramId;
  } else if (currentUser) {
    userIdToShow = currentUser.id;
    bandNameToShow = currentUser.bandName;
  } else {
    userIdToShow = 1; // default userId 1
    bandNameToShow = "Band Demo";
  }

  bandNameEl.textContent = bandNameToShow;
  bandBioEl.textContent = "Rock Your Soul, Feel The Beat";

  if (!currentUser && publicNotice) {
    publicNotice.textContent =
      "*Anda melihat portofolio band publik tanpa login.";
  }

  try {
    await fetchPortfolio(userIdToShow);
  } catch (err) {
    console.error(err);
  }

  if (!portfolioItems.length) {
    publicGrid.innerHTML =
      '<p style="opacity: 0.7; text-align: center; grid-column: 1/-1;">Belum ada portofolio yang ditampilkan.</p>';
    return;
  }

  const icons = { photo: "📸", song: "🎵", video: "🎬" };

  publicGrid.innerHTML = portfolioItems
    .map(
      (item) => `
      <div class="portfolio-item">
        <div class="portfolio-image">${icons[item.type] || "🎵"}</div>
        <div class="portfolio-content">
          <h3>${item.title}</h3>
          <p>${item.description || ""}</p>
          <p style="font-size: 0.8rem; opacity: 0.5;">${item.date}</p>
        </div>
      </div>
    `
    )
    .join("");
}

// =======================================
// INIT GLOBAL
// =======================================
document.addEventListener("DOMContentLoaded", () => {
  loadCurrentUser();
  updateNavbar();
  updateHeroButtons(); // atur tombol hero di halaman utama
  setupLogout();

  initRegisterPage();
  initLoginPage();
  initDashboardPage();
  initDetailPage();
});
