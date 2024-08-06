const url = "https://openmarket.weniv.co.kr/";

document.addEventListener("DOMContentLoaded", () => {
  const $productList = document.querySelector("product-list");
  console.log($productList);
  displayProducts();
});

function getGroupRange(number) {
  const groupStart = Math.floor((number - 1) / 10) * 10 + 1;
  const groupEnd = groupStart + 9;

  return [groupStart, groupEnd];
}

const createPaginationButtons = (totalPages) => {
  const $pagination = document.querySelector(".pagination ul");
  const $prevButton = document.getElementById("prev");
  const $nextButton = document.getElementById("next");
  const pageItems = Array.from($pagination.children).filter(
    (li) => !li.querySelector("button")
  );
  pageItems.forEach((item) => $pagination.removeChild(item));

  // 이전, 다음 버튼
  const currentPage = parseInt(
    new URLSearchParams(window.location.search).get("page") || 1,
    10
  );
  let startPage = getGroupRange(currentPage)[0];
  let endPage =
    totalPages < getGroupRange(currentPage)[1]
      ? totalPages
      : getGroupRange(currentPage)[1];
  console.log("startPage", startPage, "endPage", endPage);

  if (totalPages > 1) {
    const $nextButtonParent = $nextButton.parentElement;

    $nextButton.onclick = () => {
      let page = 1;
      if (currentPage + 10 <= totalPages) {
        page = currentPage + 10;
      } else {
        page =
          totalPages < getGroupRange(currentPage + 10)[1]
            ? totalPages
            : getGroupRange(currentPage + 10)[1];
      }
      window.location.href = `/?page=${page}`; // 페이지 이동}
      startPage += 10;
      endPage += 10;
    };

    if (currentPage > 10) {
      $prevButton.onclick = () => {
        window.location.href = `/?page=${currentPage - 10}`;
        startPage -= 10;
        endPage -= 10;
      };
    } else {
      $prevButton.disabled = true;
    }

    // 페이지 버튼 리스트 요소들
    for (let i = startPage; i <= endPage; i++) {
      const $li = document.createElement("li");
      const $a = document.createElement("a");
      $a.href = `/?page=${i}`;
      $a.textContent = i;
      $li.appendChild($a);

      if (currentPage === i) {
        $li.classList.add("current");
      }

      $pagination.insertBefore($li, $nextButtonParent);
    }
  }
};

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
