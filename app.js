// ============ DATA ============
const products=[
  {id:1,name:'Qora Blazer',tag:'Yangi Kelganlar',cat:'new',price:1850000,emoji:'🧥',badge:'new',
   desc:'Tuzilgan elegantlikning asari. Bu tikuvchilik bilan ishlangan qora blazer italiya jun matosidan tayyorlangan — zamonaviy o\'zbek janobiga mukammal tanlov.',sizes:['S','M','L','XL','XXL']},
  {id:2,name:'Kechki Zigir Ko\'ylak',tag:'Trend',cat:'trending',price:690000,emoji:'👔',badge:'trend',
   desc:'Premium Misr zigiridan to\'qilgan bu ko\'ylak ham ofis, ham kechki tadbirlar uchun beg\'ubor zarafotlik bilan oqadi.',sizes:['S','M','L','XL']},
  {id:3,name:'Klassik Shim',tag:'Top Mahsulotlar',cat:'top',price:950000,emoji:'👖',badge:'top',
   desc:'Qo\'lda to\'qilgan jun aralashmasidan tayyorlangan bu shim — nozik erkak uchun zamonaviy tikuvchilik bilan yangilangan klassik siluet.',sizes:['30','32','34','36','38']},
  {id:4,name:'Oltin Nashi Kostyum',tag:'Yangi Kelganlar',cat:'new',price:3200000,oldPrice:4000000,emoji:'🤵',badge:'sale',
   desc:'OLIGARCH kolleksiyasining toj gavhari. Nozik oltin ip tafsilotlari bilan ko\'mir rangdagi to\'liq ikki parcha kostyum.',sizes:['S','M','L','XL','XXL']},
  {id:5,name:'Qum Rangi Polo',tag:'Chegirma',cat:'sale',price:420000,oldPrice:680000,emoji:'👕',badge:'sale',
   desc:'Dam olish kunlari uchun hashamat. Pima paxtadan tayyorlangan bu polo haftasonu zarafotligining asosi hisoblanadi.',sizes:['S','M','L','XL']},
  {id:6,name:'Qora Palto',tag:'Top Mahsulotlar',cat:'top',price:2750000,emoji:'🧤',badge:'top',
   desc:'Bu haybatli qora palto Toshkent qishlari uchun og\'ir keshmir aralashmasida tikilgan — issiq, jasur, unutilmas.',sizes:['M','L','XL','XXL']},
  {id:7,name:'Ipak Galstuk To\'plami',tag:'Trend',cat:'trending',price:280000,emoji:'👔',badge:'trend',
   desc:'OLIGARCH maxsus naqshlarida to\'rtta qo\'lda o\'ralgan ipak galstuk — oddiyni ajoyibdan ajratadigan yakuniy tafsilot.',sizes:['Universal']},
  {id:8,name:'Charm Kamar',tag:'Chegirma',cat:'sale',price:350000,oldPrice:520000,emoji:'⌚',badge:'sale',
   desc:'Cho\'tkalanib ishlangan oltin toqali to\'liq donali charm kamar.',sizes:['S','M','L','XL']},
];

let cart=[],currentProduct=null,selectedSize='',selectedPayment='payme';
let currentOTP='',currentCat='all',maxPrice=2000000,orders=[];
let visitCount=0;

// ============ INIT ============
window.onload=()=>{
  renderProducts();updatePriceRange();initCursor();
  // visitor counter — sessiya boshida +1
  visitCount=parseInt(sessionStorage.getItem('oligarch_visits')||'0')+1;
  sessionStorage.setItem('oligarch_visits',visitCount);
  // pageview count in localStorage for persistence
  let totalVisits=parseInt(localStorage.getItem('oligarch_total_visits')||'0')+1;
  localStorage.setItem('oligarch_total_visits',totalVisits);
};

// ============ CURSOR ============
function initCursor(){
  const cur=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function anim(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=(rx-18)+'px';ring.style.top=(ry-18)+'px';requestAnimationFrame(anim);})();
  document.querySelectorAll('button,a,[onclick]').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px';});
    el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px';});
  });
}

