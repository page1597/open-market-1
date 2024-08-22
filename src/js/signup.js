const baseUrl = "https://openmarket.weniv.co.kr";

import checkOffIcon from "../../public/assets/icon-check-off.svg";
import checkOnIcon from "../../public/assets/icon-check-on.svg";

document.addEventListener("DOMContentLoaded", () => {
  const $form = document.getElementById("signup-form");

  // 폼 초기화
  initializeForm($form);

  const $buyerButton = document.getElementById("buyer");
  const $sellerButton = document.getElementById("seller");

  $buyerButton.addEventListener("click", () => {
    setSignupType("BUYER");
  });
  $sellerButton.addEventListener("click", () => {
    setSignupType("SELLER");
  });

  const setSignupType = (type) => {
    console.log("Signup type:", type); // 로그 추가
    $form.dataset.signupType = type;
    $buyerButton.classList.toggle("active", type === "BUYER");
    $sellerButton.classList.toggle("active", type === "SELLER");

    const $sellerInputContainer = document.querySelector(
      ".seller-input-container"
    );

    if (type === "BUYER") {
      $sellerInputContainer.style.display = "none";
    } else {
      $sellerInputContainer.style.display = "flex";
    }
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
      $form.dataset.validatePassword = true;
    } else {
      $passwordInput.style.backgroundImage = `url(${checkOffIcon})`;
      $form.dataset.validatePassword = false;
    }
  });

  const $checkPasswordInput = document.getElementById("check-password");

  const $passwordErrorMessage = document.getElementById(
    "password-error-message"
  );
  $checkPasswordInput.addEventListener("keyup", () => {
    if (checkSamePassword()) {
      $passwordErrorMessage.style.display = "none";
      $form.dataset.validatePassword = false;
    } else {
      $passwordErrorMessage.style.display = "block";
      $form.dataset.validatePassword = true;
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

  // 사업자 등록번호: 10자리로 이루어진 숫자
  const $registrationNumberInput = document.getElementById(
    "registration-number"
  );

  if ($form.dataset.signupType === "SELLER") {
    const $certificationCheckButton = document.getElementById(
      "certification-check"
    );

    $certificationCheckButton.addEventListener("click", (e) => {
      const $form = document.getElementById("signup-form");

      e.preventDefault();
      if (!$registrationNumberInput.value) {
        alert("사업자 등록번호를 입력해주세요.");
        $form.dataset.validateCertificationNumber = false;
        return;
      }
      // 인증 유효성 검사
      if (!validateCertificationNumber($registrationNumberInput.value)) {
        alert("유효한 사업자 등록번호가 아닙니다.");
        $form.dataset.validateCertificationNumber = false;

        return;
      }
      $form.dataset.validateCertificationNumber = true;
      alert("인증되었습니다.");
    });
  }

  const $storeNameInput = document.getElementById("store-name");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    // 구매자 사용자 정보
    let userInfo = {};
    if ($form.dataset.signupType === "BUYER") {
      userInfo = {
        username: $idInput.value,
        password: $passwordInput.value,
        password2: $passwordInput.value,
        phone_number:
          $phoneNumberInput1.value +
          $phoneNumberInput2.value +
          $phoneNumberInput3.value,
        name: $nameInput.value,
      };
    } else {
      userInfo = {
        username: $idInput.value,
        password: $passwordInput.value,
        password2: $passwordInput.value,
        phone_number:
          $phoneNumberInput1.value +
          $phoneNumberInput2.value +
          $phoneNumberInput3.value,
        name: $nameInput.value,
        company_registration_number: $registrationNumberInput.value,
        store_name: $storeNameInput.value,
      };
    }

    const $agreeCheckbox = document.getElementById("agree-to-terms");

    if (!$agreeCheckbox.checked) {
      alert("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    onSignup(userInfo);

    // TODO: 판매회원가입 구현
  });
});

// 비어있는 폼 인풋 이름(레이블 이름) 반환
const getBlankInputLabelName = () => {
  const $form = document.getElementById("signup-form");
  const inputs = $form.querySelectorAll("input");

  for (let input of inputs) {
    if (input.type !== "checkbox" && input.value.trim() === "") {
      let currentElement = input;

      // 상위 요소 중에 display: none이 있는지 확인
      while (currentElement) {
        const style = window.getComputedStyle(currentElement);
        if (style.display === "none") {
          break; // display: none인 요소를 발견하면 루프 종료 (이 input은 제외)
        }
        currentElement = currentElement.parentElement;
      }

      // currentElement가 null이 되면, display: none인 부모가 없다는 의미
      if (!currentElement) {
        const label = document.querySelector(`label[for="${input.name}"]`);
        if (label) {
          return label.textContent.trim();
        }
      }
    }
  }

  return null;
};

// 가입하기 버튼 눌렀을 때
const onSignup = async (userInfo) => {
  const $form = document.getElementById("signup-form");
  const blankInputLabelName = getBlankInputLabelName();
  console.log(blankInputLabelName);
  if (blankInputLabelName) {
    alert(`${blankInputLabelName}를(을) 입력해주세요.`);
    return;
  }
  if ($form.dataset.signupType === "SELLER") {
    if (!$form.dataset.validateCertificationNumber) {
      alert("사업자 등록번호 인증을 해주세요.");
      return;
    }
  }
  if (!$form.dataset.validateId) {
    alert("아이디 중복확인을 해주세요.");
    return;
  }
  if (!$form.dataset.validatePassword) {
    alert("비밀번호를 확인해주세요.");
  }

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
      const firstKey = Object.keys(errorJson)[0]; // 첫 번째 키 (username)
      const firstMessage = errorJson[firstKey][0]; // 해당 키의 첫 번째 요소

      alert(firstMessage);
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
  if ($passwordInput.value === $checkPasswordInput.value) {
    return true;
  } else {
    return false;
  }
};

// 유효한 사업자등록번호인지 확인
// 10자리의 숫자
const validateCertificationNumber = (certificationNumber) => {
  const regex = /^\d{10}$/;

  if (!regex.test(certificationNumber)) {
    return false;
  }
  return true;
};

// 유효한 비밀번호인지 확인
// 8자 이상 && 한 개 이상의 영소문자 && 한 개 이상의 숫자
const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*\d).{8,}$/;

  if (!regex.test(password)) {
    return false;
  }
  return true;
};

// 아이디 중복 체크 후 응답 메시지 리턴
const checkDuplicateId = async (id) => {
  const $form = document.getElementById("signup-form");
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
      $form.dataset.validateId = true;
      return json;
    } else {
      const errorJson = await res.json();
      console.log(errorJson);
      $form.dataset.validateId = false;

      return errorJson;
    }
  } catch (error) {
    console.error(error);
    $form.dataset.validateId = false;

    return null;
  }
};

// 폼 초기화
const initializeForm = ($form) => {
  $form.dataset.signupType = "BUYER";
  document.getElementById("buyer").classList.add("active");

  // Enter 입력 방지
  $form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });
  });
};
