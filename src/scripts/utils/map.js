let currentMarker = null;

export function initMap(containerId, onClick) {
  const container = document.getElementById(containerId);

  if (container._leaflet_id) {
    container._leaflet_id = null;
    container.innerHTML = "";
  }

  const map = L.map(containerId).setView([-2.5, 118], 5);

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  const satellite = L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg',
    { attribution: '&copy; Stadia Maps' }
  );

  osm.addTo(map);
  L.control.layers({ 'Peta Jalan': osm, 'Satelit': satellite }).addTo(map);

  map.on('click', (e) => {
    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    currentMarker = L.marker(e.latlng)
      .addTo(map)
      .bindPopup('Lokasi dipilih!<br>Klik lagi untuk ganti.')
      .openPopup();

    onClick(e.latlng);
  });

  setTimeout(() => map.invalidateSize(), 200);

  return { map };
}