// ============ PRODUCTS ============
function renderProducts(){
  const grid=document.getElementById('productsGrid');
  const f=products.filter(p=>(currentCat==='all'||p.cat===currentCat)&&p.price<=maxPrice);
  grid.innerHTML=f.length===0
    ?`<div style="grid-column:1/-1;text-align:center;padding:80px;color:var(--text-dim);font-size:13px">Filtrga mos mahsulot topilmadi.</div>`
    :f.map(p=>`<div class="product-card" onclick="openModal(${p.id})" style="animation:fadeUp 0.5s ease forwards">
      <div class="product-img-wrap"><div class="product-emoji">${p.emoji}</div>
        ${p.badge?`<span class="product-badge ${p.badge==='sale'?'sale':p.badge==='new'?'new':''}">${p.badge==='sale'?'CHEGIRMA':p.badge==='new'?'YANGI':'★ TOP'}</span>`:''}</div>
      <div class="product-info">
        <div class="product-tag">${p.tag}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price-row">
          <div><span class="product-price">${fmt(p.price)}</span>${p.oldPrice?`<span class="product-price-old">${fmt(p.oldPrice)}</span>`:''}</div>
          <button class="product-buy" onclick="event.stopPropagation();quickAdd(${p.id})">Sotib Olish</button>
        </div>
      </div></div>`).join('');
}
function fmt(n){return n.toLocaleString('uz-UZ')+' so\'m';}
function filterCat(cat,btn){currentCat=cat;document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderProducts();}
function filterPrice(v){maxPrice=parseInt(v);document.getElementById('priceDisplay').textContent='Gacha: '+fmt(maxPrice);updatePriceRange();renderProducts();}
function updatePriceRange(){document.getElementById('priceRangeFill').style.width=(maxPrice/2000000*100)+'%';}

