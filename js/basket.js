import { getCurrentUser } from "./auth.js";

const cartStorage = JSON.parse(localStorage.getItem("cart") || "[]");

const products = document.querySelector(".carts");

const sum = document.querySelector(".sum");

function sumPrice() {
  let allPrice = 0;
  for (const item of cartStorage) {
    allPrice += item.price * item.result;
  }

  allPrice = Math.round(allPrice * 100) / 100;
  sum.innerHTML = `${allPrice} $`;
}

function createCart(id, title, imageUrl, description, price, result) {
  const cart = document.createElement("div");
  cart.className = "cart";
  cart.id = id;
  cart.innerHTML = `
    <img src="${imageUrl}" alt="${title}"">
    <h1>${title}</h1>
    <p>${result}</p>
    <div class="div-price">
      <p>Цена:</p>
      <p>${price} $</p>
    </div>
    <img class="close" src="../../Img/close.png" alt="${close}"">`;

  cart.querySelector(".close").addEventListener("click", () => {
    const index = cartStorage.findIndex((item) => item.id === id);
    if (index !== -1) {
      cartStorage.splice(index, 1);
      cart.remove();

      localStorage.setItem("cart", JSON.stringify(cartStorage));
      sumPrice();
    }
  });

  return cart;
}

cartStorage.forEach((element) => {
  products.appendChild(
    createCart(
      element.id,
      element.title,
      element.imageUrl,
      element.description,
      element.price,
      element.result,
    ),
  );
});

sumPrice();

const checkoutBtn = document.querySelector(".place-order");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const { checkout, getCurrentUser } = await import("./auth.js");
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "../../pages/Profile/profile.html";
      return;
    }
    if (checkout()) {
      alert("Заказ оформлен!");
      location.reload();
    } else {
      alert("Корзина пуста");
    }
  });
}
