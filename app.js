const stage=location.pathname.endsWith('/js.html')?3:location.pathname.endsWith('/css.html')?2:([1,2,3].includes(Number(new URLSearchParams(location.search||'').get('stage')))?Number(new URLSearchParams(location.search||'').get('stage')):1);
const storePage=location.pathname.endsWith('/albums.html')?'albums':location.pathname.endsWith('/contact.html')?'contact':'home';
const $=s=>document.querySelector(s), frame=$('#store');let exploring=false,selected=null,logs=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const albums=[{id:'moon',name:'MOON LETTER',artist:'LUNA / 迷你專輯 VOL.02',price:680,color:'#dedcf5',accent:'#6b5ba4',label:'LUNA',sub:'letters from the moon',category:'solo'},{id:'orbit',name:'AFTER THE ORBIT',artist:'ORBIT / 正規專輯 VOL.01',price:880,color:'#f3a768',accent:'#a13c29',label:'ORBIT',sub:'AFTER THE ORBIT',category:'group'},{id:'blue',name:'BLUE HOUR',artist:'SEO / 首張個人專輯',price:620,color:'#9ac6d9',accent:'#245b72',label:'SEO',sub:'blue hour',category:'solo'},{id:'flora',name:'IN BLOOM',artist:'FLORA / 迷你專輯 VOL.03',price:750,color:'#c4d3a2',accent:'#375140',label:'FLORA',sub:'IN BLOOM',category:'group'}];
const htmlTopics=[
['doctype','<!DOCTYPE html>','文件宣告','告訴瀏覽器使用現代 HTML 標準模式。它是宣告，不是一般成對標籤。','<!DOCTYPE html>','@document'],
['html','<html>','根元素','包住整份 HTML；lang="zh-Hant" 告訴輔助工具這是繁體中文。','<html lang="zh-Hant">…</html>','@document'],
['head','<head>','網頁設定','放編碼、分頁標題、viewport 與樣式連結，不是畫面上的商店標題。','<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>Side A 唱片商店</title>\n</head>','@document'],
['body','<body>','可見內容','頁面上看得到的商店內容放在 body 裡。','<body>\n  <header>…</header>\n  <section>…</section>\n</body>','body'],
['header','<header>','頁首','表示商店的介紹或導覽區域，本例包含品牌和購物車。','<header class="store-header">…</header>','header'],
['h1','<h1>','主標題','頁面最主要的標題；標題階層提供內容結構，不只是讓文字變大。','<h1>把喜歡，收藏成一張唱片。</h1>','h1'],
['p','<p>','段落','把一段完整文字組成段落。','<p>為每一種心情，找到一張專輯。</p>','.hero p'],
['br','<br>','換行','在同一段內容裡換行。不要用很多 br 來排版或製造間距。','<p>收藏音樂，<br>也收藏此刻的自己。</p>','.hero p'],
['div','<div>','區塊容器','把一組元素包成區塊；沒有特定語意，適合當排版容器。','<div class="album-grid">\n  <article>…</article>\n</div>','.album-grid'],
['span','<span>','行內容器','包住一小段文字，方便單獨套樣式，不自動另起一行。','<span class="tag">NEW RELEASE</span>','.tag'],
['a','<a>','超連結','href 指定另一個頁面的網址。本例點選 albums.html 開啟所有專輯頁，不需要商店 JavaScript。','<a href="albums.html">所有專輯</a>','.store-header nav a'],
['img','<img>','圖片','src 指向圖片；alt 提供替代文字。本例專輯封面皆為虛構設計。','<img src="covers/moon.svg" alt="LUNA 的 MOON LETTER 專輯封面" width="220" height="220">','.album img'],
['input','<input>','單行輸入','type 指定欄位種類。placeholder 只是提示，仍應有 label。HTML 先顯示欄位，第 3 頁才有即時搜尋。','<label for="search">找一張專輯</label>\n<input id="search" type="search" placeholder="搜尋專輯或歌手">','#search'],
['textarea','<textarea>','多行輸入','適合留言；rows 決定初始顯示行數，required 要求填寫。','<label for="message">想對我們說的話</label>\n<textarea id="message" rows="3" required></textarea>','#message'],
['button','<button>','按鈕','type="button" 是一般按鈕；type="submit" 送出表單。外觀不等於已具備購物功能。','<button type="button" class="add">加入購物車 ＋</button>','.add'],
['section','<section>','主題區域','將同一主題的內容分組，通常會有標題，例如精選專輯區。','<section id="albums">\n  <h2>本週精選</h2>\n  …\n</section>','#albums'],
['article','<article>','獨立內容','可獨立理解的一份內容，本例每張專輯是一個 article。','<article class="album">\n  <img …>\n  <h3>MOON LETTER</h3>\n  …\n</article>','.album'],
['footer','<footer>','頁尾','放版權、聯絡資訊或補充說明。','<footer>© 2026 SIDE A · 教學示範商店</footer>','footer']
];
const cssTopics=[
['color','color','文字顏色','設定文字顏色；本例將品牌與按鈕文字設成深綠色。','.store-header { color: #265c42; }','.store-header'],
['font-size','font-size','文字大小','px 是固定尺寸，rem 相對於根元素字級。標題與內文有不同層級。','h1 { font-size: 42px; }','h1'],
['font-family','font-family','字型','依序尋找可用字型，最後用通用的 sans-serif 無襯線字型。','body { font-family: Arial, sans-serif; }','body'],
['background-color','background-color','背景色','設定區域的底色。','body { background-color: #fafaf4; }','body'],
['background-image','background-image','背景圖','本例以 SVG 圖片作為主視覺背景。背景圖是裝飾；商品圖片仍用 img 與 alt。','.hero { background-image: url("covers/hero.svg"); }','.hero'],
['background-size','background-size','背景縮放','cover 會保持比例並填滿區域，因此可能裁切背景圖。','.hero { background-size: cover; }','.hero'],
['text-align','text-align','文字對齊','控制容器內行內內容的水平對齊。','footer { text-align: center; }','footer'],
['border','border','邊框','依序寫寬度、線條種類、顏色。','.album { border: 1px solid #dce0d3; }','.album'],
['border-radius','border-radius','圓角','數值越大，轉角越圓。','.album { border-radius: 12px; }','.album'],
['margin','margin','外距','控制元素與外部其他元素的距離。','.album h3 { margin: 14px 0 5px; }','.album h3'],
['padding','padding','內距','控制內容到自己邊框的距離。比較卡片內距與卡片外距。','.album { padding: 14px; }','.album'],
['hover',':hover','游標懸停','偽類別：滑鼠移到按鈕時套用，不需要 JavaScript。觸控裝置不一定有懸停。','.add:hover {\n  background-color: #163c2a;\n  color: white;\n}','.add'],
['box-shadow','box-shadow','滑過專輯的陰影','依序設定水平位移、垂直位移、模糊與顏色。搭配 :hover，滑鼠移到卡片上時加深陰影；transition 讓變化平順，不需要 JavaScript。','.album {\n  box-shadow: 0 5px 15px #263e4210;\n  transition: box-shadow 0.25s ease;\n}\n.album:hover {\n  box-shadow: 0 14px 32px #263e4230;\n}','.album']
];
const jsTopics=[
['const','const / let','變數與資料','const 宣告不重新指定的綁定；let 適合會重新指定的數值。字串用引號，數字可計算。','const currency = "TWD";\nlet quantity = 0;\nquantity = quantity + 1;','#cart'],
['objects','陣列 / 物件','商品資料','物件把相關資料放在一起；陣列可以放很多商品。用點號讀取屬性。','const album = { id: "moon", price: 680 };\nconst albums = [album];\nconsole.log(albums[0].price);','.album'],
['dom','querySelector','找到畫面元素','document 代表文件，querySelector 以 CSS 選擇器找到第一個元素，textContent 更新純文字。','const cart = document.querySelector("#cart");\ncart.textContent = "購物車（1）";','#cart'],
['function','function','定義與呼叫','將可重複使用的工作包成函式。定義不會自動執行，呼叫才會執行；參數接收不同資料。','function sayHello() {\n  console.log("Hello!");\n}\nsayHello();\n\nfunction addToCart(album) {\n  cartItems.push(album);\n  updateCart();\n}','.add'],
['click','addEventListener · click','點擊監聽','監聽器等使用者點擊，再執行 callback 函式。傳入函式，而不是立刻呼叫它。','btn.addEventListener("click", function () {\n  addToCart(album);\n});','.add'],
['inputEvent','input','即時搜尋','每次輸入值改變就觸發。讀取 event.target.value，利用條件判斷顯示符合的商品。','search.addEventListener("input", function (event) {\n  const keyword = event.target.value;\n  filterAlbums(keyword);\n});','#search'],
['condition','if / else','條件判斷','根據條件決定是否顯示商品。includes 檢查字串是否包含關鍵字。','if (album.name.includes(keyword)) {\n  card.hidden = false;\n} else {\n  card.hidden = true;\n}','#search'],
['submit','submit / preventDefault','表單送出','submit 監聽 form，不是只監聽按鈕。preventDefault 阻止預設跳頁，改在當頁顯示回覆。','form.addEventListener("submit", function (event) {\n  event.preventDefault();\n  feedback.textContent = "留言已在本頁接收！";\n});','#feedback-form'],
['ga','gtag · GA4','互動與分析','可以在加入購物車成功後送出 add_to_cart。此教室僅模擬紀錄，沒有連到真實 GA。','gtag("event", "add_to_cart", {\n  currency: "TWD", value: album.price,\n  items: [{ item_id: album.id,\n    item_name: album.name,\n    price: album.price, quantity: 1 }]\n});','.add']
];
const topics=stage===1?htmlTopics:stage===2?[...cssTopics,...htmlTopics]:[...jsTopics,...htmlTopics,...cssTopics];
const storeCSS=`.page-intro{padding:32px;background:#e6ead6}.page-intro h1{font-size:36px;margin:20px 0 12px}.page-intro p{font-size:13px;line-height:1.8;max-width:600px}.page-intro a{color:#265c42}.contact-info{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:30px}.contact-info article{padding:22px;border:1px solid #dce0d3;border-radius:10px;background:white}.contact-info h2{font-size:18px}.contact-info p{font-size:13px;line-height:1.8}.store-header a.logo{font-size:24px;font-weight:900;letter-spacing:3px;text-decoration:none}.store-header [aria-current=page]{font-weight:bold;text-decoration:underline;text-underline-offset:5px}@media(max-width:500px){.contact-info{grid-template-columns:1fr}.store-header{flex-wrap:wrap;gap:14px}.store-header nav{display:flex!important;order:3;flex-basis:100%;justify-content:center}}*{box-sizing:border-box}body{margin:0;color:#25352b;background-color:#fafaf4;font-family:Arial,sans-serif;font-size:14px}.store-header{padding:23px 30px;display:flex;align-items:center;justify-content:space-between;color:#265c42;border-bottom:1px solid #dce0d3}.logo{font-size:24px;font-weight:900;letter-spacing:3px}.store-header a{color:inherit;text-decoration:none;font-size:12px;margin:0 10px}.store-header button{border:1px solid #b6c3ac;background:transparent;border-radius:30px;padding:8px 12px;color:#265c42}.hero{padding:40px 34px;background-color:#e6ead6;background-image:url('covers/hero.svg');background-size:cover;min-height:260px}.hero h1{font-size:42px;max-width:450px;line-height:1.2;letter-spacing:-2px;margin:18px 0}.hero p{line-height:1.7;font-size:12px;max-width:400px}.hero a{display:inline-block;color:#265c42;font-size:12px;margin-top:10px}.tag{font-size:9px;letter-spacing:2px;border:1px solid #8d9e7e;padding:5px 8px;border-radius:4px}#albums{padding:30px}.section-head{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-bottom:20px}h2{font-size:23px;margin:0 0 7px}.muted{font-size:11px;color:#77816e}.search label{display:block;font-size:10px;margin-bottom:5px}input,textarea{font:inherit;padding:10px;border:1px solid #bdc8b6;border-radius:5px;background:white;max-width:100%}.filters{display:flex;gap:8px;margin-bottom:20px}.filters button{padding:7px 14px;border:1px solid #c8cfbf;border-radius:20px;background:transparent;color:#5e6c57;font-size:11px}.filters button.active{background:#265c42;color:white}.album-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.album{transition:box-shadow 0.25s ease;padding:14px;border:1px solid #dce0d3;border-radius:12px;background:#fff;box-shadow:0 5px 15px #263e4210}.album:hover{box-shadow:0 14px 32px #263e4230}@media(prefers-reduced-motion:reduce){.album{transition:none}}.album img{width:100%;height:auto;display:block;border-radius:5px}.album h3{font-size:15px;letter-spacing:.5px;margin:14px 0 5px}.album p{font-size:10px;color:#73806a;margin:7px 0 12px}.price{font-size:13px;font-weight:bold}.buy-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.add{background:#edf1e6;border:1px solid #c8d2bb;border-radius:5px;padding:8px;font-size:10px;color:#265c42;cursor:pointer}.add:hover{background-color:#163c2a;color:white}#contact{margin:0 30px 30px;padding:24px;background:#edf0e4;border-radius:10px}#contact h2{font-size:19px}#contact label{display:block;font-size:12px;margin:15px 0 7px}textarea{width:100%;display:block}#contact button{margin-top:12px;padding:10px 20px;background:#265c42;color:white;border:0;border-radius:5px}footer{text-align:center;border-top:1px solid #dce0d3;padding:24px;font-size:10px;color:#708064}.cart-panel{background:#edf1e6;padding:20px;margin:15px 30px;border:1px solid #bbc8af;border-radius:8px}.cart-panel li{margin:10px 0}.cart-panel button{padding:5px;margin-left:10px}button,a{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #a76534;outline-offset:3px}[hidden]{display:none!important}@media(min-width:1050px){.album-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:500px){.hero h1{font-size:32px}.hero{padding:30px 22px}.store-header{padding:18px}.store-header nav{display:none}.section-head{display:block}.search{margin-top:16px}.album-grid{gap:10px}#albums{padding:22px}.album{padding:9px}.buy-row{display:block}.add{margin-top:10px;width:100%}}`;
const markup=`<header class="store-header"><div class="logo">SIDE A<span style="font-size:10px"> ®</span></div><nav><a href="#albums">所有專輯</a><a href="#contact">聯絡我們</a></nav><button type="button" id="cart">購物車（0）</button></header><section class="hero"><span class="tag">FOR THE LOVE OF MUSIC</span><h1>把喜歡，<br>收藏成一張唱片。</h1><p>為每一種心情，找到一張專輯。<br>獻給每一位認真喜歡音樂的你。</p><a href="#albums">探索本週精選 ↗</a></section><div id="cart-panel" class="cart-panel" hidden><h2>你的收藏清單</h2><ul id="cart-list"></ul><p id="cart-total"></p><p>教學展示，沒有結帳與付款功能。</p></div><section id="albums"><div class="section-head"><div><h2>本週精選</h2><span class="muted">A SOUNDTRACK FOR EVERY MOOD.</span></div><div class="search"><label for="search">找一張專輯</label><input id="search" type="search" placeholder="搜尋專輯或歌手"></div></div><div class="filters"><button type="button" class="active" data-category="all">全部專輯</button><button type="button" data-category="group">偶像團體</button><button type="button" data-category="solo">個人歌手</button></div><div class="album-grid">${albums.map(a=>`<article class="album" data-id="${a.id}" data-category="${a.category}"><img src="covers/${a.id}.svg" alt="${a.artist.split(' /')[0]} 的 ${a.name} 專輯封面" width="220" height="220"><h3>${a.name}</h3><p>${a.artist}</p><div class="buy-row"><span class="price">NT$ ${a.price}</span><button type="button" class="add" data-id="${a.id}">加入購物車 ＋</button></div></article>`).join('')}</div><p id="empty" hidden>找不到符合的專輯，試試其他關鍵字。</p><p id="status" role="status" aria-live="polite"></p></section><section id="contact"><h2>音樂，讓我們有話想說。</h2><p>推薦你的心頭好，或留下一點想法。</p><form id="feedback-form"><label for="message">想對我們說的話</label><textarea id="message" rows="3" required maxlength="300" placeholder="最近讓你單曲循環的是⋯"></textarea><button type="submit">送出留言 ↗</button><p id="feedback" role="status"></p></form></section><footer>© 2026 SIDE A RECORDS · 所有歌手與專輯皆為虛構 · 教學展示</footer>`;
const storeJS=`const albums = ${JSON.stringify(albums)};
const cartItems = [];
const search = document.querySelector('#search');
const form = document.querySelector('#feedback-form');
let category = 'all';
// 教學模擬函式，並非 Google 的真實 gtag。
function gtag(command, name, payload) {
  parent.postMessage({type:'lesson-event', name, payload}, location.origin === 'null' ? '*' : location.origin);
}
function updateCart() {
  document.querySelector('#cart').textContent = '購物車（' + cartItems.length + '）';
  const list = document.querySelector('#cart-list');
  list.replaceChildren();
  cartItems.forEach(function(album, index) {
    const li = document.createElement('li');
    li.textContent = album.name + ' · NT$ ' + album.price;
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = '移除';
    remove.addEventListener('click', function() {
      cartItems.splice(index,1); updateCart();
    });
    li.append(remove); list.append(li);
  });
  document.querySelector('#cart-total').textContent = cartItems.length ? '合計 NT$ ' + cartItems.reduce((sum,a)=>sum+a.price,0) : '購物車還是空的。';
}
function addToCart(album) {
  cartItems.push(album);
  updateCart();
  document.querySelector('#status').textContent = '已加入 ' + album.name + '！';
  gtag('event','add_to_cart',{currency:'TWD',value:album.price,items:[{item_id:album.id,item_name:album.name,price:album.price,quantity:1}]});
}
document.querySelectorAll('.add').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const album = albums.find(a=>a.id===btn.dataset.id);
    addToCart(album);
  });
});
document.querySelector('#cart').addEventListener('click',function(){
  const panel=document.querySelector('#cart-panel'); panel.hidden=!panel.hidden; updateCart();
});
function filterAlbums() {
  const keyword=search.value.trim().toLowerCase(); let count=0;
  document.querySelectorAll('.album').forEach(function(card){
    const match=card.textContent.toLowerCase().includes(keyword) && (category==='all'||card.dataset.category===category);
    if(match){card.hidden=false;count++;}else{card.hidden=true;}
  });
  document.querySelector('#empty').hidden=count!==0;
}
search?.addEventListener('input',function(event){
  filterAlbums();
  parent.postMessage({type:'lesson-event',name:'input（瀏覽器事件）',payload:{note:'即時搜尋已執行；不記錄輸入內容、不送出 GA'}},location.origin === 'null' ? '*' : location.origin);
});
document.querySelectorAll('[data-category]').forEach(function(btn){
  if(btn.tagName!=='BUTTON')return;
  btn.addEventListener('click',function(){category=btn.dataset.category;document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('active',b===btn));filterAlbums();});
});
form?.addEventListener('submit',function(event){
  event.preventDefault();
  const message=document.querySelector('#message');
  if(!message.value.trim()){message.setCustomValidity('請輸入留言內容');message.reportValidity();return;}
  document.querySelector('#feedback').textContent='留言已在本頁接收！這是示範，不會儲存或傳送。';
  parent.postMessage({type:'lesson-event',name:'submit（瀏覽器事件）',payload:{note:'已阻止預設跳頁；不記錄留言內容'}},location.origin === 'null' ? '*' : location.origin);
  form.reset();
});
document.querySelector('#message')?.addEventListener('input',function(){this.setCustomValidity('');});`;
function storeMarkup(standalone=false){
  const home=standalone?`0${stage}-${['','html','css','js'][stage]}.html`:['','index.html','css.html','js.html'][stage];
  const destination=page=>standalone?`0${stage}-${page}.html`:`${page}.html?stage=${stage}`;
  let content=markup.replace('<div class="logo">SIDE A<span style="font-size:10px"> ®</span></div>',`<a class="logo" href="${home}" target="_top" aria-label="SIDE A 商店首頁">SIDE A ®</a>`)
    .replace('<a href="#albums">所有專輯</a><a href="#contact">聯絡我們</a>',`<a href="${home}" target="_top">首頁</a> <a href="${destination('albums')}" target="_top"${storePage==='albums'?' aria-current="page"':''}>所有專輯</a> <a href="${destination('contact')}" target="_top"${storePage==='contact'?' aria-current="page"':''}>聯絡我們</a>`)
    .replace('<a href="#albums">探索本週精選 ↗</a>',`<a href="${destination('albums')}" target="_top">探索所有專輯 ↗</a>`);
  if(storePage!=='home'){
    const header=content.slice(0,content.indexOf('<section class="hero">'));
    const cart=content.slice(content.indexOf('<div id="cart-panel"'),content.indexOf('<section id="albums">'));
    const footer=content.slice(content.indexOf('<footer>'));
    const intro=storePage==='albums'?'<span class="tag">THE COLLECTION</span><h1>所有專輯</h1><p>為喜歡的聲音，留一個位置。探索團體與個人歌手的最新發行。</p>':'<span class="tag">LET’S TALK MUSIC</span><h1>聯絡我們</h1><p>關於專輯、收藏，或任何想分享的音樂故事，我們都想聽。</p>';
    const section=storePage==='albums'?content.slice(content.indexOf('<section id="albums">'),content.indexOf('<section id="contact">')):content.slice(content.indexOf('<section id="contact">'),content.indexOf('<footer>'));
    const info=storePage==='contact'?'<section class="contact-info"><article><h2>專輯與訂購</h2><p>想知道版本、曲目或預購方式？歡迎在下方留言提出問題。</p></article><article><h2>合作與推薦</h2><p>推薦你喜歡的聲音，也歡迎與 SIDE A 分享合作想法。</p></article></section>':'';
    content=header+`<section class="page-intro"><p><a href="${home}" target="_top">首頁</a> / ${storePage==='albums'?'所有專輯':'聯絡我們'}</p>${intro}</section>`+cart+info+section+footer;
  }
  return content.replace(' style="font-size:10px"','');
}
function sourceDoc(standalone=false){return '<!DOCTYPE html>\n<html lang="zh-Hant">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>'+({home:'Side A 唱片商店',albums:'所有專輯｜Side A',contact:'聯絡我們｜Side A'}[storePage])+'</title>\n'+(stage>=2?'<style>\n'+storeCSS+'\n</style>\n':'')+'</head>\n<body>\n'+storeMarkup(standalone)+(stage===3?'\n<script>\n'+storeJS+'\n<\/script>':'')+'\n</body>\n</html>';}

