import"./modulepreload-polyfill-B5Qt9EMX.js";const u="https://openmarket.weniv.co.kr";let l=[];const f=()=>{console.log("header.html"),fetch("header.html").then(t=>t.text()).then(t=>{document.querySelector("header").outerHTML=t;const e=document.createElement("script");e.src="/src/js/header.js",document.body.appendChild(e)})},v=()=>{fetch("footer.html").then(t=>t.text()).then(t=>{document.querySelector("footer").outerHTML=t})};document.addEventListener("DOMContentLoaded",()=>{f(),v(),S()});const g=t=>{const e=document.querySelector("#select-all");e.addEventListener("click",()=>{const n=e.checked;document.querySelectorAll('input[type="checkbox"]:not(#select-all)').forEach(c=>{c.checked=n,t&&h(t,n)}),$()})},S=async()=>{try{const t=await C();if(!t)return;const e=document.querySelector(".cart-items-container");for(const n of t.results){const o=await L(n.product_id);if(o){g(o);const c=_(o,n.quantity,n.cart_item_id);e.appendChild(c)}}}catch(t){console.error("장바구니 그리기 오류:",t)}},_=(t,e,n)=>{const o=document.createElement("article");o.className="cart-item";const c=new Intl.NumberFormat("ko-KR");return o.innerHTML=`
    <div>
      <button type="button" class="remove" id="remove-${t.product_id}"></button>
      <div class="checkbox-container">
        <input type="checkbox" id="select-${t.product_id}" aria-label="개별 상품 선택"/>
        <label for="select-${t.product_id}"><span class="sr-only">개별 상품 선택</span></label>
      </div>
    </div>
    <div class="product-detail">
      <figure>
        <img class="product-image" src="${t.image}" alt="${t.product_name}" />
        <figcaption class="sr-only">상품 설명</figcaption>
      </figure>
      <div class="product-info">
        <div>
          <p class="store-name">${t.store_name}</p>
          <p class="product-name">${t.product_name}</p>
          <p class="product-price">${t.price}원</p>
        </div>
        <p class="shipping-info">${t.shipping_method==="PARCEL"?"택배배송":"직접전달"} / ${t.shipping_fee===0?"무료배송":t.shipping_fee+"원"}</p>
      </div>
    </div>
    <div class="quantity-change-button">
      <button type="button" id="minus-${t.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input disabled value="${e}" min="1" max="100" type="number" class="quantity-change-input" id="quantity-${t.product_id}" />
      <button type="button" id="plus-${t.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="total">
      <p class="total-price" id="total-price-${t.product_id}">${c.format(t.price*e)}원</p>
      <button class="order-button" id="order-${t.product_id}" type="button">주문하기</button>
    </div>
  `,q(o,t,e,n),o},q=(t,e,n,o)=>{const c=t.querySelector(`#remove-${e.product_id}`),r=t.querySelector(`#minus-${e.product_id}`),i=t.querySelector(`#plus-${e.product_id}`),s=t.querySelector(`#select-${e.product_id}`);c.addEventListener("click",()=>{k(o)}),r.addEventListener("click",()=>{y(e,o)}),i.addEventListener("click",()=>{y(e,o)}),s.addEventListener("input",()=>h(e,s.checked))},h=(t,e)=>{console.log(t);const n=parseInt(document.querySelector(`#quantity-${t.product_id}`).value,10);l=l.filter(o=>o.id!==t.product_id),e&&l.push({id:t.product_id,price:t.price*n,discountPrice:0,shippingFee:t.shipping_fee}),console.log(l),$()},$=()=>{const t=document.querySelector(".total-count"),e=t.querySelector(".product-price .value em"),n=t.querySelector(".shipping-fee .value em"),{finalOrderPrice:o,finalShippingFee:c}=l.reduce((r,i)=>(r.finalOrderPrice+=i.price,r.finalShippingFee+=i.shippingFee,r),{finalOrderPrice:0,finalShippingFee:0});e.textContent=o.toLocaleString(),n.textContent=c.toLocaleString(),t.querySelector(".total-price .value em").textContent=(o+c).toLocaleString()},b=(t,e)=>{const n=document.createElement("article");return n.className=t,n.innerHTML=e,document.body.appendChild(n),n},y=(t,e)=>{let n=parseInt(document.querySelector(`#quantity-${t.product_id}`).value,10);const o=`
  <div class="modal-content">
    <div class="quantity-change-button">
      <button type="button" id="modal-minus-${t.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input value="${n}" min="1" max="100" type="number" class="quantity-change-input" id="modal-quantity-${t.product_id}" />
      <button type="button" id="modal-plus-${t.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="modal-button-container">
      <button id="cancel" class="modal-button">취소</button>
      <button id="confirm" class="modal-button">수정</button>
    </div>
  </div>
`,c=b("quantity-change-modal",o),r=c.querySelector(`#modal-quantity-${t.product_id}`),i=c.querySelector(`#modal-minus-${t.product_id}`),s=c.querySelector(`#modal-plus-${t.product_id}`),d=()=>{i.disabled=n<=1,s.disabled=n>=t.stock};return d(),i.addEventListener("click",()=>{n>1&&(n--,r.value=n),d()}),s.addEventListener("click",()=>{n++,r.value=n,d()}),r.addEventListener("input",a=>{n=Math.min(Math.max(parseInt(a.target.value,10)||1,1),100),r.value=n,d()}),new Promise(a=>{c.querySelector("#confirm").addEventListener("click",async()=>{c.remove();const m=localStorage.getItem("token");if(!m)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const p=await fetch(`${u}/cart/${e}/`,{headers:{Authorization:`JWT ${m}`,"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({product_id:t.product_id,quantity:n,is_active:!0})});console.log(t.product_id,n,m),p.ok?(alert("수정되었습니다."),E(t,n),a(!0)):(alert("수정 실패. 다시 시도해주세요."),a(!1))}catch(p){console.error(p),a(!1)}}),c.querySelector("#cancel").addEventListener("click",()=>{c.remove(),a(!1)})})},k=async t=>{const n=b("remove-confirm-modal",`
    <div class="modal-content">
      <p>상품을 삭제하시겠습니까?</p>
      <div class="modal-button-container">
        <button id="cancel" class="modal-button">취소</button>
        <button id="confirm" class="modal-button">확인</button>
      </div>
    </div>
  `);return new Promise(o=>{n.querySelector("#confirm").addEventListener("click",async()=>{n.remove();const c=localStorage.getItem("token");if(!c)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const r=await fetch(`${u}/cart/${t}`,{headers:{Authorization:`JWT ${c}`},method:"DELETE"});console.log(r),r.ok?(alert("삭제되었습니다."),window.location.reload(),o(!0)):(alert("삭제 실패. 다시 시도해주세요."),o(!1)),o(!0)}catch(r){console.error(r),o(!1)}}),n.querySelector("#cancel").addEventListener("click",()=>{n.remove(),o(!1)})})},C=async()=>{const t=localStorage.getItem("token");if(!t)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const e=await fetch(`${u}/cart/`,{headers:{Authorization:`JWT ${t}`}});return e.ok?await e.json():null}catch(e){return console.error("장바구니 불러오기 오류:",e),null}},L=async t=>{try{const e=await fetch(`${u}/products/${t}`);return e.ok?await e.json():null}catch(e){return console.error("상품 불러오기 오류:",e),null}},E=(t,e)=>{const n=new Intl.NumberFormat("ko-KR"),o=document.querySelector(`#select-${t.product_id}`).checked;document.querySelector(`#quantity-${t.product_id}`).value=e,h(t,o);const c=document.querySelector(`#total-price-${t.product_id}`);c.textContent=`${n.format(t.price*e)}원`};
