var I=n=>{throw TypeError(n)};var v=(n,e,t)=>e.has(n)||I("Cannot "+t);var c=(n,e,t)=>(v(n,e,"read from private field"),t?t.call(n):e.get(n)),p=(n,e,t)=>e.has(n)?I("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),y=(n,e,t,a)=>(v(n,e,"write to private field"),a?a.call(n,t):e.set(n,t),t),g=(n,e,t)=>(v(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const f={BASE_URL:"https://story-api.dicoding.dev/v1"};async function T(n,e){const t=await fetch(`${f.BASE_URL}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:e})}),a=await t.json();if(!t.ok)throw new Error(a.message);return localStorage.setItem("token",a.loginResult.token),a}async function D(n,e,t){const a=await fetch(`${f.BASE_URL}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:e,password:t})}),i=await a.json();if(!a.ok)throw new Error(i.message);return i}async function M(){const n=localStorage.getItem("token"),t=await(await fetch(`${f.BASE_URL}/stories`,{headers:{Authorization:`Bearer ${n||""}`}})).json();if(t.error===!0)throw new Error(t.message||"Gagal mengambil data cerita");return Array.isArray(t.listStory)?t.listStory:[]}async function F(n){const e=localStorage.getItem("token"),a=await(await fetch(`${f.BASE_URL}/stories`,{method:"POST",headers:{Authorization:`Bearer ${e}`},body:n})).json();if(a.error===!0)throw new Error(a.message||"Gagal menambah cerita");return a}let b=null;function P(n,e){const t=document.getElementById(n);t._leaflet_id&&(t._leaflet_id=null,t.innerHTML="");const a=L.map(n).setView([-2.5,118],5),i=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}),r=L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",{attribution:"&copy; Stadia Maps"});return i.addTo(a),L.control.layers({"Peta Jalan":i,Satelit:r}).addTo(a),a.on("click",s=>{b&&a.removeLayer(b),b=L.marker(s.latlng).addTo(a).bindPopup("Lokasi dipilih!<br>Klik lagi untuk ganti.").openPopup(),e(s.latlng)}),setTimeout(()=>a.invalidateSize(),200),{map:a}}class ${async render(){return this.loadHomeStyles(),`
    <section class="container home-page">
      <!-- HANYA 1 H1 DI SINI -->
      <h1 class="page-title">Daftar Cerita</h1>
      <p class="page-subtitle">Daftar semua cerita pengguna</p>

      <!-- LABEL UNTUK INPUT CARI -->
      <label for="filter" class="visually-hidden">
        Cari cerita berdasarkan nama atau deskripsi
      </label>
      <input 
        type="text" 
        id="filter" 
        placeholder="Cari cerita..." 
        class="search-input"
        aria-label="Cari ceritaberdasarkan nama atau deskripsi"
      />

      <div class="content-layout">
        <!-- BAGIAN KIRI: LIST CERITA -->
        <section class="stories-section" aria-labelledby="stories-heading">
          <h2 id="stories-heading" class="section-title">Daftar Cerita</h2>
          <div id="story-list" class="story-list"></div>
        </section>

        <!-- BAGIAN KANAN: PETA -->
        <section class="map-section" aria-labelledby="map-heading">
          <h2 id="map-heading" class="section-title">Peta Lokasi Cerita</h2>
          <div id="map" class="map-container"></div>
        </section>
      </div>
    </section>
  `}loadHomeStyles(){if(document.getElementById("home-styles"))return;const e=document.createElement("link");e.id="home-styles",e.rel="stylesheet",e.href="./styles/home-style.css",document.head.appendChild(e)}async afterRender(){try{const e=await M();this.renderStories(e),this.initMap(e),this.initFilter(e)}catch(e){console.error("Error loading stories:",e),document.getElementById("story-list").innerHTML="<p>Gagal memuat cerita.</p>"}}renderStories(e){const t=document.getElementById("story-list");if(!e||e.length===0){t.innerHTML='<p class="no-stories">Tidak ada cerita ditemukan.</p>';return}t.innerHTML=e.map(a=>{const i=new Date(a.createdAt).toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});return`
      <article class="story-card" tabindex="0">
        <img 
          src="${a.photoUrl}" 
          alt="Foto cerita dari ${a.name}" 
          class="story-image"
          loading="lazy"
        />
        
        <!-- PASTIKAN ADA DIV INI! -->
        <div class="story-content">
          <h3 class="story-title">${a.name}</h3>
          <time class="story-date" datetime="${a.createdAt}">${i}</time>
          <p class="story-desc">${a.description}</p>
        </div>
      </article>
    `}).join("")}initMap(e){const{map:t}=P("map",()=>{});e.forEach(a=>{a.lat&&a.lon?L.marker([a.lat,a.lon]).addTo(t).bindPopup(`
          <div class="map-popup">
            <h4>${a.name}</h4>
            <p>${a.description}</p>
            ${a.photoUrl?`<img src="${a.photoUrl}" alt="${a.name}" style="max-width: 150px;" />`:""}
          </div>
        `):console.warn(`Cerita ${a.name} tidak memiliki lat/lon yang valid`)})}initFilter(e){document.getElementById("filter").addEventListener("input",a=>{const i=a.target.value.toLowerCase().trim(),r=e.filter(s=>s.name.toLowerCase().includes(i)||s.description.toLowerCase().includes(i));this.renderStories(r)})}}class E{constructor(e=!1){this.isRegister=e}async render(){return`
      <section class="container">
        <h1>${this.isRegister?"Daftar":"Masuk"}</h1>

        <form id="auth-form" aria-describedby="auth-desc">
          <p id="auth-desc" class="visually-hidden">
            Form untuk ${this.isRegister?"mendaftar akun baru":"masuk ke aplikasi"}.
          </p>

          <fieldset>
            <legend class="visually-hidden">
              ${this.isRegister?"Form pendaftaran":"Form login"}
            </legend>

            ${this.isRegister?`
              <div class="form-group">
                <label for="name">Nama</label>
                <input type="text" id="name" name="name" required autocomplete="name"/>
              </div>
            `:""}

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required autocomplete="email"/>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                autocomplete="${this.isRegister?"new-password":"current-password"}"
              />
            </div>
          </fieldset>

          <button 
            type="submit" 
            aria-label="${this.isRegister?"Daftar akun":"Masuk ke akun"}"
            class="btn-submit"
          >
            ${this.isRegister?"Daftar":"Masuk"}
          </button>
        </form>

        <p>
          ${this.isRegister?'Sudah punya akun? <a href="#/login">Masuk</a>':'Belum punya akun? <a href="#/register">Daftar</a>'}
        </p>
      </section>
    `}async afterRender(){document.getElementById("auth-form").addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("email").value,a=document.getElementById("password").value,i=this.isRegister?document.getElementById("name").value:null;try{this.isRegister?await D(i,t,a):await T(t,a),window.location.hash="/"}catch(r){alert(r.message)}})}}class x{async render(){return this.loadStoryFormPageStyles(),`
      <section class="container">
        <div class="form-header">
          <h1 class="form-title">Tambah Cerita Baru</h1>
          <h2 class="visually-hidden">Formulir untuk menambahkan cerita baru dengan foto dan lokasi</h2>
          <p class="form-subtitle">Bagikan pengalaman dan momen berharga Anda</p>
        </div>
        
        <form id="storyForm" class="story-form">
          <!-- Deskripsi Section -->
          <div class="form-section">
            <label for="desc" class="form-label">Cerita Anda</label>
            <textarea 
              id="desc" 
              class="form-textarea" 
              placeholder="Tuliskan cerita atau pengalaman Anda di sini..." 
              rows="5"
              required
            ></textarea>
          </div>

          <!-- Foto Section -->
          <div class="form-section">
            <label for="photo" class="form-label">Foto</label>
            <div class="photo-options">
              <div class="file-upload-wrapper">
                <input type="file" id="photo" accept="image/*" class="file-input" />
                <label for="photo" class="upload-btn">
                  <span class="btn-text">Unggah Foto</span>
                </label>
              </div>
              
              <button type="button" id="camera" class="camera-btn">
                <span class="btn-text">Ambil Foto</span>
              </button>
            </div>

            <!-- Camera Preview -->
            <div class="camera-section" id="cameraSection" hidden>
              <video id="cam" class="camera-preview" autoplay playsinline></video>
              <div class="camera-controls">
                <button type="button" id="captureBtn" class="capture-btn">Ambil Gambar</button>
                <button type="button" id="cancelCamera" class="cancel-btn">Batal</button>
              </div>
            </div>

            <!-- Image Preview -->
            <div class="preview-section" id="previewSection" hidden>
              <img id="preview" class="image-preview" />
              <button type="button" id="removePreview" class="remove-btn">Hapus</button>
            </div>
            
            <canvas id="canvas" hidden></canvas>
          </div>

          <!-- Lokasi Section -->
          <div class="form-section">
            <label class="form-label">Lokasi</label>
            
            <p id="map-desc" class="map-instruction">
              Klik peta untuk memilih lokasi cerita Anda
            </p>

            <div 
              id="map" 
              class="map-container"
              role="application"
              aria-label="Peta interaktif untuk memilih lokasi cerita"
              aria-describedby="map-desc"
            ></div>

            <!-- Koordinat -->
            <div class="coordinates">
              <div class="coordinate-item">
                <label for="latDisplay">Latitude:</label>
                <span id="latDisplay" aria-live="polite">-</span>
                <input type="hidden" id="lat" name="lat">
              </div>
              <div class="coordinate-item">
                <label for="lonDisplay">Longitude:</label>
                <span id="lonDisplay" aria-live="polite">-</span>
                <input type="hidden" id="lon" name="lon">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" aria-label="Kirim cerita">
              <span class="btn-text">Kirim Cerita</span>
              <span class="btn-loading" hidden>Loading...</span>
            </button>
          </div>
        </form>
      </section>
    `}loadStoryFormPageStyles(){if(document.getElementById("story-form-style"))return;const e=document.createElement("link");e.id="story-form-style",e.rel="stylesheet",e.href="./styles/story-form-style.css",document.head.appendChild(e)}async afterRender(){window.currentStoryMarker&&(window.currentStoryMarker.remove(),window.currentStoryMarker=null),document.getElementById("latDisplay").textContent="-",document.getElementById("lonDisplay").textContent="-",document.getElementById("lat").value="",document.getElementById("lon").value="",this.initCamera(),this.initMap(),this.setupEventListeners()}setupEventListeners(){const e=document.getElementById("storyForm"),t=document.getElementById("photo");document.getElementById("previewSection"),document.getElementById("preview");const a=document.getElementById("removePreview");t.addEventListener("change",i=>{const r=i.target.files[0];r&&this.showImagePreview(URL.createObjectURL(r))}),a.addEventListener("click",()=>{this.hideImagePreview(),t.value=""}),e.addEventListener("submit",async i=>{i.preventDefault(),await this.handleFormSubmit()})}initCamera(){const e=document.getElementById("camera"),t=document.getElementById("cancelCamera"),a=document.getElementById("captureBtn"),i=document.getElementById("cam"),r=document.getElementById("canvas"),s=document.getElementById("cameraSection");document.getElementById("previewSection");let o=null;e.addEventListener("click",async()=>{try{o=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),i.srcObject=o,s.hidden=!1,e.disabled=!0}catch(u){alert("Tidak dapat mengakses kamera: "+u.message)}}),t.addEventListener("click",()=>{this.stopCamera(o),s.hidden=!0,e.disabled=!1}),a.addEventListener("click",()=>{r.width=i.videoWidth,r.height=i.videoHeight,r.getContext("2d").drawImage(i,0,0),this.showImagePreview(r.toDataURL("image/jpeg")),this.stopCamera(o),s.hidden=!0,e.disabled=!1})}stopCamera(e){e&&e.getTracks().forEach(t=>t.stop())}showImagePreview(e){const t=document.getElementById("previewSection"),a=document.getElementById("preview");a.src=e,t.hidden=!1}hideImagePreview(){const e=document.getElementById("previewSection");e.hidden=!0}initMap(){const{map:e}=P("map",t=>{const a=t.lat.toFixed(6),i=t.lng.toFixed(6);document.getElementById("lat").value=a,document.getElementById("lon").value=i,document.getElementById("latDisplay").textContent=a,document.getElementById("lonDisplay").textContent=i,window.currentStoryMarker&&e.removeLayer(window.currentStoryMarker),window.currentStoryMarker=L.marker([a,i]).addTo(e).bindPopup("<strong>Lokasi cerita dipilih!</strong><br>Klik lagi untuk ganti lokasi.").openPopup(),e.setView([a,i],13)});e.setView([-2.5,118],5)}async handleFormSubmit(){const t=document.getElementById("storyForm").querySelector(".submit-btn"),a=t.querySelector(".btn-text"),i=t.querySelector(".btn-loading");t.disabled=!0,a.hidden=!0,i.hidden=!1;const r=new FormData;r.append("description",document.getElementById("desc").value.trim()),r.append("lat",document.getElementById("lat").value),r.append("lon",document.getElementById("lon").value);const s=document.getElementById("photo"),o=document.getElementById("preview");let u;if(s.files[0])u=s.files[0];else if(o.src&&o.src.startsWith("data:"))u=this.dataURLtoFile(o.src,"story_photo.jpg");else{alert("Silakan tambahkan foto terlebih dahulu"),this.resetSubmitButton(t,a,i);return}r.append("photo",u);try{const k=await F(r);"serviceWorker"in navigator&&"PushManager"in window&&navigator.serviceWorker.ready.then(R=>{R.active.postMessage({type:"NEW_STORY",payload:{title:"Cerita Baru!",body:`"${document.getElementById("desc").value.trim().substring(0,50)}..."`,icon:"/icons/icon-192.png",url:"/"}})}),alert("Cerita berhasil ditambahkan!"),window.location.hash="/"}catch(k){alert("Gagal menambahkan cerita: "+k.message),this.resetSubmitButton(t,a,i)}}resetSubmitButton(e,t,a){e.disabled=!1,t.hidden=!1,a.hidden=!0}dataURLtoFile(e,t){const a=e.split(","),i=a[0].match(/:(.*?);/)[1],r=atob(a[1]);let s=r.length;const o=new Uint8Array(s);for(;s--;)o[s]=r.charCodeAt(s);return new File([o],t,{type:i})}}function S(){return location.hash.replace("#","")||"/"}class O{async render(){return this.loadProfileStyles(),`
      <section class="container" aria-labelledby="profile-heading">
        <h1 id="profile-heading">Profil Pengguna</h1>

        ${!!localStorage.getItem("token")?this.renderLoggedInView():this.renderLoggedOutView()}
      </section>
    `}loadProfileStyles(){if(document.getElementById("profile-styles"))return;const e=document.createElement("link");e.id="profile-styles",e.rel="stylesheet",e.href="./styles/profile-style.css",e.type="text/css",document.head.appendChild(e)}renderLoggedInView(){return`
      <div class="profile-info" role="region" aria-label="Status login pengguna">
        <p class="status-info">
          <strong>Status:</strong> 
          <span class="status-login" aria-live="polite">Login (terautentikasi)</span>
        </p>
        
        <button 
          id="logout-btn" 
          class="btn-logout" 
          type="button"
          aria-label="Keluar dari akun"
        >
          Logout
        </button>
      </div>
    `}renderLoggedOutView(){return`
      <div class="login-prompt" role="alert">
        <p>Kamu belum login.</p>
        <div class="auth-links">
          <a href="#/login" class="auth-link">Masuk</a>
          <span aria-hidden="true"> | </span>
          <a href="#/register" class="auth-link">Daftar</a>
        </div>
      </div>
    `}async afterRender(){const e=document.getElementById("logout-btn");e&&e.addEventListener("click",()=>{confirm("Yakin ingin logout?")&&(localStorage.removeItem("token"),alert("Berhasil logout!"),window.location.hash="/login")})}}const B={"/":()=>new $,"/login":()=>new E(!1),"/register":()=>new E(!0),"/add":()=>new x,"/profile":()=>new O};var h,m,d,l,A,w,C;class N{constructor({navigationDrawer:e,drawerButton:t,content:a}){p(this,l);p(this,h,null);p(this,m,null);p(this,d,null);y(this,h,a),y(this,m,t),y(this,d,e),g(this,l,A).call(this),g(this,l,C).call(this)}async renderPage(){const e=S(),a=(B[e]||B["/"])();c(this,h).innerHTML=await a.render(),await a.afterRender()}}h=new WeakMap,m=new WeakMap,d=new WeakMap,l=new WeakSet,A=function(){c(this,m).addEventListener("click",()=>{c(this,d).classList.toggle("open")}),document.body.addEventListener("click",e=>{!c(this,d).contains(e.target)&&!c(this,m).contains(e.target)&&c(this,d).classList.remove("open")})},w=function(){const e=localStorage.getItem("token"),t=S();return["/","/add","/profile"].includes(t)&&!e?(window.location.hash="/login",!1):e&&(t==="/login"||t==="/register")?(window.location.hash="/",!1):!0},C=function(){window.addEventListener("hashchange",()=>{g(this,l,w).call(this)&&this.renderPage()}),window.addEventListener("load",()=>{g(this,l,w).call(this)&&this.renderPage()})};new N({navigationDrawer:document.getElementById("navigation-drawer"),drawerButton:document.getElementById("drawer-button"),content:document.getElementById("main-content")});"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(n=>{console.log("Service Worker registered:",n),U(n)}).catch(n=>console.error("SW registration failed:",n));function U(n){const e=document.getElementById("push-toggle");e&&(n.pushManager.getSubscription().then(t=>{e.checked=!!t}),e.addEventListener("click",async()=>{if(e.checked)try{const a=await(await fetch("/vapid-public-key")).text(),i=K(a),r=await n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:i});await fetch("/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),alert("Berhasil berlangganan notifikasi!")}catch(t){e.checked=!1,alert("Gagal berlangganan: "+t.message)}else try{const t=await n.pushManager.getSubscription();t&&(await fetch("/unsubscribe",{method:"POST",body:JSON.stringify(t)}),await t.unsubscribe()),alert("Berhenti berlangganan notifikasi")}catch(t){console.error(t)}}))}function K(n){const e="=".repeat((4-n.length%4)%4),t=(n+e).replace(/-/g,"+").replace(/_/g,"/"),a=window.atob(t);return Uint8Array.from([...a].map(i=>i.charCodeAt(0)))}
