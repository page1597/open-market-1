console.log("header");
const cartLink = document.querySelector(".user-navbar .cart a");
const loginLink = document.querySelector(".user-navbar .login a");
const currentPage = window.location.pathname;
console.log(currentPage, cartLink);

if (currentPage === "/cart.html") {
  cartLink.classList.add("active-button");
}
if (localStorage.getItem("token")) {
  loginLink.textContent = "마이페이지";
}
