import {
  getCurrentUser,
  logout,
  loginWithApiKey,
  loginWithEmail,
  register,
  checkout,
} from "./auth.js";

export function renderProfile() {
  const user = getCurrentUser();
  const container = document.querySelector(".profile-container");

  if (!container) return;

  if (user) {
    container.innerHTML = `
      <div class="profile-card">
        <div class="profile-header">
          <h1>👤 ${user.username}</h1>
          <button class="logout-btn">🚪 Выйти</button>
        </div>

        <div class="profile-info">
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${user.email}</span>
          </div>
          <div class="info-row">
            <span class="label">API ключ:</span>
            <div class="api-key-wrapper">
              <code class="api-key">${user.apiKey}</code>
              <button class="copy-btn">📋 Копировать</button>
            </div>
          </div>
          <div class="info-row">
            <span class="label">ID пользователя:</span>
            <span class="value">${user.id}</span>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat">
            <span class="stat-number">${user.orders.length}</span>
            <span class="stat-label">Заказов</span>
          </div>
          <div class="stat">
            <span class="stat-number">${user.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} $</span>
            <span class="stat-label">На сумму</span>
          </div>
        </div>

        <div class="orders-section">
          <h2>📦 История заказов</h2>
          <div class="orders-list">
            ${
              user.orders.length === 0
                ? '<div class="empty-orders">У вас пока нет заказов</div>'
                : user.orders
                    .map(
                      (order) => `
              <div class="order-card">
                <div class="order-header">
                  <span class="order-id">Заказ #${order.id}</span>
                  <span class="order-date">${new Date(order.date).toLocaleString("ru-RU")}</span>
                </div>
                <div class="order-items">
                  ${order.items
                    .map(
                      (item) => `
                    <div class="order-item">
                      <span class="item-title">${item.title}</span>
                      <span class="item-quantity">x${item.result}</span>
                      <span class="item-price">${(item.price * item.result).toFixed(2)} $</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
                <div class="order-total">
                  Итого: <strong>${order.total.toFixed(2)} $</strong>
                </div>
              </div>
            `,
                    )
                    .join("")
            }
          </div>
        </div>
      </div>
    `;

    document.querySelector(".copy-btn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(user.apiKey);
      alert("Ключ скопирован");
    });

    document.querySelector(".logout-btn")?.addEventListener("click", () => {
      logout();
      renderProfile();
    });
  } else {
    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="tab-btn active" data-tab="login">🔐 Вход</button>
          <button class="tab-btn" data-tab="register">📝 Регистрация</button>
        </div>

        <div class="login-form active" id="loginForm">
          <div class="auth-error" id="loginError" style="display: none;"></div>

          <div class="auth-method">
            <h3>Вход по API ключу</h3>
            <input type="text" id="apiKeyInput" placeholder="64-символьный ключ">
            <button id="apiLoginBtn">Войти по ключу</button>
          </div>

          <div class="divider">или</div>

          <div class="auth-method">
            <h3>Вход по email</h3>
            <input type="email" id="emailInput" placeholder="example@mail.com">
            <button id="emailLoginBtn">Войти по email</button>
          </div>
        </div>

        <div class="register-form" id="registerForm">
          <div class="auth-error" id="registerError" style="display: none;"></div>

          <div class="auth-method">
            <h3>Регистрация</h3>
            <input type="text" id="regUsername" placeholder="Имя пользователя (мин. 4 символа)">
            <input type="email" id="regEmail" placeholder="Email">
            <button id="registerBtn">Зарегистрироваться</button>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document
          .getElementById("loginForm")
          .classList.toggle("active", btn.dataset.tab === "login");
        document
          .getElementById("registerForm")
          .classList.toggle("active", btn.dataset.tab === "register");

        document.getElementById("loginError").style.display = "none";
        document.getElementById("registerError").style.display = "none";
      });
    });

    document.getElementById("apiLoginBtn")?.addEventListener("click", () => {
      const apiKey = document.getElementById("apiKeyInput")?.value;
      const result = loginWithApiKey(apiKey);
      if (result.success) {
        renderProfile();
      } else {
        const errorDiv = document.getElementById("loginError");
        errorDiv.textContent = result.error;
        errorDiv.style.display = "block";
        setTimeout(() => (errorDiv.style.display = "none"), 3000);
      }
    });

    document.getElementById("emailLoginBtn")?.addEventListener("click", () => {
      const email = document.getElementById("emailInput")?.value;
      const result = loginWithEmail(email);
      if (result.success) {
        renderProfile();
      } else {
        const errorDiv = document.getElementById("loginError");
        errorDiv.textContent = result.error;
        errorDiv.style.display = "block";
        setTimeout(() => (errorDiv.style.display = "none"), 3000);
      }
    });

    document.getElementById("registerBtn")?.addEventListener("click", () => {
      const username = document.getElementById("regUsername")?.value;
      const email = document.getElementById("regEmail")?.value;
      const result = register(username, email);
      if (result.success) {
        renderProfile();
      } else {
        const errorDiv = document.getElementById("registerError");
        errorDiv.textContent = result.error;
        errorDiv.style.display = "block";
        setTimeout(() => (errorDiv.style.display = "none"), 3000);
      }
    });
  }
}

if (document.querySelector(".profile-container")) {
  renderProfile();
}
