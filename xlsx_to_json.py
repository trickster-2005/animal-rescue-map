import pandas as pd
import json

# 設定檔案路徑
input_file = "轉換後結果.xlsx"
output_file = "data.json"

# 讀取所有工作表（dictionary 結構）
sheets = pd.read_excel(input_file, sheet_name=None)

# 用於儲存所有資料的字典
all_groups = {}

for sheet_name, df in sheets.items():
    group = []

    for _, row in df.iterrows():
        try:
            lng = float(row[0]) if not pd.isna(row[0]) else ""
            lat = float(row[1]) if not pd.isna(row[1]) else ""
            name = str(row[2]) if not pd.isna(row[2]) else ""
            address = str(row[3]) if not pd.isna(row[3]) else ""
            phone = str(row[4]) if not pd.isna(row[4]) else ""


            group.append({
                "lat": lat,
                "lng": lng,
                "name": name,
                "address": address,
                "phone": phone
            })
        except Exception as e:
            print(f"跳過一筆資料（錯誤: {e}）")
            continue

    # 加入該群組資料
    all_groups[sheet_name] = group

# 寫出為 JSON 檔案（UTF-8）
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(all_groups, f, ensure_ascii=False, indent=2)

print(f"✅ 已輸出 JSON：{output_file}")
