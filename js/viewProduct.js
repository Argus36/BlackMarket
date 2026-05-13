import { getCurrentUser } from "./auth.js";

const favoriteStorage = JSON.parse(localStorage.getItem("favorites") || "[]");

export function viewProduct(id, title, imageUrl, description, price) {
  const product = document.createElement("div");
  product.className = "product";
  product.id = id;
  product.innerHTML = `
    <svg class="favorite" viewBox="0 0 32 32" enable-background="new 0 0 32 32" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M27.615,5.598c-3.206-3.208-8.404-3.211-11.612-0.006c-3.205-3.208-8.405-3.21-11.611-0.005    C1.183,8.791,1.18,13.99,4.385,17.198l11.607,11.618l11.616-11.606C30.817,14.005,30.82,8.806,27.615,5.598z"/>
    </svg>
    <img src="${imageUrl}" alt="${title}">
    <h1>${title}</h1>
    <div class="div-price">
      <p>Цена:</p>
      <p>${price} $</p></div>
    <button class="addButton">Добавить +</button>`;

  product.querySelector(".addButton").addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "./pages/Profile/profile.html";
      return;
    }

    const cartStorage = JSON.parse(localStorage.getItem("cart") || "[]");

    const indexCart = cartStorage.findIndex((item) => item.id === id);

    if (indexCart !== -1) {
      cartStorage[indexCart].result += 1;
    } else {
      cartStorage.push({
        id,
        title,
        imageUrl,
        description,
        price,
        result: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartStorage));
  });

  const favorite = product.querySelector(".favorite");

  if (favoriteStorage.includes(id)) {
    favorite.classList.add("active");
  }

  favorite.addEventListener("click", () => {
    let favoriteStorage = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favoriteStorage.includes(id)) {
      favoriteStorage = favoriteStorage.filter((favId) => favId !== id);
      favorite.classList.remove("active");
    } else {
      favoriteStorage.push(id);
      favorite.classList.add("active");
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteStorage));
  });

  return product;
}
