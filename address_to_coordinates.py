# 你的 Google Maps API 金鑰
import pandas as pd
import requests
import time
import os
from dotenv import load_dotenv


# === 基本設定 ===
# API_KEY = '你的API金鑰'  # ← 替換為你的 Google Maps API 金鑰
INPUT_FILE = '單位地址.xlsx'
OUTPUT_FILE = '轉換後結果.xlsx'
load_dotenv()
API_KEY = os.getenv("API_KEY")
GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

# === 讀取所有工作表 ===
sheets = pd.read_excel(INPUT_FILE, sheet_name=None)

# === 處理每個工作表 ===
for sheet_name, df in sheets.items():
    print(f"\n🔍 處理工作表：{sheet_name}")

    # 確保有「經度」「緯度」欄
    if '經度' not in df.columns:
        df['經度'] = None
    if '緯度' not in df.columns:
        df['緯度'] = None

    # 處理每一筆地址
    for i, row in df.iterrows():
        address = row.get('地址')
        if pd.isna(address):
            continue

        # 查詢地址
        params = {
            'address': address,
            'key': API_KEY
        }
        try:
            response = requests.get(GEOCODE_URL, params=params)
            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'OK':
                    location = data['results'][0]['geometry']['location']
                    df.at[i, '緯度'] = location['lat']
                    df.at[i, '經度'] = location['lng']
                    print(f"✅ {address} → ({location['lat']}, {location['lng']})")
                else:
                    print(f"⚠️ 地址查詢失敗：{address} - {data['status']}")
            else:
                print(f"❌ HTTP 錯誤：{response.status_code}")
        except Exception as e:
            print(f"❌ 發生錯誤：{e}")

        time.sleep(0.2)  # 等待，避免 API 限流

    # 更新工作表
    sheets[sheet_name] = df

# === 寫回所有工作表 ===
with pd.ExcelWriter(OUTPUT_FILE, engine='openpyxl') as writer:
    for sheet_name, df in sheets.items():
        df.to_excel(writer, sheet_name=sheet_name, index=False)

print(f"\n🎉 所有地址已轉換並寫入：{OUTPUT_FILE}")
