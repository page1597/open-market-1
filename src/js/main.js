const url = "https://openmarket.weniv.co.kr/";

document.addEventListener("DOMContentLoaded", () => {
  const $productList = document.querySelector("product-list");
  console.log($productList);
});
// 상품 불러오기
const fetchProducts = async () => {
  try {
    const res = await fetch(`${url}/products/`);
    if (res.ok) {
      const json = await res.json();
      return json.results;
    } else {
      return null;
    }
  } catch (error) {
    console.error("상품 불러오기 오류:", error);
    return null;
  }
};

fetchProducts();

const initProducts = async function () {
  try {
    const productList = await fetchProducts();
    console.log(productList);
    productList.forEach((product) => {
      createProductCard(product);
    });
  } catch (e) {
    console.log(e);
  }
};

initProducts();

const createProductCard = (product) => {
  const $productList = document.querySelector(".product-list ol");
  const $li = document.createElement("li");
  $li.id = product.product_id;

  const $productLink = document.createElement("a");
  $productLink.href = `/${product.product_id}`;

  const $img = document.createElement("img");
  $img.src = product.image;
  $img.alt = product.product_name;
  //   $img.width = 380;
  //   $img.height = 380;

  $productLink.appendChild($img);

  const $storeName = document.createElement("p");
  const $productName = document.createElement("a");
  $productName.href = `/${product.product_id}`;
  const $productPrice = document.createElement("p");

  $storeName.classList.add("store-name");
  $productName.classList.add("product-name");
  $productPrice.classList.add("product-price");

  $storeName.textContent = product.store_name;
  $productName.textContent = product.product_name;
  $productPrice.textContent = product.price;

  $li.appendChild($productLink);
  $li.appendChild($storeName);
  $li.appendChild($productName);
  $li.appendChild($productPrice);

  $productList.appendChild($li);
};
