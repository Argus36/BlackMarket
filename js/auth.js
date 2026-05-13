function generateApiKey() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 64; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return re.test(email);
}

function isValidUsername(username) {
  return username && username.length >= 4 && /^[a-zA-Z0-9_]+$/.test(username);
}

export function register(username, email) {
  if (!isValidUsername(username)) {
    return {
      success: false,
      error: "Имя должно быть минимум 4 символа (буквы, цифры, _)",
    };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "Введите корректный email" };
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email уже зарегистрирован" };
  }
  if (users.find((u) => u.username === username)) {
    return { success: false, error: "Имя пользователя занято" };
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    apiKey: generateApiKey(),
    orders: [],
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  return { success: true, user: newUser };
}

export function loginWithApiKey(apiKey) {
  if (!apiKey || apiKey.length !== 64) {
    return { success: false, error: "Неверный формат ключа" };
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.apiKey === apiKey);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: "Неверный ключ" };
}

export function loginWithEmail(email) {
  if (!isValidEmail(email)) {
    return { success: false, error: "Введите корректный email" };
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: "Пользователь не найден" };
}

export function logout() {
  localStorage.removeItem("currentUser");
}

export function addOrder(cart) {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((u) => u.id === currentUser.id);

  if (userIndex !== -1) {
    const total = cart.reduce((sum, item) => sum + item.price * item.result, 0);
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total: total,
    };

    users[userIndex].orders.unshift(order);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
    return true;
  }
  return false;
}

export function checkout() {
  const user = getCurrentUser();
  if (!user) return false;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) return false;

  addOrder(cart);
  localStorage.setItem("cart", "[]");
  return true;
}
