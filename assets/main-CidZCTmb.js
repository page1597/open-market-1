import"./modulepreload-polyfill-B5Qt9EMX.js";const p="https://openmarket.weniv.co.kr",h=()=>{fetch("header.html").then(e=>e.text()).then(e=>{document.querySelector("header").outerHTML=e;const t=document.createElement("script");t.src="/src/js/header.js",t.type="module",document.body.appendChild(t)})},g=()=>{fetch("footer.html").then(e=>e.text()).then(e=>{document.querySelector("footer").outerHTML=e})};document.addEventListener("DOMContentLoaded",()=>{h(),g(),L()});const i=e=>{const t=Math.floor((e-1)/10)*10+1,n=t+9;return[t,n]},f=e=>{const t=document.querySelector(".pagination ul"),n=document.getElementById("prev"),r=document.getElementById("next");Array.from(t.children).filter(l=>!l.querySelector("button")).forEach(l=>t.removeChild(l));const o=parseInt(new URLSearchParams(window.location.search).get("page")||1,10);let s=i(o)[0],d=e<i(o)[1]?e:i(o)[1];if(console.log("startPage",s,"endPage",d),e>1){const l=r.parentElement;r.onclick=()=>{let c=1;o+10<=e?c=o+10:c=e<i(o+10)[1]?e:i(o+10)[1],window.location.href=`./?page=${c}`,s+=10,d+=10},o>10?n.onclick=()=>{window.location.href=`./?page=${o-10}`,s-=10,d-=10}:n.disabled=!0;for(let c=s;c<=d;c++){const u=document.createElement("li"),m=document.createElement("a");m.href=`./?page=${c}`,m.textContent=c,u.appendChild(m),o===c&&u.classList.add("current"),t.insertBefore(u,l)}}},$=async()=>{const e=new URL(window.location.href),n=new URLSearchParams(e.search).get("page")||1;try{const r=await fetch(`${p}/products/?page=${n}`);if(r.ok){const a=await r.json();return console.log(a),f(Math.ceil(a.count/15)),a.results}else return null}catch(r){return console.error("상품 불러오기 오류:",r),null}},L=async()=>{const e=document.querySelector(".product-list ol");e.innerHTML="";try{const t=await $();console.log(t),t.forEach(n=>{w(n)})}catch(t){console.log(t)}},w=e=>{const t=document.querySelector(".product-list ol"),n=document.createElement("li");n.id=e.product_id;const r=document.createElement("a");r.href=`./product?id=${e.product_id}`;const a=document.createElement("img");a.src=e.image,a.alt=e.product_name,r.appendChild(a);const o=document.createElement("p"),s=document.createElement("a");r.href=`./product?id=${e.product_id}`;const d=document.createElement("p");o.classList.add("store-name"),s.classList.add("product-name"),d.classList.add("product-price"),o.textContent=e.store_name,s.textContent=e.product_name;const l=new Intl.NumberFormat("ko-KR");d.innerHTML=`<em>${l.format(e.price)}</em>원`,n.appendChild(r),n.appendChild(o),n.appendChild(s),n.appendChild(d),t.appendChild(n)};
