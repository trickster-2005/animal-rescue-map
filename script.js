// https://assets4.lottiefiles.com/packages/lf20_usmfx6bp.json

const loader = document.getElementById('loader');
const animation = lottie.loadAnimation({
  container: document.getElementById('lottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'Loader animation.json' // 免費示範動畫
});
loader.style.display = 'flex';


api_url = 'https://script.google.com/macros/s/AKfycbzf-qjoBqWzsaGfoLHGE30yv19votesp_tsQRP5iVdbDBkD8bkXCgVDFMM6x1UZv_Wt/exec'

// 初始化地圖
const mymap = L.map('mapid').setView([24.005, 121], 8);

// 加入底圖
const openStreetMap = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 12,
  }
).addTo(mymap);

// 預備放圖層群組
const groupLayers = {};
let currentLayer = null;

// 讀取 JSON 資料
fetch(api_url) 
  .then(res => res.json())
  .then(data => {
    Object.entries(data).forEach(([groupName, items]) => {
      const layerGroup = L.layerGroup();

      items.forEach(item => {
        if (!isNaN(item.lat) && !isNaN(item.lng)) {
          const marker = L.marker([item.lat, item.lng]);

          marker.bindTooltip(`<b>${item.name}</b>`, {
            permanent: false,
            direction: 'top',
            className: 'custom-tooltip'
          });

          marker.bindPopup(`
            <b>${item.name}</b><br>
            地址：${item.address || '無'}<br/>
            電話：${item.phone || '無'}
          `);

          // Marker hover 效果
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

    
    // 預設加入第一個群組
    const defaultGroupName = Object.keys(groupLayers)[0];
    if (defaultGroupName) {
      currentLayer = groupLayers[defaultGroupName].addTo(mymap);
    }

    // 自訂單選控制器（互斥切換圖層）
    const control = L.control({ position: 'bottomright' });
    control.onAdd = function () {
      const div = L.DomUtil.create('div', 'layer-control');
      // div.style.background = 'white';
      div.style.padding = '8px';
      div.style.border = '1px solid gray';

      Object.keys(groupLayers).forEach(name => {
        const btn = document.createElement('button');
        btn.innerText = name;
        btn.style.display = 'block';
        btn.style.marginBottom = '5px';
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
    console.error('無法載入 JSON：', err);
    loader.style.display = 'none'; // 出錯也隱藏
  });





  // right coner belowe popup
    document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("data-source-btn");
    const popup = document.getElementById("popup");
    const close = document.getElementById("popup-close");

    btn.addEventListener("click", () => {
      popup.classList.toggle("popup-hidden");
    });

    close.addEventListener("click", () => {
      popup.classList.add("popup-hidden");
    });

    // 點擊外部自動關閉（選擇性功能）
    document.addEventListener("click", function (e) {
      if (!popup.contains(e.target) && e.target !== btn) {
        popup.classList.add("popup-hidden");
      }
    });
  });