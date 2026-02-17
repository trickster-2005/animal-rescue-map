/* ========================================
   WILDLIFE RESCUE MAP - Main Application
   ======================================== */

// ========== LOADER ANIMATION ==========
// Initialize Lottie animation for loading indicator
const loader = document.getElementById('loader');
const animation = lottie.loadAnimation({
  container: document.getElementById('lottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'Loader animation.json'
});
loader.style.display = 'flex';

// ========== API CONFIGURATION ==========
// Google Apps Script endpoint for fetching rescue unit data
const api_url = 'https://script.google.com/macros/s/AKfycbzf-qjoBqWzsaGfoLHGE30yv19votesp_tsQRP5iVdbDBkD8bkXCgVDFMM6x1UZv_Wt/exec';

// ========== MAP INITIALIZATION ==========
// Initialize Leaflet map with Taiwan center point and zoom level
const mymap = L.map('mapid').setView([24.005, 121], 8);

// Add OpenStreetMap tile layer
const openStreetMap = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 12,
  }
).addTo(mymap);

// ========== DATA MANAGEMENT ==========
// Store layer groups by category
const groupLayers = {};
let currentLayer = null;

// ========== FETCH AND PROCESS DATA ==========
fetch(api_url)
  .then(res => res.json())
  .then(data => {
    // Process each rescue unit category
    Object.entries(data).forEach(([groupName, items]) => {
      const layerGroup = L.layerGroup();

      // Add markers for each rescue unit
      items.forEach(item => {
        if (!isNaN(item.lat) && !isNaN(item.lng)) {
          const marker = L.marker([item.lat, item.lng]);

          // Add tooltip that shows on hover
          marker.bindTooltip(`<b>${item.name}</b>`, {
            permanent: false,
            direction: 'top',
            className: 'custom-tooltip'
          });

          // Add popup with unit information
          marker.bindPopup(`
            <b>${item.name}</b><br>
            地址：${item.address || '無'}<br/>
            電話：${item.phone || '無'}
          `);

          // Highlight popup title on marker hover
          marker.on('mouseover', function() {
            const popup = this.getPopup();
            if (popup) {
              popup._contentNode?.parentElement?.classList.add('marker-highlight');
            }
          });

          marker.on('mouseout', function() {
            const popup = this.getPopup();
            if (popup) {
              popup._contentNode?.parentElement?.classList.remove('marker-highlight');
            }
          });

          marker.addTo(layerGroup);
        }
      });

      groupLayers[groupName] = layerGroup;
      loader.style.display = 'none';
    });

    // ========== DEFAULT LAYER DISPLAY ==========
    // Show all categories by default
    const allMarkersLayer = L.layerGroup();
    Object.values(groupLayers).forEach(layer => {
      layer.eachLayer(marker => {
        marker.addTo(allMarkersLayer);
      });
    });
    currentLayer = allMarkersLayer.addTo(mymap);

    // ========== LAYER CONTROL ==========
    // Create category selector buttons
    const control = L.control({ position: 'bottomright' });
    control.onAdd = function () {
      const div = L.DomUtil.create('div', 'layer-control');
      div.style.padding = '8px';
      div.style.border = '1px solid gray';

      // Expand buttons on mobile devices
      const isMobile = window.innerWidth <= 480;
      if (isMobile) {
        div.classList.add('layer-control-mobile');
      }

      // Create "Show All" button
      const showAllBtn = document.createElement('button');
      showAllBtn.innerText = '全部';
      showAllBtn.style.display = 'block';
      showAllBtn.style.marginBottom = '5px';
      showAllBtn.style.fontWeight = 'bold';

      showAllBtn.onclick = () => {
        if (currentLayer) {
          mymap.removeLayer(currentLayer);
        }
        // Create a layer group containing all markers
        const allMarkersLayer = L.layerGroup();
        Object.values(groupLayers).forEach(layer => {
          layer.eachLayer(marker => {
            marker.addTo(allMarkersLayer);
          });
        });
        currentLayer = allMarkersLayer.addTo(mymap);
      };

      div.appendChild(showAllBtn);

      // Create button for each category
      Object.keys(groupLayers).forEach(name => {
        const btn = document.createElement('button');
        btn.innerText = name;
        btn.style.display = 'block';
        btn.style.marginBottom = '5px';

        // Switch layer on button click
        btn.onclick = () => {
          if (currentLayer) {
            mymap.removeLayer(currentLayer);
          }
          currentLayer = groupLayers[name].addTo(mymap);
        };

        div.appendChild(btn);
      });

      return div;
    };
    control.addTo(mymap);
  })
  .catch(err => {
    console.error('Failed to load data:', err);
    loader.style.display = 'none';
  });

// ========== UI INTERACTIONS ==========
// Handle data source info popup
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('data-source-btn');
  const popup = document.getElementById('popup');
  const close = document.getElementById('popup-close');

  // Toggle popup visibility
  btn.addEventListener('click', () => {
    popup.classList.toggle('popup-hidden');
  });

  // Close popup button
  close.addEventListener('click', () => {
    popup.classList.add('popup-hidden');
  });

  // Auto-close popup when clicking outside
  document.addEventListener('click', function (e) {
    if (!popup.contains(e.target) && e.target !== btn) {
      popup.classList.add('popup-hidden');
    }
  });
});