const products = [
  { name: "Dior Lip Glow", image: "https://via.placeholder.com/150", price: "$38" },
  { name: "Rare Beauty Blush", image: "https://via.placeholder.com/150", price: "$23" },
  { name: "Fenty Gloss Bomb", image: "https://via.placeholder.com/150", price: "$19" }
];

const list = document.getElementById("product-list");

function displayProducts(items) {
  list.innerHTML = "";
  items.forEach(product => {
    list.innerHTML += `
      <div class="card">
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
      </div>
    `;
  });
}

displayProducts(products);

document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(value));
  displayProducts(filtered);
});
