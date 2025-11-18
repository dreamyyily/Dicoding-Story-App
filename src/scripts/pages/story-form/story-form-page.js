import { addStory } from '../../model.js';
import { initMap } from '../../utils/map.js';

export default class StoryFormPage {
  async render() {
    this.loadStoryFormPageStyles();
    return `
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
    `;
  }

  loadStoryFormPageStyles() {
    if (document.getElementById('story-form-style')) return;
    
    const link = document.createElement('link');
    link.id = 'story-form-style';
    link.rel = 'stylesheet';
    link.href = './styles/story-form-style.css';
    document.head.appendChild(link);
  }

  async afterRender() {
    if (window.currentStoryMarker) {
    window.currentStoryMarker.remove();
    window.currentStoryMarker = null;
  }
  document.getElementById('latDisplay').textContent = '-';
  document.getElementById('lonDisplay').textContent = '-';
  document.getElementById('lat').value = '';
  document.getElementById('lon').value = '';

  this.initCamera();
  this.initMap();
  this.setupEventListeners();
  }

  setupEventListeners() {
    const form = document.getElementById('storyForm');
    const photoInput = document.getElementById('photo');
    const previewSection = document.getElementById('previewSection');
    const previewImg = document.getElementById('preview');
    const removePreviewBtn = document.getElementById('removePreview');

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.showImagePreview(URL.createObjectURL(file));
      }
    });

    removePreviewBtn.addEventListener('click', () => {
      this.hideImagePreview();
      photoInput.value = '';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmit();
    });
  }

  initCamera() {
    const cameraBtn = document.getElementById('camera');
    const cancelCameraBtn = document.getElementById('cancelCamera');
    const captureBtn = document.getElementById('captureBtn');
    const video = document.getElementById('cam');
    const canvas = document.getElementById('canvas');
    const cameraSection = document.getElementById('cameraSection');
    const previewSection = document.getElementById('previewSection');

    let stream = null;

    cameraBtn.addEventListener('click', async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        video.srcObject = stream;
        cameraSection.hidden = false;
        cameraBtn.disabled = true;
      } catch (err) {
        alert('Tidak dapat mengakses kamera: ' + err.message);
      }
    });

    cancelCameraBtn.addEventListener('click', () => {
      this.stopCamera(stream);
      cameraSection.hidden = true;
      cameraBtn.disabled = false;
    });

    captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
      
      this.showImagePreview(canvas.toDataURL('image/jpeg'));
      this.stopCamera(stream);
      cameraSection.hidden = true;
      cameraBtn.disabled = false;
    });
  }

  stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  showImagePreview(src) {
    const previewSection = document.getElementById('previewSection');
    const previewImg = document.getElementById('preview');
    
    previewImg.src = src;
    previewSection.hidden = false;
  }

  hideImagePreview() {
    const previewSection = document.getElementById('previewSection');
    previewSection.hidden = true;
  }

    initMap() {
    const { map } = initMap('map', (latlng) => {
      const lat = latlng.lat.toFixed(6);
      const lon = latlng.lng.toFixed(6);
      
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lon;
      document.getElementById('latDisplay').textContent = lat;
      document.getElementById('lonDisplay').textContent = lon;

      if (window.currentStoryMarker) {
        map.removeLayer(window.currentStoryMarker);
      }
      window.currentStoryMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup('<strong>Lokasi cerita dipilih!</strong><br>Klik lagi untuk ganti lokasi.')
        .openPopup();

      map.setView([lat, lon], 13);
    });

    map.setView([-2.5, 118], 5);
  }

  async handleFormSubmit() {
    const form = document.getElementById('storyForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoading.hidden = false;

    const formData = new FormData();
    formData.append('description', document.getElementById('desc').value.trim());
    formData.append('lat', document.getElementById('lat').value);
    formData.append('lon', document.getElementById('lon').value);

    const fileInput = document.getElementById('photo');
    const previewImg = document.getElementById('preview');
    
    let photoFile;
    if (fileInput.files[0]) {
      photoFile = fileInput.files[0];
    } else if (previewImg.src && previewImg.src.startsWith('data:')) {
      photoFile = this.dataURLtoFile(previewImg.src, 'story_photo.jpg');
    } else {
      alert('Silakan tambahkan foto terlebih dahulu');
      this.resetSubmitButton(submitBtn, btnText, btnLoading);
      return;
    }

    formData.append('photo', photoFile);

    try {
      await addStory(formData);
      alert('Cerita berhasil ditambahkan!');
      window.location.hash = '/';
    } catch (err) {
      alert('Gagal menambahkan cerita: ' + err.message);
      this.resetSubmitButton(submitBtn, btnText, btnLoading);
    }
  }

  resetSubmitButton(submitBtn, btnText, btnLoading) {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }
}