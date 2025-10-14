import pandas as pd
import requests, time, os, json
from dotenv import load_dotenv

# === 基本設定 ===
INPUT_FILE = '單位地址.xlsx'
JSON_OUTPUT_FILE = 'data.json'

load_dotenv()
API_KEY = os.getenv("API_KEY")
GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
# === 讀取所有工作表 ===

sheets = pd.read_excel(INPUT_FILE, sheet_name=None)
all_groups = {}

# === 處理每個工作表 ===
for sheet_name, df in sheets.items():
    print(f"\n🔍 處理工作表：{sheet_name}")

    # 確保欄位存在
    if '經度' not in df.columns:
        df['經度'] = None
    if '緯度' not in df.columns:
        df['緯度'] = None

    group = []

    for i, row in df.iterrows():
        try:
            # 嘗試從原始資料中讀取（跳過缺漏）
            address = str(row.get('地址', '')).strip()
            name = str(row.get('名稱', '')).strip()
            phone = str(row.get('電話', '')).strip()

            if not address:
                continue

            # 查詢經緯度
            params = {'address': address, 'key': API_KEY}
            response = requests.get(GEOCODE_URL, params=params)
            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'OK':
                    location = data['results'][0]['geometry']['location']
                    lat, lng = location['lat'], location['lng']
                    df.at[i, '緯度'] = lat
                    df.at[i, '經度'] = lng
                    print(f"✅ {address} → ({lat}, {lng})")
                else:
                    print(f"⚠️ 查詢失敗：{address} - {data['status']}")
                    continue
            else:
                print(f"❌ HTTP 錯誤：{response.status_code}")
                continue

            # 加入 JSON group
            group.append({
                "lat": lat,
                "lng": lng,
                "name": name,
                "address": address,
                "phone": phone
            })

            time.sleep(0.2)

        except Exception as e:
            print(f"❌ 發生錯誤：{e}")
            continue

    sheets[sheet_name] = df
    all_groups[sheet_name] = group

# === 寫回 Excel ===
with pd.ExcelWriter(INPUT_FILE, engine='openpyxl', mode='w') as writer:
    for sheet_name, df in sheets.items():
        df.to_excel(writer, sheet_name=sheet_name, index=False)
print(f"\n📄 Excel 完成：{INPUT_FILE}")

# === 寫回 JSON ===
with open(JSON_OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_groups, f, ensure_ascii=False, indent=2)
print(f"🗂️ JSON 輸出完成：{JSON_OUTPUT_FILE}")
