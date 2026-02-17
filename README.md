
### [網站 Link](https://trickster-2005.github.io/animal-rescue-map)

## 製作動機與目的

在台灣需要救援的野生動物，並沒有一個統一的單位或協會單獨負責救傷，而是必須根據不同類型（如哺乳類、兩棲爬蟲類、鳥類、外來種等）分別至不同單位尋求協助與救傷。

注意到目前雖有許多公開資訊，卻尚未有地圖將其整理、標註，因此本網站旨在於整合[野生動物急救站官方網站](https://www.tbri.gov.tw/WRRC/)所製作與編輯的表單[全台救援單位聯絡表單](https://docs.google.com/spreadsheets/d/1RZIaNJx7rapR8vnOtVPdFJOIjyTrcwu0qMR7it9CX7E/edit?usp=sharing)，建立一互動地圖根據不同類型分別顯示救傷單位地址與聯絡資訊。

本網站已建立好[Google Sheet](https://docs.google.com/spreadsheets/d/1HIcS7Fam7K_gxX_HqXR0XtG6Jox6P6-bIywGP2W-Ats/edit?usp=sharing)表單串接至地圖上，原先期待運用公民社會的力量，開放給公眾編輯、新增、刪除，使資訊能夠更完善與即時，但考量到目前尚未建立一妥善機制確保資訊正確性，暫時尚未公開供大眾編輯。


## 技術細節
A. 將由野生動物急救官方所製作的「全台救援單位聯絡表單」運用 Pyhton 根據地址轉成經緯度，並取得地址、名稱、縣市等資料，整理成另一表單。

B. 讀取表單，使用 leaflet 呈現在地圖上。