function openNotes(){ $('.side').hidden=false;$('#openMap').setAttribute('aria-expanded','true'); }
function showMap(){openNotes(); $('#topics').hidden=false;$('#detail').hidden=true;$('#mapTab').classList.add('active');$('#detailTab').classList.remove('active');}
function showDetail(t,locate=false){openNotes();selected=t;$('#topics').hidden=true;$('#detail').hidden=false;$('#mapTab').classList.remove('active');$('#detailTab').classList.add('active');$('#detail').innerHTML='<span class="pill">'+(htmlTopics.includes(t)||t[6]==='HTML'?'HTML':cssTopics.includes(t)?'CSS':'JAVASCRIPT')+'</span><h3>'+esc(t[1])+'</h3><b>'+t[2]+'</b><p>'+t[3]+'</p><pre>'+esc(t[4])+'</pre><p>'+(t[5]==='@document'?'這是文件層級語法，不是畫面上的獨立元素。可在原始碼最上方找到。':'位置：<code>'+esc(t[5])+'</code>。範例為聚焦語法的節錄，完整程式請看原始碼。')+'</p><button id="backMap">← 返回語法總覽</button>';$('#backMap').onclick=showMap;if(locate&&t[5]!=='@document'){const el=frame.contentDocument.querySelector(t[5]);if(el){const y=frame.getBoundingClientRect().top+window.scrollY+el.getBoundingClientRect().top-100;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});highlight(el);}}}
function highlight(el){frame.contentDocument.querySelectorAll('[data-selected]').forEach(n=>{n.style.outline='';n.removeAttribute('data-selected');});el.dataset.selected='true';el.style.outline='3px solid #d47d34';}
let frameObserver;
function initFrame(){const doc=frame.contentDocument;frameObserver?.disconnect();const fit=()=>{frame.style.height=Math.ceil(doc.documentElement.getBoundingClientRect().height)+'px';};fit();frameObserver=new ResizeObserver(fit);frameObserver.observe(doc.documentElement);let hover=null;doc.addEventListener('mouseover',e=>{if(!exploring)return;if(hover&&hover!==e.target)hover.style.boxShadow='';hover=e.target;hover.style.boxShadow='inset 0 0 0 2px #d47d34';},true);doc.addEventListener('mouseout',e=>{if(exploring)e.target.style.boxShadow='';},true);doc.addEventListener('click',e=>{if(!exploring)return;e.preventDefault();e.stopImmediatePropagation();const el=e.target;let t;if(stage===3)t=el.closest('.add')?jsTopics[4]:el.closest('#search')?jsTopics[5]:el.closest('#feedback-form')?jsTopics[7]:el.closest('#cart')?jsTopics[2]:null;if(stage===2)t=el.closest('.add')?cssTopics[11]:el.closest('.hero')?cssTopics[4]:el.closest('.album')?cssTopics[7]:null;if(!t)t=htmlTopics.find(x=>x[0]===el.tagName.toLowerCase())||[el.tagName.toLowerCase(),'<'+el.tagName.toLowerCase()+'>','目前選取的 HTML 元素','這是 '+el.tagName.toLowerCase()+' 元素。h2、h3 是次層標題；label 為輸入欄位提供名稱；form 將欄位組成表單；nav 放導覽連結。可在總覽學習本堂核心標籤。',el.outerHTML.slice(0,650),el.tagName.toLowerCase(),'HTML'];showDetail(t);highlight(el);},true);if(stage<3){doc.querySelector('form')?.addEventListener('submit',e=>e.preventDefault());}}
$('#topics').innerHTML=topics.map((t,i)=>'<button class="topic" data-topic="'+i+'"><code>'+esc(t[1])+'</code><span>'+t[2]+' ↗</span></button>').join('');$('#topics').onclick=e=>{const b=e.target.closest('[data-topic]');if(b)showDetail(topics[+b.dataset.topic],true);};
$('#mapTab').onclick=showMap;$('#detailTab').onclick=()=>showDetail(selected||topics[0]);
$('#inspect').onclick=()=>{exploring=!exploring;$('#inspect').classList.toggle('on',exploring);$('#inspect').setAttribute('aria-pressed',exploring);$('#inspect').textContent=exploring?'⌖ 探索中 · 點擊元素':'⌖ 開啟元素探索';$('#hint').textContent=exploring?'探索模式：點選商店元素，右側顯示語法解說。':hints[stage-1];if(!exploring)frame.contentDocument.querySelectorAll('[data-selected]').forEach(n=>n.style.outline='');};
const hints=['純 HTML · 內容與結構，保留瀏覽器預設樣式。','HTML + CSS · 試著將滑鼠移到購物按鈕上。','HTML + CSS + JS · 搜尋、分類、加入購物車與留言。'];
document.querySelectorAll('.step').forEach((link,i)=>{if(storePage!=='home')link.href=storePage+'.html?stage='+(i+1);});
$('#hint').textContent=hints[stage-1];document.querySelectorAll('.step')[stage-1].classList.add('active');document.querySelectorAll('.step')[stage-1].setAttribute('aria-current','page');

