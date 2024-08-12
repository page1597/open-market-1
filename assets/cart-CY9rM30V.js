import"./modulepreload-polyfill-B5Qt9EMX.js";const v="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%209.5H20'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3cpath%20d='M10%2020L10%200'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3c/svg%3e",$="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%2010H20'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3c/svg%3e",u="https://openmarket.weniv.co.kr";let l=[];document.addEventListener("DOMContentLoaded",()=>{k()});const b=t=>{console.log("attach select all ");const n=document.querySelector("#select-all");n.addEventListener("click",()=>{const e=n.checked;document.querySelectorAll('input[type="checkbox"]:not(#select-all)').forEach(c=>{c.checked=e,t&&h(t,e)}),g()})},k=async()=>{try{const t=await C();if(console.log(t),!t)return;const n=document.querySelector(".cart-items-container");for(const e of t.results){const o=await w(e.product_id);if(o){b(o);const c=_(o,e.quantity,e.cart_item_id);n.appendChild(c)}}}catch(t){console.error("장바구니 그리기 오류:",t)}},_=(t,n,e)=>{const o=document.createElement("article");o.className="cart-item";const c=new Intl.NumberFormat("ko-KR");return o.innerHTML=`
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
        <img src="${$}" alt="수량 1 줄이기" />
      </button>
      <input disabled value="${n}" min="1" max="100" type="number" class="quantity-change-input" id="quantity-${t.product_id}" />
      <button type="button" id="plus-${t.product_id}">
        <img src="${v}" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="total">
      <p class="total-price" id="total-price-${t.product_id}">${c.format(t.price*n)}원</p>
      <button class="order-button" id="order-${t.product_id}" type="button">주문하기</button>
    </div>
  `,S(o,t,n,e),o},S=(t,n,e,o)=>{const c=t.querySelector(`#remove-${n.product_id}`),i=t.querySelector(`#minus-${n.product_id}`),a=t.querySelector(`#plus-${n.product_id}`),s=t.querySelector(`#select-${n.product_id}`);c.addEventListener("click",()=>{q(o)}),i.addEventListener("click",()=>{y(n,o)}),a.addEventListener("click",()=>{y(n,o)}),s.addEventListener("input",()=>h(n,s.checked))},h=(t,n)=>{console.log(t);const e=parseInt(document.querySelector(`#quantity-${t.product_id}`).value,10);l=l.filter(o=>o.id!==t.product_id),n&&l.push({id:t.product_id,price:t.price*e,discountPrice:0,shippingFee:t.shipping_fee}),console.log(l),g()},g=()=>{const t=document.querySelector(".total-count"),n=t.querySelector(".product-price .value em"),e=t.querySelector(".shipping-fee .value em"),{finalOrderPrice:o,finalShippingFee:c}=l.reduce((i,a)=>(i.finalOrderPrice+=a.price,i.finalShippingFee+=a.shippingFee,i),{finalOrderPrice:0,finalShippingFee:0});n.textContent=o.toLocaleString(),e.textContent=c.toLocaleString(),t.querySelector(".total-price .value em").textContent=(o+c).toLocaleString()},f=(t,n)=>{const e=document.createElement("article");return e.className=t,e.innerHTML=n,document.body.appendChild(e),e},y=(t,n)=>{let e=parseInt(document.querySelector(`#quantity-${t.product_id}`).value,10);const o=`
  <div class="modal-content">
    <div class="quantity-change-button">
      <button type="button" id="modal-minus-${t.product_id}">
        <img src="${$}" alt="수량 1 줄이기" />
      </button>
      <input value="${e}" min="1" max="100" type="number" class="quantity-change-input" id="modal-quantity-${t.product_id}" />
      <button type="button" id="modal-plus-${t.product_id}">
        <img src="${v}" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="modal-button-container">
      <button id="cancel" class="modal-button">취소</button>
      <button id="confirm" class="modal-button">수정</button>
    </div>
  </div>
`,c=f("quantity-change-modal",o),i=c.querySelector(`#modal-quantity-${t.product_id}`),a=c.querySelector(`#modal-minus-${t.product_id}`),s=c.querySelector(`#modal-plus-${t.product_id}`),d=()=>{a.disabled=e<=1,s.disabled=e>=t.stock};return d(),a.addEventListener("click",()=>{e>1&&(e--,i.value=e),d()}),s.addEventListener("click",()=>{e++,i.value=e,d()}),i.addEventListener("input",r=>{e=Math.min(Math.max(parseInt(r.target.value,10)||1,1),100),i.value=e,d()}),new Promise(r=>{c.querySelector("#confirm").addEventListener("click",async()=>{c.remove();const m=localStorage.getItem("token");if(!m)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const p=await fetch(`${u}/cart/${n}/`,{headers:{Authorization:`JWT ${m}`,"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({product_id:t.product_id,quantity:e,is_active:!0})});console.log(t.product_id,e,m),p.ok?(alert("수정되었습니다."),L(t,e),r(!0)):(alert("수정 실패. 다시 시도해주세요."),r(!1))}catch(p){console.error(p),r(!1)}}),c.querySelector("#cancel").addEventListener("click",()=>{c.remove(),r(!1)})})},q=async t=>{const e=f("remove-confirm-modal",`
    <div class="modal-content">
      <p>상품을 삭제하시겠습니까?</p>
      <div class="modal-button-container">
        <button id="cancel" class="modal-button">취소</button>
        <button id="confirm" class="modal-button">확인</button>
      </div>
    </div>
  `);return new Promise(o=>{e.querySelector("#confirm").addEventListener("click",async()=>{e.remove();const c=localStorage.getItem("token");if(!c)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const i=await fetch(`${u}/cart/${t}`,{headers:{Authorization:`JWT ${c}`},method:"DELETE"});console.log(i),i.ok?(alert("삭제되었습니다."),window.location.reload(),o(!0)):(alert("삭제 실패. 다시 시도해주세요."),o(!1)),o(!0)}catch(i){console.error(i),o(!1)}}),e.querySelector("#cancel").addEventListener("click",()=>{e.remove(),o(!1)})})},C=async()=>{const t=localStorage.getItem("token");if(!t)return console.error("인증된 사용자가 아님. 토큰 없음"),null;try{const n=await fetch(`${u}/cart/`,{headers:{Authorization:`JWT ${t}`}});return n.ok?await n.json():null}catch(n){return console.error("장바구니 불러오기 오류:",n),null}},w=async t=>{try{const n=await fetch(`${u}/products/${t}`);return n.ok?await n.json():null}catch(n){return console.error("상품 불러오기 오류:",n),null}},L=(t,n)=>{const e=new Intl.NumberFormat("ko-KR"),o=document.querySelector(`#select-${t.product_id}`).checked;document.querySelector(`#quantity-${t.product_id}`).value=n,h(t,o);const c=document.querySelector(`#total-price-${t.product_id}`);c.textContent=`${e.format(t.price*n)}원`};
