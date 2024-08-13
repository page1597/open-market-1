# 오픈 마켓 서비스
## 1. 목표와 기능
### 1.1 목표
- Vanilla JavaScript를 사용하여 오픈 마켓 서비스의 주요 기능(프론트엔드)을 구현한다.
- 상품 등록, 결제 등 상품에 대한 CRUD 기능을 직접 구현한다.

### 1.2 기능
- 회원가입 및 로그인 기능
- 상품 목록 및 상세 페이지
- 장바구니 기능
- 주문 및 결제 프로세스
- 판매자와 구매자 기능
  - 판매자: 상품 등록, 수정, 삭제 기능
  - 구매자: 상품 조회, 장바구니 담기, 주문 및 결제 기능
 
## 2. 개발 환경 및 배포 URL
### 2.1 개발 환경
- 언어: HTML5, CSS3, JavaScript (ES6+)
- 개발 도구: Visual Studio Code
- 버전 관리: Git, GitHub
- 서버: 제공된 API 서버 활용

### 2.2 배포 URL
- https://page1597.github.io/open-market-service/
- 테스트용 계정
  ```md
  [구매자 계정]
  id: buyer1
  pw: hodu0910

  [판매자 계정]
  id: seller1
  pw: hodu0910
  ```

## 3. 프로젝트 구조
```md
open-market-service/
│
├── public/
│   └── assets/
│       └── (이미지 및 아이콘 파일들)
│
├── src/
│   ├── css/
│   │   ├── cart.css
│   │   ├── footer.css
│   │   ├── header.css
│   │   ├── login.css
│   │   ├── main.css
│   │   ├── product.css
│   │   ├── reset.css
│   │   └── style.css
│   │
│   └── js/
│       ├── cart.js
│       ├── header.js
│       ├── login.js
│       ├── main.js
│       └── product.js
│
├── index.html
├── cart.html
├── login.html
├── product.html
├── header.html
├── footer.html
│
├── package.json
├── vite.config.js
└── .gitignore
```
## 4. 역할 분담
- 개인 프로젝트로 진행되었으므로 모든 기능을 직접 구현합니다.

## 5. UI 및 기능
### 화면 캡쳐

|||
| ----------- | ----------- |
| **로그인 페이지** |  **회원가입 페이지**  | 
| <img src="https://github.com/user-attachments/assets/fea2a6cd-01fa-4d8f-941e-18a8f3897b0c" alt="로그인 페이지" width="450px"> |  |
| **상품 목록 페이지(메인)** | **상품 상세 페이지** |
| <img src="https://github.com/user-attachments/assets/2372c081-8d66-43e2-862a-83ce80909e5e" alt="상품목록 페이지" width="450px"> | <img src="https://github.com/user-attachments/assets/30282be4-83b5-4435-84cd-cd708d1dbb77" alt="상품 상세 페이지" width="450px"> |
| **장바구니 페이지** |  |
| <img src="https://github.com/user-attachments/assets/a1346679-7183-4c7b-8a5b-c17b66bfde54" alt="장바구니 페이지" width="450px">  | |

### 5.1 주요 페이지
- 로그인 페이지 (완료)
- 회원가입 페이지 (예정)
- 상품 목록 페이지 (완료)
- 상품 상세 페이지 (완료)
- 장바구니 페이지 (완료)
- 주문/결제 페이지 (예정)
- 판매자 센터 페이지 (예정)
- 상품 등록 페이지 (예정)

### 5.2 주요 기능
- 사용자 인증 (로그인/로그아웃)
- 상품 CRUD
- 장바구니 관리
- 주문 및 결제 프로세스
- 검색 기능

## 6. 개발하며 느낀 점
- Vanilla JavaScript로 처음 개발하면서, 기존에 사용하던 라이브러리(React)가 얼마나 많은 편의를 제공했는지 깨달았습니다.
직접 DOM 조작과 이벤트 핸들링을 구현하며 기본기를 다질 수 있었습니다. 이를 통해 JavaScript의 기본 원리에 대해 더 잘 이해할 수 있었습니다.
