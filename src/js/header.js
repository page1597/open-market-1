const $cartButton = document.querySelector(".user-navbar .cart button");
const $userButton = document.querySelector(".user-navbar .user button");
const currentPage = window.location.pathname;

$cartButton.addEventListener("click", () => {
  if (localStorage.getItem("token")) {
    window.location.href = "./cart.html";
  } else {
    alert("로그인 후 이용가능합니다.");
    window.location.href = "./login.html";
  }
});
if (currentPage === "/cart.html") {
  $cartButton.classList.add("active-button");
}
const onOpenDropdown = () => {
  $dropdownMenu.style.display =
    $dropdownMenu.style.display === "flex" ? "none" : "flex";

  if ($dropdownMenu.style.display === "flex") {
    $userButton.classList.add("active-button");
  } else {
    $userButton.classList.remove("active-button");
  }

  window.addEventListener("click", (event) => {
    if (
      !$userButton.contains(event.target) &&
      !$dropdownMenu.contains(event.target)
    ) {
      $dropdownMenu.style.display = "none";
    }
  });
};
if (!localStorage.getItem("token")) {
  // 없을 때 로그인
  $userButton.removeEventListener("click", onOpenDropdown);
  $userButton.addEventListener("click", () => {
    window.location.href = "/login.html";
  });
  $userButton.textContent = "로그인";
} else {
  $userButton.addEventListener("click", onOpenDropdown);
}

const $dropdownMenu = document.querySelector(".dropdown-menu");

const $logoutButton = document.querySelector("#logout");
$logoutButton.addEventListener("click", () => {
  logout();
});

const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("인증된 사용자가 아님. 토큰 없음");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/accounts/logout/`, {
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(res);
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    window.location.reload();
  } catch (e) {
    console.error("로그아웃 실패", e);
  }
};
