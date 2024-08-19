const baseUrl = "https://openmarket.weniv.co.kr";

import checkOffIcon from "../../public/assets/icon-check-off.svg";
import checkOnIcon from "../../public/assets/icon-check-on.svg";

document.addEventListener("DOMContentLoaded", () => {
  const $form = document.getElementById("signup-form");
  $form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });
  });
  const $buyerButton = document.getElementById("buyer");
  const $sellerButton = document.getElementById("seller");

  $form.dataset.signupType = "BUYER";
  $buyerButton.classList.add("active");

  $buyerButton.addEventListener("click", () => {
    setSignupType("BUYER");
  });
  $sellerButton.addEventListener("click", () => {
    setSignupType("SELLER");
  });

  const setSignupType = (type) => {
    $form.dataset.signupType = type;
    $buyerButton.classList.toggle("active", type === "BUYER");
    $sellerButton.classList.toggle("active", type === "SELLER");
  };

  const $idInput = document.getElementById("id");
  const $doubleCheckButton = document.getElementById("double-check");
  const $idMessage = document.getElementById("id-message");

  // 아이디 중복 체크
  $doubleCheckButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await checkDuplicateId($idInput.value);
    const responseType = Object.keys(response)[0];

    if (responseType === "FAIL_Message") {
      $idMessage.classList.add("error");
      $idInput.classList.add("error");
      $idInput.classList.remove("active");

      $idMessage.textContent = response.FAIL_Message;
    } else {
      // Success
      $idMessage.classList.remove("error");
      $idInput.classList.remove("error");
      $idInput.classList.add("active");

      $idMessage.textContent = response.Success;
    }
  });
  $idInput.addEventListener("click", () => {
    $idInput.classList.remove("error");
    $idMessage.classList.remove("error");
    $idMessage.textContent = "";
  });

  const $passwordInput = document.getElementById("password");
  $passwordInput.addEventListener("keyup", () => {
    if (validatePassword($passwordInput.value)) {
      $passwordInput.style.backgroundImage = `url(${checkOnIcon})`;
    } else {
      $passwordInput.style.backgroundImage = `url(${checkOffIcon})`;
    }
  });

  const $checkPasswordInput = document.getElementById("check-password");

  const $passwordErrorMessage = document.getElementById(
    "password-error-message"
  );
  $checkPasswordInput.addEventListener("keyup", () => {
    if (checkSamePassword()) {
      $passwordErrorMessage.style.display = "none";
    } else {
      $passwordErrorMessage.style.display = "block";
    }
  });

  // 휴대폰 번호
  const $phoneNumberInput1 = document.getElementById("phone-1"); // select
  const $phoneNumberInput2 = document.getElementById("phone-2");
  const $phoneNumberInput3 = document.getElementById("phone-3");
  // 전화번호 인풋 길이 제한
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
      }
    });
  });

  const $nameInput = document.getElementById("name");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    // 구매자 사용자 정보
    const buyerUserInfo = {
      username: $idInput.value,
      password: $passwordInput.value,
      password2: $passwordInput.value,
      phone_number:
        $phoneNumberInput1.value +
        $phoneNumberInput2.value +
        $phoneNumberInput3.value,
      name: $nameInput.value,
    };

    onSignup(buyerUserInfo);

    // TODO: 판매회원가입 구현
  });
});

// 가입하기 버튼 눌렀을 때
const onSignup = async (userInfo) => {
  console.log(JSON.stringify(userInfo));
  try {
    const res = await fetch(`${baseUrl}/accounts/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });
    if (res.ok) {
      const json = await res.json();
      console.log(json);
      alert("회원가입이 완료되었습니다.");
      // 로그인 페이지로 이동
      window.location.href = "./login.html";
      return true;
    } else {
      const errorJson = await res.json();
      console.log(errorJson);
      alert(errorJson);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 비밀번호와 비밀번호 확인 인풋의 입력값이 같은지 확인
const checkSamePassword = () => {
  const $passwordInput = document.getElementById("password");
  const $checkPasswordInput = document.getElementById("check-password");
  console.log($passwordInput.value, $checkPasswordInput.value);
  if ($passwordInput.value === $checkPasswordInput.value) {
    return true;
  } else {
    return false;
  }
};

// 유효한 비밀번호인지 확인
// 8자 이상 && 한 개 이상의 영소문자 && 한 개 이상의 숫자
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(password)) {
    return false;
  }
  return true;
};

// 아이디 중복 체크 후 응답 메시지 리턴
const checkDuplicateId = async (id) => {
  console.log(id);
  try {
    const res = await fetch(`${baseUrl}/accounts/signup/valid/username/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: id,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      console.log(json);
      return json;
    } else {
      const errorJson = await res.json();
      console.log(errorJson);
      return errorJson;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