function load(){exploring=false;$('#inspect').classList.remove('on');$('#inspect').setAttribute('aria-pressed','false');$('#inspect').textContent='⌖ 開啟元素探索';$('#hint').textContent=hints[stage-1];logs=[];$('#events').textContent='等待互動：請關閉探索模式，再搜尋、加入購物車或送出留言。';frame.onload=initFrame;frame.srcdoc=sourceDoc();}$('#reset').onclick=load;load();
function receiveLessonEvent(e){
  // 綁定我們自己的商店視窗；離線 file 與 srcdoc 的 origin 可能不同。
  if(e.source!==frame.contentWindow||e.data?.type!=='lesson-event'||typeof e.data.name!=='string')return;
  logs.unshift(e.data);logs=logs.slice(0,20);
  $('#eventMonitor').hidden=false;$('#events').hidden=false;
  $('#collapseEvents').textContent='收合';$('#collapseEvents').setAttribute('aria-expanded','true');
  $('#events').textContent=logs.map((x,i)=>'#'+(logs.length-i)+' '+x.name+'\n'+JSON.stringify(x.payload,null,2)).join('\n\n');
}
window.addEventListener('message',receiveLessonEvent);
$('#openMap').onclick=showMap;
$('#closeNotes').onclick=()=>{$('.side').hidden=true;$('#openMap').setAttribute('aria-expanded','false');};
$('#openEvents').hidden=stage!==3;
$('#openEvents').onclick=()=>{$('#eventMonitor').hidden=false;$('#events').hidden=false;$('#collapseEvents').textContent='收合';$('#collapseEvents').setAttribute('aria-expanded','true');};
$('#closeEvents').onclick=()=>{$('#eventMonitor').hidden=true;};
$('#collapseEvents').onclick=()=>{const box=$('#events');box.hidden=!box.hidden;$('#collapseEvents').textContent=box.hidden?'展開':'收合';$('#collapseEvents').setAttribute('aria-expanded',String(!box.hidden));};
if(stage===3)$('#eventMonitor').hidden=false;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('.side').hidden=true;$('#openMap').setAttribute('aria-expanded','false');}});

