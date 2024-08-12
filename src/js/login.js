const baseUrl = "https://openmarket.weniv.co.kr";

document.addEventListener("DOMContentLoaded", () => {
  const $form = document.getElementById("login-form");
  const $buyerButton = document.getElementById("buyer");
  const $sellerButton = document.getElementById("seller");

  $form.dataset.loginType = "BUYER";
  $buyerButton.classList.add("active");

  $buyerButton.addEventListener("click", () => {
    setLoginType("BUYER");
  });
  $sellerButton.addEventListener("click", () => {
    setLoginType("SELLER");
  });

  const setLoginType = (type) => {
    $form.dataset.loginType = type;
    $buyerButton.classList.toggle("active", type === "BUYER");
    $sellerButton.classList.toggle("active", type === "SELLER");
  };

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmitForm($form);
  });
});

const onSubmitForm = (form) => {
  const $idInput = document.getElementById("id");
  const $passwordInput = document.getElementById("password");
  const $errorMessage = document.getElementById("error-message");

  const id = $idInput.value.trim();
  const password = $passwordInput.value.trim();

  if (!id || !password) {
    $errorMessage.style.display = "block";

    if (!id) {
      $errorMessage.textContent = "아이디를 입력해 주세요.";
      $idInput.focus();
    } else {
      $errorMessage.textContent = "비밀번호를 입력해 주세요.";
      $passwordInput.focus();
    }
    return;
  }

  login(id, password, form.dataset.loginType);
};

// 로그인
const login = async (id, password, loginType) => {
  const $errorMessage = document.getElementById("error-message");
  const $passwordInput = document.getElementById("password");
  try {
    const res = await fetch(`${baseUrl}/accounts/login/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: id,
        password: password,
        login_type: loginType,
      }),
    });
    const json = await res.json();
    console.log(json);

    if (res.ok) {
      $errorMessage.style.display = "none";
      // token 저장
      localStorage.setItem("token", json.token);
      alert("로그인 되었습니다.");
      window.location.href = "./";

      return true;
    } else {
      console.error("로그인 실패:", json);
      $passwordInput.focus();
      $passwordInput.value = "";
      $errorMessage.textContent = "아이디 또는 비밀번호가 일치하지 않습니다.";
      $errorMessage.style.display = "block";
      return false;
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    return false;
  }
};
// BUYER ID : buyer1 PW: hodu0910
// SELER ID : seller1 PW : hodu0910
