import { viewProduct } from "./viewProduct.js";
import { bdProducts } from "./store.js";

const favoriteStorage = JSON.parse(localStorage.getItem("favorites") || "[]");
const favoriteProducts = bdProducts.filter((p) =>
  favoriteStorage.includes(p.id),
);
const products = document.querySelector(".products");

function render() {
  products.innerHTML = "";

  favoriteProducts.forEach((element) => {
    products.appendChild(
      viewProduct(
        element.id,
        element.title,
        element.imageUrl,
        element.description,
        element.price,
      ),
    );
  });
}

render();
