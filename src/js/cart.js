console.log("장바구니");
const baseUrl = "https://openmarket.weniv.co.kr";
let finalOrderProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  displayCart();
});

// "전체 선택" 체크박스 기능
const attachSelectAllEventListener = (product) => {
  console.log("attach select all ");
  const $selectAllCheckbox = document.querySelector("#select-all");
  $selectAllCheckbox.addEventListener("click", () => {
    const isChecked = $selectAllCheckbox.checked;
    const $allCheckboxes = document.querySelectorAll(
      'input[type="checkbox"]:not(#select-all)'
    );
    $allCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
      if (product) {
        updateOrderProducts(product, isChecked);
      }
    });
    updateTotalCount();
  });
};

// 장바구니 화면에 그리기
const displayCart = async () => {
  try {
    const cart = await fetchCart();
    console.log(cart);
    if (!cart) return;

    const $container = document.querySelector(".cart-items-container");
    for (const cartProduct of cart.results) {
      const product = await fetchCartProductDetail(cartProduct.product_id);
      if (product) {
        //  전체선택 부분 구현
        attachSelectAllEventListener(product);

        const $cartItem = createCartItemCard(
          product,
          cartProduct.quantity,
          cartProduct.cart_item_id
        );
        $container.appendChild($cartItem);
      }
    }
  } catch (e) {
    console.error("장바구니 그리기 오류:", e);
  }
};

// 장바구니 아이템 카드 생성
const createCartItemCard = (product, quantity, cartItemId) => {
  const $cartItem = document.createElement("article");
  $cartItem.className = "cart-item";
  const formatter = new Intl.NumberFormat("ko-KR");

  $cartItem.innerHTML = `
    <div>
      <button type="button" class="remove" id="remove-${
        product.product_id
      }"></button>
      <div class="checkbox-container">
        <input type="checkbox" id="select-${
          product.product_id
        }" aria-label="개별 상품 선택"/>
        <label for="select-${
          product.product_id
        }"><span class="sr-only">개별 상품 선택</span></label>
      </div>
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
      <input disabled value="${quantity}" min="1" max="100" type="number" class="quantity-change-input" id="quantity-${
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
  attachEventListeners($cartItem, product, quantity, cartItemId);

  return $cartItem;
};

// 버튼, 인풋 등 동작 추가
const attachEventListeners = ($cartItem, product, quantity, cartItemId) => {
  const $removeButton = $cartItem.querySelector(
    `#remove-${product.product_id}`
  );
  const $minusButton = $cartItem.querySelector(`#minus-${product.product_id}`);
  const $plusButton = $cartItem.querySelector(`#plus-${product.product_id}`);
  const $selectCheckbox = $cartItem.querySelector(
    `#select-${product.product_id}`
  );

  // const $quantityInput = $cartItem.querySelector(
  //   `#quantity-${product.product_id}`
  // );
  // const $totalPrice = $cartItem.querySelector(
  //   `#total-price-${product.product_id}`
  // );

  $removeButton.addEventListener("click", () => {
    removeProductFromCart(cartItemId);
  });
  $minusButton.addEventListener("click", () => {
    createQuantityChangeModal(product, cartItemId);
  });
  $plusButton.addEventListener("click", () => {
    createQuantityChangeModal(product, cartItemId);
  });
  $selectCheckbox.addEventListener("input", () =>
    updateOrderProducts(product, $selectCheckbox.checked)
  );
};

// 선택 상품 체크
const updateOrderProducts = (product, isSelected) => {
  console.log(product);
  const quantity = parseInt(
    document.querySelector(`#quantity-${product.product_id}`).value,
    10
  );
  finalOrderProducts = finalOrderProducts.filter(
    (orderProduct) => orderProduct.id !== product.product_id
  );
  if (isSelected) {
    finalOrderProducts.push({
      id: product.product_id,
      price: product.price * quantity,
      discountPrice: 0,
      shippingFee: product.shipping_fee,
    });
  }
  console.log(finalOrderProducts);
  updateTotalCount();
};

// 총 금액 업데이트
const updateTotalCount = () => {
  const $totalCountSection = document.querySelector(".total-count");
  const $productPrice = $totalCountSection.querySelector(
    ".product-price .value em"
  );
  const $shippingFee = $totalCountSection.querySelector(
    ".shipping-fee .value em"
  );
  const { finalOrderPrice, finalShippingFee } = finalOrderProducts.reduce(
    (acc, product) => {
      acc.finalOrderPrice += product.price;
      acc.finalShippingFee += product.shippingFee;
      return acc;
    },
    { finalOrderPrice: 0, finalShippingFee: 0 }
  );

  $productPrice.textContent = finalOrderPrice.toLocaleString();
  $shippingFee.textContent = finalShippingFee.toLocaleString();
  $totalCountSection.querySelector(".total-price .value em").textContent = (
    finalOrderPrice + finalShippingFee
  ).toLocaleString();
};

