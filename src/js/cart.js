const baseUrl = "https://openmarket.weniv.co.kr";

// 헤더 불러오기
const addHeader = () => {
  console.log("header.html");
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
  displayCart();
});

let finalOrderProducts = [];

const displayCart = async () => {
  try {
    const cart = await fetchCart();
    console.log(cart.results);
    for (const cartProduct of cart.results) {
      const product = await fetchCartProductDetail(cartProduct.product_id);
      const $cartItem = createCartItemCard(product, cartProduct.quantity);
      document.querySelector(".cart-items-container").appendChild($cartItem);
    }
  } catch (e) {
    console.log(e);
  }
};

const fetchCartProductDetail = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/products/${id}`);
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

const createCartItemCard = (product, quantity) => {
  const $cartItem = document.createElement("article");
  $cartItem.className = "cart-item";
  const formatter = new Intl.NumberFormat("ko-KR");

  $cartItem.innerHTML = `
    <div>
      <input type="checkbox" id="select-${
        product.product_id
      }" aria-label="개별 상품 선택" />
      <label class="sr-only" for="select-${
        product.product_id
      }">개별 상품 선택</label>
    </div>
    <div class="product-detail">
      <figure>
        <img class="product-image" src="${product.image}" alt="${
    product.product_name
  }" />
        <figcaption class="sr-only">상품 설명</figcaption>
      </figure>
      <div class="product-info">
        <div>
          <p class="store-name">${product.store_name}</p>
          <p class="product-name">${product.product_name}</p>
          <p class="product-price">${product.price}원</p>
        </div>
        <p class="shipping-info">${
          product.shipping_method === "PARCEL" ? "택배배송" : "직접전달"
        } / ${
    product.shipping_fee === 0 ? "무료배송" : product.shipping_fee + "원"
  }</p>
      </div>
    </div>
    <div class="quantity-change-button">
      <button type="button" id="minus-${product.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input value="${quantity}" min="1" max="100" type="number" class="quantity-change-input" id="quantity-${
    product.product_id
  }" />
      <button type="button" id="plus-${product.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="total">
      <p class="total-price" id="total-price-${
        product.product_id
      }">${formatter.format(product.price * quantity)}원</p>
      <button class="order-button" id="order-${
        product.product_id
      }" type="button">주문하기</button>
    </div>
  `;

  const $minusButton = $cartItem.querySelector(`#minus-${product.product_id}`);
  const $plusButton = $cartItem.querySelector(`#plus-${product.product_id}`);
  const $quantityInput = $cartItem.querySelector(
    `#quantity-${product.product_id}`
  );
  const $totalPrice = $cartItem.querySelector(
    `#total-price-${product.product_id}`
  );
  const $selectCheckbox = $cartItem.querySelector(
    `#select-${product.product_id}`
  );

  const updateTotalPrice = (newQuantity) => {
    $quantityInput.value = newQuantity;
    $totalPrice.textContent = `${formatter.format(
      product.price * newQuantity
    )}원`;
  };

  const updateOrderProducts = () => {
    finalOrderProducts = finalOrderProducts.filter(
      (orderProduct) => orderProduct.id !== product.product_id
    );
    if ($selectCheckbox.checked) {
      finalOrderProducts.push({
        id: product.product_id,
        price: parseInt($totalPrice.textContent.replace(/[^0-9]/g, ""), 10),
        discountPrice: 0,
        shippingFee: product.shipping_fee,
      });
    }
    updateTotalCount();
  };

  const updateTotalCount = () => {
    const $totalCountSection = document.querySelector(".total-count");
    const $productPrice = $totalCountSection.querySelector(
      ".product-price .value em"
    );
    const $shippingFee = $totalCountSection.querySelector(
      ".shipping-fee .value em"
    );

    let finalOrderPrice = 0;
    let finalShippingFee = 0;
    finalOrderProducts.forEach((product) => {
      finalOrderPrice += product.price;
      finalShippingFee += product.shippingFee;
    });

    $productPrice.textContent = finalOrderPrice.toLocaleString();
    $shippingFee.textContent = finalShippingFee.toLocaleString();
    $totalCountSection.querySelector(".total-price .value em").textContent = (
      finalOrderPrice + finalShippingFee
    ).toLocaleString();
  };

  $minusButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      updateTotalPrice(quantity);
      updateOrderProducts();
    }
  });

  $plusButton.addEventListener("click", () => {
    quantity += 1;
    updateTotalPrice(quantity);
    updateOrderProducts();
  });

  $quantityInput.addEventListener("input", (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 100);
    quantity = value;
    updateTotalPrice(quantity);
    updateOrderProducts();
  });

  $selectCheckbox.addEventListener("input", updateOrderProducts);

  return $cartItem;
};

const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("인증된 사용자가 아님. 토큰 없음");
    // TODO: 로그인 페이지로 넘어가는 등의 처리 필요
    return null;
  }
  try {
    const res = await fetch(`${baseUrl}/cart/`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("장바구니 불러오기 오류:", error);
    return null;
  }
};