// ============ MODAL ============
function openModal(id){
  currentProduct=products.find(p=>p.id===id);
  document.getElementById('modalTag').textContent=currentProduct.tag;
  document.getElementById('modalTitle').textContent=currentProduct.name;
  document.getElementById('modalDesc').textContent=currentProduct.desc;
  document.getElementById('modalPrice').textContent=fmt(currentProduct.price);
  document.getElementById('modalImg').innerHTML=`<div class="product-emoji" style="position:relative;font-size:120px;opacity:0.25">${currentProduct.emoji}</div>`;
  const sr=document.getElementById('sizeRow');
  sr.innerHTML=currentProduct.sizes.map(s=>`<button class="size-btn" onclick="selectSize(this,'${s}')">${s}</button>`).join('');
  selectedSize=currentProduct.sizes[0];sr.querySelector('.size-btn').classList.add('active');
  document.getElementById('productModal').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function selectSize(btn,s){selectedSize=s;document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
function closeModal(){document.getElementById('productModal').classList.remove('open');document.getElementById('overlay').classList.remove('show');}
function addToCartFromModal(){addToCart(currentProduct,selectedSize);closeModal();}
function quickAdd(id){const p=products.find(x=>x.id===id);addToCart(p,p.sizes[0]);}

// ============ CART ============
function addToCart(product,size){
  const ex=cart.find(i=>i.id===product.id&&i.size===size);
  if(ex)ex.qty++;else cart.push({...product,size,qty:1});
  updateCartUI();notify('Savatga qo\'shildi: '+product.name,'🛍');
}
function updateCartUI(){
  const n=cart.reduce((a,i)=>a+i.qty,0);
  document.getElementById('cartCount').textContent=n;
  document.getElementById('cartCount').style.transform=n>0?'scale(1.3)':'scale(1)';
  setTimeout(()=>document.getElementById('cartCount').style.transform='scale(1)',300);
  renderCartItems();
}
function renderCartItems(){
  const items=document.getElementById('cartItems'),footer=document.getElementById('cartFooter');
  if(cart.length===0){
    items.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">🛍</div>Savatingiz bo\'sh</div>';
    footer.style.display='none';return;
  }
  footer.style.display='block';
  items.innerHTML=cart.map((item,i)=>`<div class="cart-item">
    <div class="cart-item-img">${item.emoji}</div>
    <div class="cart-item-info">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">${fmt(item.price*item.qty)}</div>
      <div class="cart-item-size">O'lcham: ${item.size}</div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
      </div>
    </div>
    <button class="remove-btn" onclick="removeItem(${i})">✕</button>
  </div>`).join('');
  const total=cart.reduce((a,i)=>a+i.price*i.qty,0);
  document.getElementById('cartTotal').textContent=fmt(total);
  document.getElementById('checkoutTotal').textContent=fmt(total);
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);updateCartUI();}
function removeItem(i){cart.splice(i,1);updateCartUI();}
function toggleCart(){
  const p=document.getElementById('cartPanel'),ov=document.getElementById('overlay');
  const open=p.classList.toggle('open');
  ov.classList.toggle('show',open);
  if(open){document.getElementById('checkoutPanel').classList.remove('open');renderCartItems();}
}

// ============ CHECKOUT ============
function openCheckout(){
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('checkoutPanel').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.getElementById('checkoutTotal').textContent=fmt(cart.reduce((a,i)=>a+i.price*i.qty,0));
}
function closeCheckout(){document.getElementById('checkoutPanel').classList.remove('open');document.getElementById('overlay').classList.remove('show');}
function selectPayment(m){selectedPayment=m;document.querySelectorAll('.payment-card').forEach(c=>c.classList.remove('selected'));document.getElementById('pay-'+m).classList.add('selected');}
function formatCard(inp){let v=inp.value.replace(/\D/g,'').substring(0,16);inp.value=v.replace(/(.{4})/g,'$1 ').trim();}
function submitOrder(){
  const fn=document.getElementById('fName').value.trim(),ln=document.getElementById('lName').value.trim(),ph=document.getElementById('phone').value.trim();
  if(!fn||!ln||!ph){notify('Iltimos, barcha maydonlarni to\'ldiring','⚠️');return;}
  currentOTP=Math.floor(1000+Math.random()*9000).toString();
  document.getElementById('verifyPhone').textContent=ph;
  document.getElementById('demoCode').textContent=currentOTP;
  document.getElementById('checkoutForm').classList.add('hide');
  document.getElementById('verifyScreen').classList.add('show');
  document.getElementById('otp0').focus();
}
function otpNext(inp,idx){if(inp.value.length===1&&idx<3)document.getElementById('otp'+(idx+1)).focus();}
function getOTP(){return['otp0','otp1','otp2','otp3'].map(id=>document.getElementById(id).value).join('');}
function verifyOTP(){
  if(getOTP()===currentOTP){placeOrder();}
  else{notify('Noto\'g\'ri kod. Qayta urinib ko\'ring.','❌');['otp0','otp1','otp2','otp3'].forEach(id=>document.getElementById(id).value='');document.getElementById('otp0').focus();}
}
function resendCode(){currentOTP=Math.floor(1000+Math.random()*9000).toString();document.getElementById('demoCode').textContent=currentOTP;notify('Yangi kod: '+currentOTP,'📱');}
function placeOrder(){
  const oid='OLG-'+Date.now().toString().slice(-6);
  orders.push({id:oid,customer:document.getElementById('fName').value+' '+document.getElementById('lName').value,phone:document.getElementById('phone').value,items:[...cart],total:cart.reduce((a,i)=>a+i.price*i.qty,0),payment:selectedPayment,status:'pending',date:new Date().toLocaleString()});
  cart=[];updateCartUI();closeCheckout();
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('orderRef').textContent=oid;
  document.getElementById('successScreen').classList.add('show');
  ['fName','lName','phone','cardNum'].forEach(id=>document.getElementById(id).value='');
  ['otp0','otp1','otp2','otp3'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('checkoutForm').classList.remove('hide');
  document.getElementById('verifyScreen').classList.remove('show');
}
function hideSuccess(){document.getElementById('successScreen').classList.remove('show');}

// ============ SECRET ADMIN FLOW ============
function openAdminLogin(){
  // Savat panelini yopamiz
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  // Login screen ochiladi
  document.getElementById('adminLoginScreen').classList.add('show');
  document.getElementById('adminLogin').value='';
  document.getElementById('adminPass').value='';
  document.getElementById('loginError').classList.remove('show');
  setTimeout(()=>document.getElementById('adminLogin').focus(),300);
}
function closeAdminLogin(){
  document.getElementById('adminLoginScreen').classList.remove('show');
}
function doAdminLogin(){
  const login=document.getElementById('adminLogin').value.trim();
  const pass=document.getElementById('adminPass').value.trim();
  if(login==='OLIGARCH'&&pass==='12345'){
    document.getElementById('adminLoginScreen').classList.remove('show');
    showAdminPanel();
  } else {
    document.getElementById('loginError').classList.add('show');
    document.getElementById('adminPass').value='';
    document.getElementById('adminPass').focus();
    // Silkitish animatsiyasi
    const card=document.querySelector('.admin-login-card');
    card.style.animation='shake 0.4s ease';
    setTimeout(()=>card.style.animation='',400);
  }
}
function showAdminPanel(){
  document.getElementById('adminSection').classList.add('show');
  renderAdminOrders();
  updateAdminStats();
  // visitor count
  const total=parseInt(localStorage.getItem('oligarch_total_visits')||'1');
  document.getElementById('visitorCount').textContent=total;
}
function adminLogout(){
  document.getElementById('adminSection').classList.remove('show');
  notify('Admin paneldan chiqildi','👋');
}

// ============ ADMIN ORDERS ============
function renderAdminOrders(){
  const grid=document.getElementById('ordersGrid');
  if(orders.length===0){
    grid.innerHTML='<div class="no-orders"><div class="no-orders-icon">📋</div>Hali buyurtma yo\'q.</div>';
    return;
  }
  grid.innerHTML=orders.map((o,i)=>`
    <div class="order-card ${o.status==='approved'?'approved':''}">
      <div>
        <div class="order-id"># ${o.id} · ${o.date}</div>
        <div class="order-customer">${o.customer}</div>
        <div class="order-details">${o.phone} · ${o.payment.toUpperCase()}</div>
        <div class="order-details">${o.items.map(it=>it.name+' ×'+it.qty).join(' · ')}</div>
        <div class="order-details" style="margin-top:4px;color:var(--gold);font-size:13px">Jami: ${fmt(o.total)}</div>
      </div>
      <div class="order-status">
        <span class="status-badge ${o.status}">${o.status==='pending'?'Kutilmoqda':'Tasdiqlangan'}</span>
        ${o.status==='pending'?`<button class="approve-btn" onclick="approveOrder(${i})">Tasdiqlash</button>`:'<span style="font-size:20px">✅</span>'}
      </div>
    </div>`).join('');
}
function approveOrder(idx){
  orders[idx].status='approved';
  renderAdminOrders();updateAdminStats();
  notify('Buyurtma '+orders[idx].id+' tasdiqlandi!','✅');
  setTimeout(()=>notify('Mahsulotingiz OLIGARCH tomonidan tasdiqlandi! 🎉','🎉'),2000);
}
function updateAdminStats(){
  const total=orders.length;
  const approved=orders.filter(o=>o.status==='approved').length;
  const pending=orders.filter(o=>o.status==='pending').length;
  const revenue=orders.reduce((a,o)=>a+o.total,0);
  document.getElementById('statOrders').textContent=total;
  document.getElementById('statApproved').textContent=approved;
  document.getElementById('statTotal').textContent=total;
  document.getElementById('statApproved2').textContent=approved;
  document.getElementById('statPending').textContent=pending;
  document.getElementById('statRevenue').textContent=revenue>0?(revenue/1000000).toFixed(1)+' mln':'-';
}

// ============ UTILS ============
function closeAll(){
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('checkoutPanel').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}
function notify(msg,icon='✓'){
  const n=document.getElementById('notification');
  document.getElementById('notificationText').innerHTML=msg;
  n.querySelector('.notification-icon').textContent=icon;
  n.classList.add('show');clearTimeout(n._t);
  n._t=setTimeout(()=>n.classList.remove('show'),3500);
}
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').style.background=window.scrollY>80?'rgba(10,10,10,0.92)':'rgba(10,10,10,0.6)';
});

// Shake animation for wrong password
const shakeStyle=document.createElement('style');
shakeStyle.textContent=`@keyframes shake{0%,100%{transform:translateX(0) scale(1)}15%{transform:translateX(-8px) scale(0.99)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}`;
document.head.appendChild(shakeStyle);