const modal=$('#modal');$('#close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});$('#guide').onclick=()=>{$('#modalBody').innerHTML='<div class="eyebrow">TEACHER’S FIELD GUIDE</div><h2>一小時，做懂一間唱片商店。</h2><p>目標：分辨 HTML 結構、CSS 樣式與 JavaScript 行為，能讀懂一個按鈕如何回應點擊。</p><div class="timeline"><div><b>00–05 分</b><small>先看第 3 階段。搜尋、加入購物車，預告今天要拆解的成品。</small></div><div><b>05–20 分</b><small>第 1 階段：文件骨架 → 語意區塊 → 文字、圖片與表單。開啟探索模式逐一點選。</small></div><div><b>20–35 分</b><small>第 2 階段：顏色字型 → margin/padding → 邊框陰影 → :hover。來回切換比較。</small></div><div><b>35–55 分</b><small>第 3 階段：變數、DOM、條件 → 函式定義與呼叫 → click/input/submit → GA4 示範。</small></div></div><h3>55–60 分 · 學生說給你聽</h3><p>① 如果移除 CSS，內容還在嗎？<br>② 按鈕變色一定要 JS 嗎？<br>③ 函式定義之後，為什麼還要呼叫？<br>④ click 和 add_to_cart 是同一件事嗎？</p><p>操作提醒：探索模式會攔截點擊以顯示說明；先關閉探索，才可操作購物。文件層級語法從「語法總覽」開啟。HTML / CSS 階段沒有商店互動程式，表單送出由教學工具攔截以免意外跳頁。</p>';modal.showModal();};
