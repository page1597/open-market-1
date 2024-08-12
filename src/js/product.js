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

const displayProduct = async () => {
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
  createQuantityControl(product.stock, product.price);

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

// 장바구니 추가
const addToCart = async (product) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("인증된 사용자가 아님. 토큰 없음");
    alert("로그인 후 이용가능합니다.");
    window.location.href = "./login.html";
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
      alert("장바구니에 추가되었습니다.");
      if (confirm("장바구니로 이동하시겠습니까?")) {
        window.location.href = "./cart.html";
      }
      return json;
    } else {
      const errorJson = await res.json();
      console.error("장바구니 넣기 실패:", errorJson);
      alert(errorJson.FAIL_message);
      return null;
    }
  } catch (error) {
    console.error("장바구니 넣기 오류:", error);
    alert("장바구니에 추가하지 못했습니다. 관리자에게 문의하세요.");

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

const updateQuantityDisplay = () => {
  const $input = document.querySelector(".quantity-change-input");
  $input.value = quantity;

  const formatter = new Intl.NumberFormat("ko-KR");
  document.querySelector(".total-quantity em").textContent = quantity;
  document.querySelector(".total-price em").textContent = formatter.format(
    product.price * quantity
  );
};

const createQuantityControl = (productStock, productPrice) => {
  const $input = document.querySelector(".quantity-change-input");
  const $minusButton = document.querySelector("#minus");
  const $plusButton = document.querySelector("#plus");
  const $totalQuantity = document.querySelector(".total-quantity em");
  const $totalPrice = document.querySelector(".total-price em");
  let quantity = 1;

  const formatter = new Intl.NumberFormat("ko-KR");

  const updateQuantityDisplay = () => {
    $input.value = quantity;
    $totalQuantity.textContent = quantity;
    $totalPrice.textContent = formatter.format(productPrice * quantity);
    $minusButton.disabled = quantity <= 1;
    $plusButton.disabled = quantity >= productStock;
  };

  $input.addEventListener("input", (e) => {
    let newValue = parseInt(e.target.value, 10) || 1;
    if (e.target.value.startsWith("0")) {
      newValue = parseInt(e.target.value, 10);
    }
    if (newValue > productStock) {
      alert("상품 재고를 초과하였습니다.");
      newValue = productStock;
    }
    quantity = newValue;
    updateQuantityDisplay();
  });
  $minusButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      updateQuantityDisplay();
    }
  });

  $plusButton.addEventListener("click", () => {
    if (quantity < productStock) {
      quantity++;
      updateQuantityDisplay();
    }
  });
  updateQuantityDisplay();
};
