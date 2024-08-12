import"./modulepreload-polyfill-B5Qt9EMX.js";const u="https://openmarket.weniv.co.kr";let l=[];const $=()=>{console.log("header.html"),fetch("header.html").then(e=>e.text()).then(e=>{document.querySelector("header").outerHTML=e,fetch("/open-market-service/manifest.json").then(n=>n.json()).then(n=>{const t=n["src/js/header.js"],o=document.createElement("script");o.src=`/open-market-service/${t}`,o.type="module",o.onload=()=>console.log("header.js 로드 완료"),o.onerror=c=>console.error("header.js 로드 실패",c),document.body.appendChild(o)})})},b=()=>{fetch("footer.html").then(e=>e.text()).then(e=>{document.querySelector("footer").outerHTML=e})};document.addEventListener("DOMContentLoaded",()=>{$(),b(),k()});const g=e=>{const n=document.querySelector("#select-all");n.addEventListener("click",()=>{const t=n.checked;document.querySelectorAll('input[type="checkbox"]:not(#select-all)').forEach(c=>{c.checked=t,e&&h(e,t)}),f()})},k=async()=>{try{const e=await C();if(!e)return;const n=document.querySelector(".cart-items-container");for(const t of e.results){const o=await L(t.product_id);if(o){g(o);const c=S(o,t.quantity,t.cart_item_id);n.appendChild(c)}}}catch(e){console.error("장바구니 그리기 오류:",e)}},S=(e,n,t)=>{const o=document.createElement("article");o.className="cart-item";const c=new Intl.NumberFormat("ko-KR");return o.innerHTML=`
    <div>
      <button type="button" class="remove" id="remove-${e.product_id}"></button>
      <div class="checkbox-container">
        <input type="checkbox" id="select-${e.product_id}" aria-label="개별 상품 선택"/>
        <label for="select-${e.product_id}"><span class="sr-only">개별 상품 선택</span></label>
      </div>
    </div>
    <div class="product-detail">
      <figure>
        <img class="product-image" src="${e.image}" alt="${e.product_name}" />
        <figcaption class="sr-only">상품 설명</figcaption>
      </figure>
      <div class="product-info">
        <div>
          <p class="store-name">${e.store_name}</p>
          <p class="product-name">${e.product_name}</p>
          <p class="product-price">${e.price}원</p>
        </div>
        <p class="shipping-info">${e.shipping_method==="PARCEL"?"택배배송":"직접전달"} / ${e.shipping_fee===0?"무료배송":e.shipping_fee+"원"}</p>
      </div>
    </div>
    <div class="quantity-change-button">
      <button type="button" id="minus-${e.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input disabled value="${n}" min="1" max="100" type="number" class="quantity-change-input" id="quantity-${e.product_id}" />
      <button type="button" id="plus-${e.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="total">
      <p class="total-price" id="total-price-${e.product_id}">${c.format(e.price*n)}원</p>
      <button class="order-button" id="order-${e.product_id}" type="button">주문하기</button>
    </div>
  `,_(o,e,n,t),o},_=(e,n,t,o)=>{const c=e.querySelector(`#remove-${n.product_id}`),r=e.querySelector(`#minus-${n.product_id}`),i=e.querySelector(`#plus-${n.product_id}`),s=e.querySelector(`#select-${n.product_id}`);c.addEventListener("click",()=>{q(o)}),r.addEventListener("click",()=>{y(n,o)}),i.addEventListener("click",()=>{y(n,o)}),s.addEventListener("input",()=>h(n,s.checked))},h=(e,n)=>{console.log(e);const t=parseInt(document.querySelector(`#quantity-${e.product_id}`).value,10);l=l.filter(o=>o.id!==e.product_id),n&&l.push({id:e.product_id,price:e.price*t,discountPrice:0,shippingFee:e.shipping_fee}),console.log(l),f()},f=()=>{const e=document.querySelector(".total-count"),n=e.querySelector(".product-price .value em"),t=e.querySelector(".shipping-fee .value em"),{finalOrderPrice:o,finalShippingFee:c}=l.reduce((r,i)=>(r.finalOrderPrice+=i.price,r.finalShippingFee+=i.shippingFee,r),{finalOrderPrice:0,finalShippingFee:0});n.textContent=o.toLocaleString(),t.textContent=c.toLocaleString(),e.querySelector(".total-price .value em").textContent=(o+c).toLocaleString()},v=(e,n)=>{const t=document.createElement("article");return t.className=e,t.innerHTML=n,document.body.appendChild(t),t},y=(e,n)=>{let t=parseInt(document.querySelector(`#quantity-${e.product_id}`).value,10);const o=`
  <div class="modal-content">
    <div class="quantity-change-button">
      <button type="button" id="modal-minus-${e.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input value="${t}" min="1" max="100" type="number" class="quantity-change-input" id="modal-quantity-${e.product_id}" />
      <button type="button" id="modal-plus-${e.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="modal-button-container">
      <button id="cancel" class="modal-button">취소</button>
      <button id="confirm" class="modal-button">수정</button>
    </div>
  </div>
`,c=v("quantity-change-modal",o),r=c.querySelector(`#modal-quantity-${e.product_id}`),i=c.querySelector(`#modal-minus-${e.product_id}`),s=c.querySelector(`#modal-plus-${e.product_id}`),d=()=>{i.disabled=t<=1,s.disabled=t>=e.stock};return d(),i.addEventListener("click",()=>{t>1&&(t--,r.value=t),d()}),s.addEventListener("click",()=>{t++,r.value=t,d()}),r.addEventListener("input",a=>{t=Math.min(Math.max(parseInt(a.target.value,10)||1,1),100),r.value=t,d()}),new Promise(a=>{c.querySelector("#confirm").addEventListener("click",async()=>{c.remove();const m=localStorage.getItem("token");if(!m)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const p=await fetch(`${u}/cart/${n}/`,{headers:{Authorization:`JWT ${m}`,"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({product_id:e.product_id,quantity:t,is_active:!0})});console.log(e.product_id,t,m),p.ok?(alert("수정되었습니다."),E(e,t),a(!0)):(alert("수정 실패. 다시 시도해주세요."),a(!1))}catch(p){console.error(p),a(!1)}}),c.querySelector("#cancel").addEventListener("click",()=>{c.remove(),a(!1)})})},q=async e=>{const t=v("remove-confirm-modal",`
    <div class="modal-content">
      <p>상품을 삭제하시겠습니까?</p>
      <div class="modal-button-container">
        <button id="cancel" class="modal-button">취소</button>
        <button id="confirm" class="modal-button">확인</button>
      </div>
    </div>
  `);return new Promise(o=>{t.querySelector("#confirm").addEventListener("click",async()=>{t.remove();const c=localStorage.getItem("token");if(!c)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const r=await fetch(`${u}/cart/${e}`,{headers:{Authorization:`JWT ${c}`},method:"DELETE"});console.log(r),r.ok?(alert("삭제되었습니다."),window.location.reload(),o(!0)):(alert("삭제 실패. 다시 시도해주세요."),o(!1)),o(!0)}catch(r){console.error(r),o(!1)}}),t.querySelector("#cancel").addEventListener("click",()=>{t.remove(),o(!1)})})},C=async()=>{const e=localStorage.getItem("token");if(!e)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const n=await fetch(`${u}/cart/`,{headers:{Authorization:`JWT ${e}`}});return n.ok?await n.json():null}catch(n){return console.error("장바구니 불러오기 오류:",n),null}},L=async e=>{try{const n=await fetch(`${u}/products/${e}`);return n.ok?await n.json():null}catch(n){return console.error("상품 불러오기 오류:",n),null}},E=(e,n)=>{const t=new Intl.NumberFormat("ko-KR"),o=document.querySelector(`#select-${e.product_id}`).checked;document.querySelector(`#quantity-${e.product_id}`).value=n,h(e,o);const c=document.querySelector(`#total-price-${e.product_id}`);c.textContent=`${t.format(e.price*n)}원`};
