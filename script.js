// --- Initialize LocalStorage users ---
if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));

// --- Products array (declare only once) ---
const products = [
  { name: "Dior Lip Glow", category: "Lipstick", brand: "Dior", price: "$38", image: "https://via.placeholder.com/150", desc:"Hydrating lip color" },
  { name: "Rare Beauty Blush", category: "Blush", brand: "Rare Beauty", price: "$23", image: "https://via.placeholder.com/150", desc:"Soft matte blush" },
  { name: "Fenty Gloss Bomb", category: "Lipstick", brand: "Fenty", price: "$19", image: "https://via.placeholder.com/150", desc:"High shine lip gloss" },
  { name: "Huda Eyeshadow Palette", category: "Eyeshadow", brand: "Huda", price: "$65", image: "https://via.placeholder.com/150", desc:"Vibrant eyeshadow palette" }
];

// --- Subcategories ---
const subcategories = {
  "Lipstick": ["Lip Gloss", "Lip Oil", "Matte Lipstick"],
  "Eyeshadow": ["Palette", "Single Shadow", "Cream Shadow"],
  "Blush": ["Powder", "Cream", "Tint"],
  "Foundation": ["Liquid", "Stick", "Powder"]
};

// --- Current filters ---
let currentCategory = "All";
let currentBrand = "All";

// --- DOM Elements ---
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

// --- Display products ---
function displayProducts(items){
  if(!productList) return;
  productList.innerHTML = "";
  items.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.brand} | ${p.category}</p>
      <p>${p.price}</p>
      <button onclick="addFavorite('${p.name}')">Add to Favorites</button>
      <button onclick="openProductModal('${p.name}')">View</button>
    `;
    productList.appendChild(card);
  });
}

// --- Apply all filters together ---
function applyFilters(){
  let filtered = products;

  if(currentCategory !== "All") filtered = filtered.filter(p=>p.category===currentCategory);
  if(currentBrand !== "All") filtered = filtered.filter(p=>p.brand===currentBrand);

  const min = parseFloat(minPriceInput?.value) || 0;
  const max = parseFloat(maxPriceInput?.value) || 10000;
  filtered = filtered.filter(p => {
    const price = Number(p.price.toString().replace('$','')) || 0;
    return price >= min && price <= max;
  });

  const searchVal = searchInput?.value.toLowerCase() || "";
  if(searchVal) filtered = filtered.filter(p=>p.name.toLowerCase().includes(searchVal));

  displayProducts(filtered);
}

// --- Filter functions ---
function filterCategory(cat){ currentCategory = cat; applyFilters(); }
function filterBrand(brand){ currentBrand = brand; applyFilters(); }
function filterPrice(){ applyFilters(); }
searchInput?.addEventListener("input", applyFilters);

// --- Dropdown toggle ---
function toggleDropdown(){
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display==="block"?"none":"block";
}

// --- Product Modal ---
function openProductModal(name){
  const modal = document.getElementById("modal");
  if(!modal) return;
  const product = products.find(p=>p.name===name);
  if(!product) return;

  modal.style.display = "flex";
  document.getElementById("modal-img").src = product.image;
  document.getElementById("modal-name").innerText = product.name;
  document.getElementById("modal-brand").innerText = product.brand;
  document.getElementById("modal-category").innerText = product.category;
  document.getElementById("modal-price").innerText = product.price;
  document.getElementById("modal-desc").innerText = product.desc;
  document.getElementById("modal-fav").onclick = () => addFavorite(product.name);
}
function closeProductModal(){ document.getElementById("modal").style.display = "none"; }

// --- Category Modal ---
function openCategoryModal(cat){
  const modal = document.getElementById("categoryModal");
  const modalName = document.getElementById("modal-category-name");
  const modalSub = document.getElementById("modal-subcategories");
  const modalPreview = document.getElementById("modal-product-preview");

  modalName.innerText = cat;

  // Subcategories
  modalSub.innerHTML = "";
  if(subcategories[cat]?.length){
    subcategories[cat].forEach(sub=>{
      const btn = document.createElement("button");
      btn.className = "subcat-btn";
      btn.innerText = sub;
      btn.onclick = () => goToSubcategory(cat, sub);
      modalSub.appendChild(btn);
    });
  } else modalSub.innerHTML = "<p>No subcategories found</p>";

  // Preview products
  modalPreview.innerHTML = "";
  const categoryProducts = products.filter(p=>p.category===cat);
  categoryProducts.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.brand}</p>
      <p>${p.price}</p>
      <button onclick="addFavorite('${p.name}')">Add to Favorites</button>
    `;
    modalPreview.appendChild(card);
  });

  modal.style.display = "block";
}
function goToSubcategory(cat, sub){
  localStorage.setItem("selectedSubcategory", JSON.stringify({category: cat, subcategory: sub}));
  window.location.href = "subcategory.html";
}
function closeCategoryModal(){ document.getElementById("categoryModal").style.display = "none"; }

// --- Click outside modal closes ---
window.onclick = function(e){
  if(e.target.id==="modal") closeProductModal();
  if(e.target.id==="categoryModal") closeCategoryModal();
}

// --- Favorites ---
function addFavorite(name){
  let user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user){ alert("Login first"); return; }
  if(!user.favorites) user.favorites=[];
  if(!user.favorites.includes(name)) user.favorites.push(name);

  localStorage.setItem("currentUser", JSON.stringify(user));

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(u => u.email===user.email ? user : u);
  localStorage.setItem("users", JSON.stringify(users));

  alert(name+" added to favorites!");
}

// --- Signup/Login/Profile ---
function signup(){
  const email = document.getElementById("signupEmail")?.value.trim();
  const pass = document.getElementById("signupPass")?.value.trim();
  if(!email || !pass){ alert("Enter email and password"); return; }
  let users = JSON.parse(localStorage.getItem("users"));
  if(users.find(u=>u.email===email)){ alert("User exists!"); return; }
  users.push({email, pass, favorites: []});
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created!"); window.location.href="login.html";
}

function login(){
  const email = document.getElementById("loginEmail")?.value.trim();
  const pass = document.getElementById("loginPass")?.value.trim();
  if(!email || !pass){ alert("Enter email and password"); return; }
  let users = JSON.parse(localStorage.getItem("users"));
  const user = users.find(u=>u.email===email && u.pass===pass);
  if(!user){ alert("Invalid credentials"); return; }
  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href="profile.html";
}

function checkLogin(){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if(!user){ window.location.href="login.html"; return; }
  document.getElementById("welcome").innerText = "Welcome, "+user.email;
  const favs = user.favorites || [];
  document.getElementById("fav-list").innerHTML = favs.map(f=>`<li>${f}</li>`).join("");
}

function logout(){
  localStorage.removeItem("currentUser");
  window.location.href="login.html";
}

// --- Initialize product list ---
displayProducts(products);
