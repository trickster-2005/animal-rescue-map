// 初始化地圖
const mymap = L.map('mapid').setView([23.7, 121], 8);

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
fetch('data.json') // ← 放在同一資料夾的 JSON 檔
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

          marker.addTo(layerGroup);
        }
      });

      groupLayers[groupName] = layerGroup;
    });

    
    // 預設加入第一個群組
    const defaultGroupName = Object.keys(groupLayers)[0];
    if (defaultGroupName) {
      currentLayer = groupLayers[defaultGroupName].addTo(mymap);
    }

    // 自訂單選控制器（互斥切換圖層）
    const control = L.control({ position: 'topright' });
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
  });
