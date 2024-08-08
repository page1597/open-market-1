const baseUrl = "https://openmarket.weniv.co.kr";

let quantity = 1;
let product = {};

// 헤더 불러오기
const addHeader = () => {
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("header").outerHTML = data;

      const script = document.createElement("script");
      script.src = "/src/js/header.js";
      document.body.appendChild(script);
    });
};

const addFooter = () => {
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("footer").outerHTML = data;
    });
};

document.addEventListener("DOMContentLoaded", () => {
  addHeader();
  addFooter();
  displayProduct();
});

const displayProduct = async function () {
  try {
    product = await fetchProduct();
    console.log(product);
    createProductDetailCard(product);
    createButtons(product);
  } catch (e) {
    console.log(e);
  }
};

// 상품 정보 불러오기
const fetchProduct = async () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const productId = params.get("id");

  try {
    const res = await fetch(`${baseUrl}/products/${productId}/`);
    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.error("상품 불러오기 오류:", error);
    return null;
  }
};

const createProductDetailCard = (product) => {
  createQuantityInput();
  createQuantityButton(quantity);

  document.querySelector("h2").textContent = product.product_name;
  document.querySelector("figcaption").textContent = product.product_name;

  const $img = document.querySelector(".product-image");
  $img.src = product.image;
  $img.alt = product.product_name;

  const formatter = new Intl.NumberFormat("ko-KR");

  document.querySelector(".store-name").textContent = product.store_name;
  document.querySelector(".product-name").textContent = product.product_name;
  document.querySelector(".product-price em").textContent = formatter.format(
    product.price
  );
  document.querySelector(".total-quantity em").textContent = quantity;
  document.querySelector(".total-price em").textContent = formatter.format(
    product.price * quantity
  );
  document.createElement("span").textContent = product.product_name;
};

const addToCart = async (product) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("인증된 사용자가 아님. 토큰 없음");
    return;
  }
  try {
    const res = await fetch(`${baseUrl}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        product_id: product.product_id,
        quantity: quantity,
        check: true,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      console.log(json);
      return json;
    } else {
      const errorJson = await res.json();
      console.error("장바구니 넣기 실패:", errorJson);
      return null;
    }
  } catch (error) {
    console.error("장바구니 넣기 오류:", error);
    return null;
  }
};

const createButtons = (product) => {
  // 장바구니 추가 버튼
  const $addToCartButton = document.querySelector("#add-to-cart");
  $addToCartButton.addEventListener("click", async () => {
    addToCart(product);
    // TODO: 완료 모달창 등 띄우기
  });

  // TODO: 구매하기 버튼 구현
};

const createQuantityInput = () => {
  const $input = document.querySelector(".quantity-change-input");

  $input.addEventListener("input", (e) => {
    let value = e.target.value;

    if (value.length > 2) {
      e.target.value = value.slice(0, 2);
    }
    if (e.target.value.startsWith("0")) {
      e.target.value = parseInt(e.target.value, 10);
    }
    quantity = parseInt(e.target.value, 10) || 1;
    updateQuantityDisplay();
  });
};
const createQuantityButton = () => {
  const $minusButton = document.querySelector("#minus");
  const $plusButton = document.querySelector("#plus");

  $minusButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      updateQuantityDisplay();
    }
  });

  $plusButton.addEventListener("click", () => {
    quantity += 1;
    updateQuantityDisplay();
  });
};
const updateQuantityDisplay = () => {
  const $input = document.querySelector(".quantity-change-input");
  $input.value = quantity;

  const formatter = new Intl.NumberFormat("ko-KR");
  document.querySelector(".total-quantity em").textContent = quantity;
  document.querySelector(".total-price em").textContent = formatter.format(
    product.price * quantity
  );
};
