import { bdProducts } from "./store.js";
import { viewProduct } from "./viewProduct.js";

const filters = [
  "Всё",
  "Каннабис",
  "Стимуляторы",
  "Опиоиды",
  "Психоделики",
  "Синтетические наркотики",
];

export let filter = parseInt(localStorage.getItem("selectedFilter") || "0");
const products = document.querySelector(".products");

function render() {
  products.innerHTML = "";

  bdProducts.forEach((element) => {
    if (!filter || element.categories === filter) {
      products.appendChild(
        viewProduct(
          element.id,
          element.title,
          element.imageUrl,
          element.description,
          element.price,
        ),
      );
    }
  });
}

document.querySelectorAll(".filter-button").forEach((sort, index) => {
  sort.addEventListener("click", (element) => {
    document
      .querySelectorAll(".filter-button")
      .forEach((b) => b.classList.remove("active"));

    sort.classList.add("active");
    filter = filters.indexOf(sort.textContent);

    localStorage.setItem("selectedFilter", filter);

    render();
  });

  if (index === filter) {
    sort.classList.add("active");
  }
});

render();