// 모달을 만드는 함수
const createModal = (className, content) => {
  const $modal = document.createElement("article");
  $modal.className = className;
  $modal.innerHTML = content;
  document.body.appendChild($modal);
  return $modal;
};

// 수량 변경 모달
const createQuantityChangeModal = (product, cartItemId) => {
  // 모달 생성
  let quantity = parseInt(
    document.querySelector(`#quantity-${product.product_id}`).value,
    10
  );
  const formatter = new Intl.NumberFormat("ko-KR");

  const modalContent = `
  <div class="modal-content">
    <div class="quantity-change-button">
      <button type="button" id="modal-minus-${product.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input value="${quantity}" min="1" max="100" type="number" class="quantity-change-input" id="modal-quantity-${product.product_id}" />
      <button type="button" id="modal-plus-${product.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="modal-button-container">
      <button id="cancel" class="modal-button">취소</button>
      <button id="confirm" class="modal-button">수정</button>
    </div>
  </div>
`;
  const $modal = createModal("quantity-change-modal", modalContent);

  const $modalQuantityInput = $modal.querySelector(
    `#modal-quantity-${product.product_id}`
  );
  const $modalMinusButton = $modal.querySelector(
    `#modal-minus-${product.product_id}`
  );
  const $modalPlusButton = $modal.querySelector(
    `#modal-plus-${product.product_id}`
  );

  // 버튼 disabled 설정
  const updateButtonState = () => {
    $modalMinusButton.disabled = quantity <= 1;
    $modalPlusButton.disabled = quantity >= product.stock;
  };

  updateButtonState();

  $modalMinusButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      $modalQuantityInput.value = quantity;
    }
    updateButtonState();
  });

  $modalPlusButton.addEventListener("click", () => {
    quantity++;
    $modalQuantityInput.value = quantity;
    updateButtonState();
  });

  $modalQuantityInput.addEventListener("input", (e) => {
    quantity = Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 100);
    $modalQuantityInput.value = quantity;
    updateButtonState();
  });

  return new Promise((resolve) => {
    $modal.querySelector("#confirm").addEventListener("click", async () => {
      $modal.remove(); // 모달창 제거
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("인증된 사용자가 아님. 토큰 없음");
        return null;
      }

      try {
        const res = await fetch(`${baseUrl}/cart/${cartItemId}/`, {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            product_id: product.product_id,
            quantity: quantity,
            is_active: true,
          }),
        });
        console.log(product.product_id, quantity, token);
        if (res.ok) {
          alert("수정되었습니다.");
          updateProductDisplay(product, quantity);
          resolve(true);
        } else {
          alert("수정 실패. 다시 시도해주세요.");
          resolve(false);
        }
      } catch (error) {
        console.error(error);
        resolve(false);
      }
    });

    $modal.querySelector("#cancel").addEventListener("click", () => {
      $modal.remove(); // 모달창 제거
      resolve(false);
    });
  });
};

const removeProductFromCart = async (cartItemId) => {
  const modalContent = `
    <div class="modal-content">
      <p>상품을 삭제하시겠습니까?</p>
      <div class="modal-button-container">
        <button id="cancel" class="modal-button">취소</button>
        <button id="confirm" class="modal-button">확인</button>
      </div>
    </div>
  `;
  const $modal = createModal("remove-confirm-modal", modalContent);

  return new Promise((resolve) => {
    $modal.querySelector("#confirm").addEventListener("click", async () => {
      $modal.remove(); // 모달창 제거
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("인증된 사용자가 아님. 토큰 없음");
        return null;
      }
      try {
        const res = await fetch(`${baseUrl}/cart/${cartItemId}`, {
          headers: { Authorization: `JWT ${token}` },
          method: "DELETE",
        });
        console.log(res);
        if (res.ok) {
          alert("삭제되었습니다.");
          window.location.reload();
          resolve(true);
        } else {
          alert("삭제 실패. 다시 시도해주세요.");
          resolve(false);
        }
        resolve(true);
      } catch (error) {
        console.error(error);
        resolve(false); // 삭제 실패 시 false 반환
      }
    });

    $modal.querySelector("#cancel").addEventListener("click", () => {
      $modal.remove(); // 모달창 제거
      resolve(false);
    });
  });
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
    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.error("장바구니 불러오기 오류:", error);
    return null;
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

// 수량 변경 후 화면 업데이트
const updateProductDisplay = (product, quantity) => {
  const formatter = new Intl.NumberFormat("ko-KR");
  const isSelected = document.querySelector(
    `#select-${product.product_id}`
  ).checked;
  document.querySelector(`#quantity-${product.product_id}`).value = quantity;
  updateOrderProducts(product, isSelected);
  const $totalPrice = document.querySelector(
    `#total-price-${product.product_id}`
  );
  $totalPrice.textContent = `${formatter.format(product.price * quantity)}원`;
};
