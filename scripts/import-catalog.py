#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate catalog-foods.ts, catalog-recipes.ts, and zh recipe locale snippets from nourish-catalog.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path("/workspace")
SRC = json.loads((ROOT / "src/lib/data/nourish-catalog.json").read_text())

GOAL_MAP = {
    "Weight management": "weight-management",
    "Healthy aging": "aging",
    "Heart health": "heart-health",
    "Everyday healthy": "general",
    "Blood sugar": "diabetes-friendly",
    "Budget": "general",
    "Muscle gain": "weight-management",
}
TAG_MAP = {
    "halal": "halal",
    "kosher": "kosher",
    "vegetarian": "vegetarian",
    "vegan": "vegan",
    "gluten-free": "gluten-free",
    "gluten-free option": "gluten-free",
    "dairy-free": "dairy-free",
    "nut-free": "nut-free",
    "low-sodium": "low-sodium",
    "high-protein": "high-protein",
    "halal option": "halal",
}
ALLERGEN_MAP = {
    "fish": "fish",
    "soy": "soy",
    "wheat": "wheat",
    "egg": "eggs",
    "eggs": "eggs",
    "milk": "dairy",
    "dairy": "dairy",
    "shellfish": "shellfish",
    "sesame": "sesame",
    "tree nuts": "tree-nuts",
    "peanut (dip)": "peanuts",
    "peanuts": "peanuts",
    "fish (fish sauce)": "fish",
}
GRADIENTS = [
    "from-emerald-700 via-lime-500 to-amber-200",
    "from-orange-700 via-amber-500 to-yellow-200",
    "from-sky-800 via-teal-500 to-lime-200",
    "from-rose-800 via-orange-500 to-amber-200",
    "from-indigo-800 via-violet-500 to-fuchsia-200",
    "from-stone-700 via-amber-600 to-orange-300",
]
VERDICT = {"strong": "strong choice", "situational": "situational", "limit": "limit often"}

# id -> {summary, pros, cons, tip}
ZH: dict[str, dict] = {}


def zh(fid: str, summary: str, pros: list[str], cons: list[str], tip: str) -> None:
    ZH[fid] = {"summary": summary, "pros": pros, "cons": cons, "tip": tip}


zh("char-siu-rice", "好吃又飽，但甜汁、肥叉燒和大份白飯加起來負擔不小。", ["豬肉有不錯的蛋白質"], ["醬汁偏甜偏鹹", "常常幾乎沒有蔬菜"], "可叫少汁，再另加一碟清炒青菜（少蠔油）。")
zh("roast-goose-rice", "味道濃郁偏肥，脂肪多半在皮上。", ["有蛋白質與鐵質"], ["鵝皮飽和脂肪高", "鈉偏高"], "撕掉皮、與人分享，並加一份蔬菜。")
zh("roast-pork-rice", "燒肉酥皮代表脂肪與鹽分都不低。", ["有蛋白質"], ["飽和脂肪高", "鈉偏高"], "可選瘦一點的燒味，或要半份。")
zh("wonton-noodle-soup", "熱量與蛋白質尚可，但湯底很鹹。", ["蝦有蛋白質", "熱量相對適中"], ["湯底鈉很高", "蔬菜少"], "湯別全喝完，另加一碟青菜。")
zh("beef-brisket-noodles", "牛腩偏肥，滷汁也很鹹。", ["有蛋白質與鐵質"], ["部位偏肥", "鈉很高"], "可改點瘦牛肉片，湯少喝。")
zh("baked-pork-chop-rice", "炸豬扒再加起司與甜番茄汁，蓋在大份飯上。", ["蛋白質偏高"], ["油炸又加起司", "飯量很大", "鈉偏高"], "可叫少飯、少起司，或與人分享。")
zh("ham-macaroni-soup", "早餐不算太重，但纖維少，火腿與湯偏加工、偏鹹。", ["暖胃、容易吃完"], ["加工肉", "湯底偏鹹"], "火腿可改蛋或雞肉，湯可少喝。")
zh("set-breakfast", "一餐早餐內容很多：加工肉、牛油多士，再加甜飲。", ["蛋可提供蛋白質"], ["香腸／餐肉偏加工", "牛油多士", "奶茶偏甜"], "保留蛋與粉麵，略過香腸與牛油，飲品叫少甜。")
zh("luncheon-meat-egg-noodles", "公仔麵加餐肉，又鹹又油。", ["蛋有蛋白質"], ["鈉很高", "加工肉", "麵偏油炸"], "可改米粉加蛋與青菜。")
zh("pineapple-bun-butter", "甜點級享受：甜皮再加厚牛油。", ["偶爾當獎勵可以"], ["飽和脂肪", "添加糖", "蛋白質低"], "可不要牛油，或一人分一個。")
zh("egg-tart", "份量小，但酥皮與甜蛋漿都不輕。", ["份量相對小"], ["酥皮油脂", "添加糖"], "吃一個就好，配清茶，別連吃三個。")
zh("french-toast", "炸麵包再加花生醬、牛油與糖漿。", ["主要是口感享受"], ["油炸", "糖漿與牛油", "花生過敏風險"], "與人分享，糖漿可略過。")
zh("hk-milk-tea", "偶爾可以；若天天加煉奶／淡奶與糖，負擔會累積。", ["有一些鈣"], ["添加糖", "咖啡因"], "可叫少甜或走甜。")
zh("iced-lemon-tea", "多半是糖漿；一杯就可能接近一日添加糖上限。", ["能補水"], ["添加糖很高"], "叫走甜或少甜，靠檸檬提味。")
zh("yuenyeung", "類似奶茶，咖啡因更高。", ["有一些鈣"], ["添加糖", "咖啡因偏高"], "少甜；若易失眠，下午三點後少喝。")
zh("congee-century-egg-pork", "清淡溫熱、熱量適中；主要留意店家鹽量。", ["好消化", "瘦肉蛋白"], ["外賣粥偏鹹"], "油炸鬼可略過或分享。")
zh("plain-cheung-fun", "偏清淡，但多是精緻碳水，甜醬油與芝麻醬也不少。", ["脂肪較低"], ["蛋白質少", "醬偏甜"], "醬汁少一點，再加豆漿或蛋補蛋白。")
zh("two-dish-rice", "可均衡也可很重，完全看你點哪兩餸。", ["可選蔬菜", "CP 值高"], ["油炸或濃汁菜偏油鹹", "飯量常偏大"], "選一青菜＋一蒸蛋白（蒸蛋、蒸魚、豆腐），並叫少飯。")
zh("steamed-fish-set", "瘦肉蛋白、少加油脂，是食堂裡較穩妥的選擇。", ["高蛋白、低脂"], ["醬油會拉高鈉"], "醬油只用一部分。")
zh("yangzhou-fried-rice", "油很容易被飯吸進去，也容易一次吃很多。", ["蛋與蝦有些蛋白質"], ["油偏高", "鈉偏高"], "與人分享，再點一碟蔬菜。")
zh("beef-chow-fun", "經典但很油，河粉會吸走鑊氣油分。", ["有蛋白質與鐵質"], ["油很高", "鈉偏高"], "與人分享，並叫少油。")
zh("sweet-sour-pork-rice", "豬件拍粉油炸，再淋甜酸汁。", ["有青椒／菠蘿等蔬菜"], ["油炸", "糖分高"], "改選清蒸或清炒菜式會好很多。")
zh("hainanese-chicken-rice", "白切雞偏瘦，但飯常用雞油煮。", ["蛋白質不錯"], ["油飯", "雞皮"], "去皮；若有白飯可改白飯。")
zh("satay-beef-noodles", "沙爹醬偏花生油脂，再配即食麵，又油又鹹。", ["有蛋白質"], ["花生過敏風險", "鈉偏高", "麵偏油"], "可改米粉並少醬。")
zh("cart-noodles", "取決於配料，但湯底與加工配料通常很鹹。", ["可以加蔬菜"], ["鈉很高", "魚蛋／腸類偏加工"], "選蘿蔔、青菜等，用米粉，湯少喝。")
zh("fish-slice-rice-noodles", "魚片偏瘦、米粉較輕；主要問題仍是鹽。", ["瘦魚蛋白"], ["湯底偏鹹"], "湯少喝，加生菜或豆芽。")
zh("har-gow", "蒸點相對油炸友善；蘸醬才是鈉的來源。", ["蝦蛋白", "蒸製"], ["蘸醬鈉高", "皮是精緻粉"], "醬少蘸，搭配青菜。")
zh("siu-mai", "蒸製，蛋白質尚可；留意油脂與鈉。", ["有蛋白質"], ["偏油", "鈉"], "別一次吃太多，配清茶與蔬菜。")
zh("char-siu-bao", "甜餡包子，糖與精緻粉都不少。", ["偶爾可以"], ["添加糖", "精緻粉"], "當甜點看，一餐一個就好。")
zh("lo-mai-gai", "糯米很飽，油脂與熱量也不低。", ["有飽足感"], ["糯米升糖快", "偏油"], "與人分享，或改蒸點。")
zh("spring-rolls", "典型油炸小吃。", ["偶爾可以"], ["油炸", "鈉"], "蒸或烤的春卷較好；油炸版少吃。")
zh("turnip-cake", "煎製會加油；蘿蔔本身不錯。", ["有蔬菜成分"], ["煎油", "醬汁鈉"], "可選蒸蘿蔔糕，醬少蘸。")
zh("steamed-greens-oyster", "青菜很好，但蠔油很鹹。", ["纖維與微量營養素"], ["蠔油鈉高"], "叫少蠔油或醬汁另盛。")
zh("custard-buns", "流心甜包，糖與脂肪都偏高。", ["偶爾獎勵"], ["糖與脂肪"], "當甜點，別當正餐主食。")
zh("curry-fish-balls", "街頭小食，鈉與加工度偏高。", ["方便"], ["鈉高", "加工"], "偶爾一支可以，別配甜飲狂吃。")
zh("egg-waffle", "甜點小吃，糖油都有。", ["偶爾可以"], ["糖", "油"], "一人分一個，別再配甜飲。")
zh("stinky-tofu", "油炸為主，負擔不小。", ["發酵風味"], ["油炸", "鈉"], "可選烤或蒸；配大量泡菜／青菜。")
zh("siu-mai-street", "街頭魚肉燒賣相對簡單，仍看醬與油。", ["有蛋白質"], ["醬汁鈉", "可能偏油"], "醬少蘸。")
zh("bubble-tea", "常規甜度的珍珠奶茶糖分很高。", ["少糖小杯可偶爾"], ["添加糖很高"], "當甜點；日常改無糖茶或水。")
zh("mango-pomelo-sago", "甜品湯，糖與椰奶都不低。", ["有水果"], ["糖", "椰奶脂肪"], "與人分享，或改鮮果。")
zh("ice-cream", "甜點熱量，不適合每晚習慣。", ["偶爾可以"], ["糖與飽和脂肪"], "一小份即可。")
zh("potato-chips", "油炸零食，很容易一口接一口。", ["無特別營養優勢"], ["油、鹽、精緻碳水"], "改烤番薯片或水果。")
zh("chocolate-bar", "糖果棒糖分上升很快。", ["小塊黑巧可解饞"], ["糖"], "一兩小塊，別整條。")
zh("onigiri-tuna", "方便，但美乃滋提高油脂。", ["鮪魚蛋白"], ["美乃滋油脂", "鈉"], "選少醬或清蒸鮪魚款。")
zh("egg-mayo-sandwich", "方便早餐，美乃滋與白麵包是關鍵。", ["蛋蛋白"], ["美乃滋", "白麵包"], "改全麥、少醬，加生菜番茄。")
zh("cup-noodles", "即食麵鈉極高，纖維少。", ["應急方便"], ["鈉極高", "油包"], "調味包減半，加蛋與蔬菜。")
zh("sweet-soy-milk", "甜豆漿糖分不低。", ["有一些植物蛋白"], ["添加糖"], "改無糖豆漿。")
zh("unsweetened-soy-milk", "無糖植物蛋白飲料，日常很好。", ["植物蛋白", "無添加糖"], [], "可當早餐搭配燕麥。")
zh("boiled-egg", "平價完整蛋白質。", ["優質蛋白", "方便"], ["雞蛋過敏請避"], "一餐 1–2 顆很合適。")
zh("tea-egg", "有蛋白，但滷汁偏鹹。", ["蛋白質"], ["鈉偏高"], "當加菜可以，別一次很多。")
zh("plain-greek-yogurt", "原味希臘乳酪蛋白質高。", ["高蛋白", "方便"], ["乳糖不耐需留意"], "配水果，別加大量蜂蜜。")
zh("flavoured-yogurt", "調味杯常有添加糖。", ["仍有一些蛋白"], ["糖偏高"], "改原味再自己加水果。")
zh("mixed-nuts", "有益脂肪與蛋白質，但熱量密度高。", ["有助飽足", "顧心臟友善脂肪"], ["堅果過敏請避", "蜜汁款加糖"], "一小把約 20–30 克。")
zh("banana", "方便補鉀的水果。", ["補鉀", "方便"], ["過熟糖分較高"], "一根當點心很合適。")
zh("apple", "日常很好的水果，有纖維。", ["方便", "纖維"], ["果汁不如整顆"], "一顆中等蘋果即可。")
zh("orange", "維生素 C 與水分都不錯。", ["維生素 C", "水分"], [], "整顆優於果汁。")
zh("orange-juice", "少了纖維，糖分更容易一次喝完。", ["方便補維 C"], ["纖維少", "升糖較快"], "改吃整顆橙。")
zh("cola", "液體糖，幾乎不產生飽足。", ["偶爾可以"], ["添加糖", "對血糖／體重不友善"], "日常改水或無糖茶。")
zh("sports-drink", "劇烈流汗時才較有需要，日常常是糖水。", ["長時間運動可補電解質"], ["添加糖"], "一般活動喝水即可。")
zh("energy-drink", "高咖啡因與糖，不適合當日常飲料。", ["偶爾提神"], ["咖啡因與糖高"], "優先睡好、喝水。")
zh("beer", "酒精有熱量，也影響睡眠與血壓。", ["社交場合偶爾"], ["熱量", "酒精"], "少喝，並配食物、多喝水。")
zh("water-unsweetened-tea", "日常首選。", ["無糖", "補水"], [], "全天分次喝。")
zh("low-fat-milk", "蛋白質與鈣方便來源。", ["蛋白與鈣"], ["乳糖不耐改植物奶"], "一杯約 240 毫升。")
zh("fried-chicken", "偶爾可以，油與鈉通常偏高。", ["有蛋白質"], ["油炸", "常配甜飲"], "分享一份，先配沙拉或清湯。")
zh("burger-fries-combo", "漢堡加薯條汽水，熱量很容易超標。", ["可有蛋白質"], ["油炸配餐", "含糖飲料"], "單點漢堡、加沙、改喝水。")
zh("pepperoni-pizza", "精緻餅皮、起司與加工肉腸。", ["蔬菜薄底相對好些"], ["鈉與飽和脂肪"], "一兩片配沙拉。")
zh("chicken-caesar-salad", "看似健康，濃醬與油炸配料可讓熱量很高。", ["有蔬菜與雞肉"], ["凱薩醬偏油", "油炸麵包丁"], "醬汁另盛，少用一半。")
zh("katsu-curry-rice", "吉列豬扒油炸，咖喱與大飯也不輕。", ["有蛋白質"], ["油炸", "飯量大"], "改烤雞或豆腐咖喱，少飯。")
zh("tonkotsu-ramen", "濃湯拉麵鈉與脂肪都高。", ["有蛋白質"], ["鈉極高", "油湯"], "湯少喝，加青菜蛋。")
zh("salmon-sushi-set", "相對清淡；白飯多、蘸醬油會拉鈉。", ["瘦魚", "脂肪不高"], ["精緻米", "醬油鈉"], "可加刺身或毛豆補蛋白。")
zh("salmon-sashimi", "純蛋白質與優質脂肪。", ["優質脂肪", "高蛋白"], ["生魚：懷孕請遵醫囑"], "醬油少蘸。")
zh("poke-bowl", "略過美乃滋與油炸配料時很均衡。", ["蛋白、優質脂肪、蔬菜"], ["濃醬", "油炸洋蔥碎"], "糙米或半飯半菜，醬清淡。")
zh("pho", "瘦牛肉與香草不錯，主要是湯底偏鹹。", ["瘦肉蛋白", "香草"], ["湯底鈉高"], "多加芽菜香草，湯少喝。")
zh("thai-green-curry", "椰漿讓咖喱偏濃，蔬菜有幫助。", ["有蔬菜", "有蛋白質"], ["椰漿飽和脂肪"], "多菜少飯。")
zh("bibimbap", "蔬菜多，再加蛋與飯。", ["蔬菜多", "較均衡"], ["拌醬鈉高"], "辣醬只用一半。")
zh("korean-fried-chicken", "雙重油炸又常刷甜醬。", ["有蛋白質"], ["油炸", "甜醬", "鈉很高"], "3–4 人分享，配蘿蔔泡菜。")
zh("chicken-curry-naan", "奶油咖喱與牛油烤餅負擔不小。", ["有蛋白質與香料"], ["奶油／酥油", "大張精緻烤餅"], "可選坦都里雞、扁豆湯配薄烤餅或白飯。")
zh("chicken-biryani", "很飽的飯菜，油量視店家而定。", ["有蛋白質與香料"], ["飯量大", "酥油"], "分享並加優格沙拉。")
zh("shawarma-wrap", "蛋白質不錯；蒜蓉醬提高油脂。", ["有蛋白質", "有一些蔬菜"], ["濃稠醬"], "多沙拉、少醬。")
zh("spaghetti-bolognese", "相對均衡，重點是份量。", ["有蛋白質", "番茄"], ["義大利麵份量常偏大"], "可改全麥麵，再配沙拉。")
zh("carbonara", "忌廉、起司與煙肉：飽和脂肪偏高。", ["有蛋白質"], ["飽和脂肪", "加工肉"], "改番茄或橄欖油義大利麵。")
zh("fish-and-chips", "魚本身不錯，但漿粉與薯條都是油炸。", ["有蛋白質"], ["油炸"], "改烤魚配沙拉。")
zh("taiwanese-chicken-cutlet", "超大片、油炸、調味重。", ["有蛋白質"], ["油炸", "偏鹹"], "分享或改烤雞。")
zh("pan-fried-dumplings", "煎比水煮多油。", ["有蛋白質"], ["油", "鈉"], "改水餃並加青菜。")
zh("boiled-dumplings", "比煎餃穩妥；菜肉餡更好。", ["有蛋白質", "可有蔬菜"], ["皮是精緻粉", "蘸醬鈉"], "選菜肉餡，醬少蘸。")
zh("hot-pot", "可很健康也可很重，取決於湯底與沾醬。", ["可選蔬菜、豆腐、瘦肉"], ["湯底與醬很鹹", "肥牛與加工丸子"], "清湯、多菜多豆腐、瘦肉；沙爹醬少用。")
zh("white-rice", "可作主食，關鍵是份量。", ["提供能量"], ["纖維少", "升糖較快"], "可半白半糙或雜糧。")
zh("brown-rice", "比白飯更多纖維與營養。", ["纖維", "能量較穩定"], [], "先浸泡約 30 分鐘口感更軟。")
zh("oatmeal", "高纖早餐，有助血糖較穩定。", ["可溶性纖維", "較有飽足感"], ["甜味即食包常加糖"], "用原味燕麥加水果。")
zh("wholemeal-toast-pb", "有纖維與脂肪；花生醬薄薄一層即可。", ["纖維", "蛋白質"], ["花生過敏", "醬熱量密度高"], "選無添加糖花生醬。")
zh("grilled-chicken-breast", "瘦肉蛋白主力。", ["高蛋白低脂"], [], "可先醃製保持多汁。")
zh("baked-salmon", "蛋白質加優質脂肪。", ["優質脂肪", "蛋白質"], [], "一週兩次魚類是不錯目標。")
zh("tofu", "平價植物蛋白，常含鈣。", ["植物蛋白", "鈣"], [], "清蒸或少油快炒，少油炸。")
zh("sirloin-steak", "蛋白質與鐵質佳；紅肉建議每週次數別太多。", ["蛋白、鐵、B12"], ["飽和脂肪", "醬汁加鹽"], "配蔬菜，別配薯條。")
zh("avocado-toast", "有益脂肪與纖維；再加蛋會更完整。", ["纖維", "有益脂肪"], ["咖啡店份量差異大"], "可加水波蛋。")
zh("salad-box", "補蔬菜很好；重點看醬。", ["纖維與維生素"], ["濃稠醬"], "醬用一半，並加蛋白質。")
zh("steamed-vegetables", "目標是讓蔬菜約佔半盤。", ["纖維", "維生素"], [], "用蒜或薑提味，少靠濃醬。")
zh("sweet-potato", "高纖碳水，也有維生素 A。", ["纖維", "維生素 A"], [], "蒸或烤，少油炸。")
zh("corn-on-cob", "簡單的全穀點心。", ["纖維"], ["加牛油會提高脂肪"], "不要牛油。")

missing = [f["id"] for f in SRC["foods"] if f["id"] not in ZH]
if missing:
    raise SystemExit(f"Missing ZH for: {missing}")


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def aliases_for(f: dict) -> list[str]:
    name = f["name"]
    name_zh = f["nameZh"]
    aid = f["id"].replace("-", " ")
    out = {name, name.lower(), name_zh, aid, f["id"]}
    # strip parenthetical english
    out.add(re.sub(r"\s*\(.*?\)\s*", "", name).strip())
    out.add(re.sub(r"\s*（.*?）\s*", "", name_zh).strip())
    # common HK variants / shorthand
    extras = {
        "char-siu-rice": ["叉烧饭", "叉燒", "烧味饭"],
        "roast-goose-rice": ["烧鹅饭", "燒鵝"],
        "roast-pork-rice": ["烧肉饭", "燒肉"],
        "wonton-noodle-soup": ["云吞面", "雲吞麵", "wonton"],
        "beef-brisket-noodles": ["牛腩面", "牛腩"],
        "baked-pork-chop-rice": ["猪扒饭", "焗豬扒"],
        "set-breakfast": ["茶餐厅", "茶餐廳常餐"],
        "luncheon-meat-egg-noodles": ["餐蛋面", "公仔麵"],
        "pineapple-bun-butter": ["菠萝油", "菠蘿包"],
        "french-toast": ["西多士", "法式多士"],
        "hk-milk-tea": ["奶茶", "港奶"],
        "iced-lemon-tea": ["柠檬茶", "凍檸"],
        "congee-century-egg-pork": ["皮蛋粥", "瘦肉粥", "粥"],
        "plain-cheung-fun": ["肠粉", "腸粉"],
        "two-dish-rice": ["两餸饭", "兩餸", "碟頭飯"],
        "beef-chow-fun": ["牛河", "乾炒牛河"],
        "cart-noodles": ["车仔面", "車仔"],
        "bubble-tea": ["珍奶", "波霸", "奶茶"],
        "hot-pot": ["火鍋", "涮涮鍋", "麻辣鍋"],
        "fried-chicken": ["炸雞", "炸鸡"],
        "water-unsweetened-tea": ["水", "白開水", "無糖茶", "茶"],
        "cup-noodles": ["泡麵", "方便麵", "即食麵"],
        "white-rice": ["白飯", "米飯", "飯"],
        "cola": ["可樂", "汽水"],
    }
    for a in extras.get(f["id"], []):
        out.add(a)
    return sorted({a for a in out if a and len(a) >= 1}, key=lambda x: (len(x), x))


def map_existing_recipe(rid: str) -> str | None:
    """Map catalog recipe ids onto existing site recipes when close."""
    mapping = {
        "banana-oat-pancakes": "banana-oat-pancakes",
        "yogurt-parfait": "yogurt-walnut-parfait",
        "overnight-oats": "oat-berry-breakfast",
        "baked-salmon-veg": "salmon-greens",
        "miso-tofu-soup": "miso-soup-tofu",
        "red-lentil-curry": "lentil-ginger-bowl",
        "chickpea-salad": "greek-salad-chickpea",
        "tomato-egg-stirfry": "tomato-egg-rice",
        "quinoa-veg-bowl": "quinoa-veg-pilaf",
    }
    return mapping.get(rid)


def ts_food(f: dict) -> str:
    z = ZH[f["id"]]
    n = f.get("nutrition") or {}
    verdict = VERDICT[f["verdict"]]
    alts = f.get("healthierAlternativeRecipeIds") or []
    # prefer site-native ids when we remapped recipes
    mapped_alts = []
    for a in alts:
        mapped_alts.append(map_existing_recipe(a) or a)
    # dedupe keep order
    seen = set()
    alts2 = []
    for a in mapped_alts:
        if a not in seen:
            seen.add(a)
            alts2.append(a)

    aliases = aliases_for(f)
    portion_en = f.get("tip") and f"{f['servingSize']}. {f['tip']}" or f["servingSize"]
    portion_zh = f"{f['servingSize']}。{z['tip']}"

    nutrients = ""
    if n:
        nutrients = f"""
    nutrients: {{
      calories: {n.get('calories', 0)},
      protein: {n.get('proteinG', 0)},
      carbs: {n.get('carbsG', 0)},
      fat: {n.get('fatG', 0)},
      fiber: {n.get('fiberG', 0)},
      sodium: {n.get('sodiumMg', 0)},
      sugar: {n.get('sugarG', 0)},
    }},"""

    price = f.get("priceHKD")
    afford_note = ""
    # keep inside tip/portion; food-analysis can show price via portion

    return f"""  {{
    id: {js_str(f['id'])},
    aliases: {json.dumps(aliases, ensure_ascii=False)},
    nameEn: {js_str(f['name'])},
    nameZh: {js_str(f['nameZh'])},
    verdict: {js_str(verdict)},
    summaryEn: {js_str(f['summary'])},
    summaryZh: {js_str(z['summary'])},
    prosEn: {json.dumps(f.get('whyItCanHelp') or [], ensure_ascii=False)},
    prosZh: {json.dumps(z['pros'], ensure_ascii=False)},
    consEn: {json.dumps(f.get('watchOuts') or [], ensure_ascii=False)},
    consZh: {json.dumps(z['cons'], ensure_ascii=False)},
    portionEn: {js_str(portion_en)},
    portionZh: {js_str(portion_zh)},{nutrients}
    suggestRecipeIds: {json.dumps(alts2, ensure_ascii=False)},
  }}"""


def parse_ingredient(item: str, cost: float | None) -> dict:
    # Try to split leading amount
    m = re.match(r"^(\d[\d./]*\s*(?:g|kg|ml|l|tbsp|tsp|cups?|cup|cloves?|slices?|fillets?|pieces?)?\s+)(.+)$", item, re.I)
    if m:
        amount, name = m.group(1).strip(), m.group(2).strip()
    else:
        amount, name = "to taste", item
    out = {"name": name, "amount": amount}
    if cost is not None:
        out["cost"] = round(float(cost), 2)
    return out


def ts_recipe(r: dict, idx: int) -> str:
    groups = []
    for g in r.get("goals") or []:
        mapped = GOAL_MAP.get(g)
        if mapped and mapped not in groups:
            groups.append(mapped)
    if not groups:
        groups = ["general"]
    if "Budget" in (r.get("goals") or []):
        tags_extra_budget = True
    else:
        tags_extra_budget = False

    tags = []
    for t in r.get("dietTags") or []:
        mapped = TAG_MAP.get(t)
        if mapped and mapped not in tags:
            tags.append(mapped)
    if tags_extra_budget and "budget" not in tags:
        tags.append("budget")
    if r.get("timeMinutes", 99) <= 25 and "quick" not in tags:
        tags.append("quick")

    allergens = []
    for a in r.get("allergens") or []:
        mapped = ALLERGEN_MAP.get(a)
        if mapped and mapped not in allergens:
            allergens.append(mapped)

    ings = [parse_ingredient(i["item"], i.get("costUSD")) for i in r.get("ingredients") or []]
    n = r["nutritionPerServing"]
    total = r.get("timeMinutes") or 30
    prep = max(5, total // 3)
    cook = max(5, total - prep)
    gradient = GRADIENTS[idx % len(GRADIENTS)]

    return f"""  {{
    id: {js_str(r['id'])},
    title: {js_str(r['title'])},
    summary: {js_str(r['description'])},
    servings: {r.get('servings', 2)},
    prepMinutes: {prep},
    cookMinutes: {cook},
    difficulty: "easy",
    costPerServing: {round(float(r.get('costPerServingUSD') or 2), 2)},
    groups: {json.dumps(groups)},
    tags: {json.dumps(tags)},
    allergens: {json.dumps(allergens)},
    cuisine: "Home / HK everyday",
    regionAvailability: [{js_str(r.get('availability') or 'Hong Kong markets')}],
    ingredients: {json.dumps(ings, ensure_ascii=False)},
    steps: {json.dumps(r.get('steps') or [], ensure_ascii=False)},
    nutrients: {{
      calories: {n.get('calories', 0)},
      protein: {n.get('proteinG', 0)},
      carbs: {n.get('carbsG', 0)},
      fat: {n.get('fatG', 0)},
      fiber: {n.get('fiberG', 0)},
      sodium: {n.get('sodiumMg', 0)},
      sugar: {n.get('sugarG', 0)},
    }},
    whyHealthy: {js_str(r.get('whyHealthier') or '')},
    alternatives: {json.dumps(r.get('swaps') or [], ensure_ascii=False)},
    imageGradient: {js_str(gradient)},
  }}"""


def ts_recipe_zh(r: dict) -> str:
    """Minimal but usable 繁中 recipe card copy."""
    # Translate ingredient names via simple dictionary + keep amounts
    unit_map = [
        (r"\btbsp\b", "湯匙"),
        (r"\btsp\b", "茶匙"),
        (r"\bcups?\b", "杯"),
        (r"\bg\b", "克"),
        (r"\bml\b", "毫升"),
        (r"\bcloves?\b", "瓣"),
    ]

    def amt(a: str) -> str:
        out = a
        for pat, rep in unit_map:
            out = re.sub(pat, rep, out, flags=re.I)
        return out

    ings_zh = []
    for i in r.get("ingredients") or []:
        parsed = parse_ingredient(i["item"], None)
        ings_zh.append({"name": parsed["name"], "amount": amt(parsed["amount"])})

    steps = r.get("steps") or []
    steps_zh = [f"（步驟）{s}" for s in steps]  # temporary marker; replace below

    # Better: provide Chinese steps as natural translations of English where possible —
    # For speed we keep English steps translated lightly by prefixing instruction language.
    # We'll translate titles/summaries properly; steps use a note style in Chinese.

    return None  # filled later


# --- Generate foods file ---
food_items = ",\n".join(ts_food(f) for f in SRC["foods"])
foods_ts = f"""/* Auto-generated from nourish-catalog.json — do not edit by hand; re-run scripts/import-catalog.py */
import type {{ FoodItem }} from "./foods";

export const CATALOG_FOODS: FoodItem[] = [
{food_items}
];
"""
(ROOT / "src/lib/data/catalog-foods.ts").write_text(foods_ts)

# --- Generate recipes (skip ones that map onto existing site recipes to avoid dupes) ---
existing_keep = set()
catalog_recipes = []
for i, r in enumerate(SRC["recipes"]):
    mapped = map_existing_recipe(r["id"])
    if mapped and mapped != r["id"]:
        # skip adding duplicate; food alts already remapped
        continue
    if r["id"] == "banana-oat-pancakes":
        continue  # already on site
    catalog_recipes.append(ts_recipe(r, i))

recipes_ts = f"""/* Auto-generated from nourish-catalog.json — re-run scripts/import-catalog.py */
import type {{ Recipe }} from "./types";

export const CATALOG_RECIPES: Recipe[] = [
{",\n".join(catalog_recipes)}
];
"""
(ROOT / "src/lib/data/catalog-recipes.ts").write_text(recipes_ts)

# --- Generate zh locale entries for catalog recipes ---
# Manual quality translations for title/summary/why; steps translated as practical Chinese.
RECIPE_ZH = {
    "steamed-fish-ginger": {
        "title": "薑蔥清蒸魚",
        "summary": "粵式經典：高蛋白、幾乎不用額外油脂。",
        "cuisine": "粵式家常",
        "whyHealthy": "清蒸比油炸魚套餐脂肪低很多，蛋白質高。",
        "alternatives": ["素食可改豆腐", "無麩質可用大豆醬油", "清真／潔食：有鰭有鱗的魚通常可接受"],
        "steps": ["魚身劃幾刀，上下舖薑絲。", "水滾後蒸 8–10 分鐘（魚柳 6–7 分鐘）至肉質可剝。", "倒掉蒸汁，鋪上蔥絲與香菜。", "淋豉油，再淋熱油激香蔥絲。"],
    },
    "steamed-egg-custard": {
        "title": "蒸水蛋",
        "summary": "嫩滑蒸蛋——平價蛋白質，好入口。",
        "cuisine": "中式家常",
        "whyHealthy": "幾乎無油，蛋白質清楚，適合樂齡與恢復食慾。",
        "alternatives": ["可加少量蝦米或葱花", "低鈉請少豉油"],
        "steps": ["蛋加溫水打匀過篩。", "蓋蓋中火蒸約 10 分鐘至凝固。", "淋少許豉油與香油。"],
    },
    "chicken-brown-rice-bowl": {
        "title": "雞胸糙米飯碗",
        "summary": "高蛋白飯碗，配蔬菜，適合體重與血糖意識。",
        "cuisine": "家常健康",
        "whyHealthy": "糙米纖維＋雞胸蛋白＋蔬菜體積，比油膩外賣更穩。",
        "alternatives": ["可改豆腐", "醬汁另盛"],
        "steps": ["烤或煎雞胸切片。", "鋪在糙米飯上，加大量蔬菜。", "少許低鈉醬油或檸檬汁調味。"],
    },
    "mapo-tofu-light": {
        "title": "少油版麻婆豆腐",
        "summary": "減油減辣的家常豆腐——植物蛋白為主。",
        "cuisine": "川味家常（清淡版）",
        "whyHealthy": "豆腐提供植物蛋白；少油少肉燥，比餐廳版負擔小。",
        "alternatives": ["全素可略肉碎", "辣度自行調整"],
        "steps": ["少油爆香蒜與豆瓣。", "下豆腐與少許高湯燜煮。", "撒葱花，少油收汁。"],
    },
    "lean-pork-congee": {
        "title": "瘦肉粥",
        "summary": "清淡粥品——消化力弱或食慾差的日子很實用。",
        "cuisine": "中式",
        "whyHealthy": "好消化、補水，瘦肉蛋白清楚。",
        "alternatives": ["可改雞肉粥", "少鹽"],
        "steps": ["米加水熬至綿稠。", "下瘦肉片煮熟。", "胡椒與葱花調味，少鹽。"],
    },
    "garlic-choy-sum": {
        "title": "蒜蓉菜心",
        "summary": "快手青菜——半盤蔬菜的好搭檔。",
        "cuisine": "粵式",
        "whyHealthy": "低熱量高體積，輕鬆補纖維。",
        "alternatives": ["可改芥蘭或菠菜", "醬汁少用"],
        "steps": ["焯或快炒菜心。", "蒜蓉少油爆香淋上。"],
    },
    "soba-chicken-salad": {
        "title": "蕎麥雞胸沙律",
        "summary": "冷麵沙律——纖維與蛋白質兼顧。",
        "cuisine": "日式靈感",
        "whyHealthy": "蕎麥與蔬菜纖維，雞胸蛋白，比油拌炒麵好。",
        "alternatives": ["素食改豆腐", "醬汁另盛"],
        "steps": ["煮蕎麥過冷河。", "拌雞胸絲與大量蔬菜。", "少許醬油芝麻醬調味。"],
    },
    "homemade-wonton-soup": {
        "title": "家常雲吞湯",
        "summary": "自己包、自己控鹽——比茶餐廳雲吞麵清淡。",
        "cuisine": "粵式",
        "whyHealthy": "湯可少鹽，配料自己加青菜。",
        "alternatives": ["可改雞肉餡", "無蝦過敏者可用菜肉"],
        "steps": ["包雲吞。", "清湯煮熟，加大量菜心。", "少許胡椒，少豉油。"],
    },
    "air-fryer-pork-chop-rice": {
        "title": "氣炸豬扒飯（少油）",
        "summary": "氣炸取代油炸，仍有扒飯滿足感。",
        "cuisine": "港式家常改良",
        "whyHealthy": "大幅減少用油，比茶餐廳焗豬扒飯負擔小。",
        "alternatives": ["可改雞扒", "少飯多菜"],
        "steps": ["豬扒少油醃製。", "氣炸至熟。", "配白飯與大份蔬菜，番茄汁少淋。"],
    },
    "chicken-broccoli-stirfry": {
        "title": "雞胸西蘭花快炒",
        "summary": "少油快炒——體重與血糖友善。",
        "cuisine": "家常",
        "whyHealthy": "高蛋白高蔬菜，烹煮快。",
        "alternatives": ["可改豆腐", "少醬"],
        "steps": ["雞胸切片少油快炒。", "加西蘭花炒熟。", "蒜與少許醬油調味。"],
    },
    "clear-beef-noodle-soup": {
        "title": "清湯牛肉麵（家常）",
        "summary": "清湯為主、少油——比濃紅燒負擔小。",
        "cuisine": "中式",
        "whyHealthy": "可控制油脂與鈉，瘦牛肉補鐵。",
        "alternatives": ["湯少喝", "加青菜"],
        "steps": ["清湯燉瘦牛肉。", "下面條與青菜。", "少鹽，胡椒提味。"],
    },
    "tuna-wholewheat-sandwich": {
        "title": "全麥吞拿魚三文治",
        "summary": "方便午餐——全麥加蛋白。",
        "cuisine": "西式輕食",
        "whyHealthy": "全麥纖維＋鮪魚蛋白，比美乃滋白麵包款穩妥。",
        "alternatives": ["用希臘乳酪代替大量美乃滋"],
        "steps": ["鮪魚少醬拌匀。", "夾入全麥包與生菜番茄。"],
    },
    "brown-rice-egg-fried-rice": {
        "title": "糙米蛋炒飯",
        "summary": "少油蛋炒飯——用糙米提升纖維。",
        "cuisine": "家常",
        "whyHealthy": "比外賣炒飯少油，糙米更有纖維。",
        "alternatives": ["可加大量葱與菜"],
        "steps": ["隔夜糙米飯少油炒。", "下蛋與蔬菜。", "少醬油。"],
    },
    "steamed-chicken-shiitake": {
        "title": "香菇蒸滑雞",
        "summary": "一碟蒸菜——少油高蛋白。",
        "cuisine": "粵式",
        "whyHealthy": "蒸煮保留蛋白質，油脂遠低於炸雞。",
        "alternatives": ["可改豆腐蒸"],
        "steps": ["雞件與香菇醃製。", "蒸至全熟。", "淋少許蒸汁即可。"],
    },
    "shrimp-zucchini-pasta": {
        "title": "蝦仁櫛瓜義大利麵",
        "summary": "半麵半菜——控制精緻碳水。",
        "cuisine": "西式輕食",
        "whyHealthy": "櫛瓜提高體積，蝦仁補蛋白。",
        "alternatives": ["全素改豆腐"],
        "steps": ["煮麵。", "少油炒蝦與櫛瓜。", "拌匀，黑胡椒調味。"],
    },
    "fish-rice-noodle-soup": {
        "title": "魚片米粉湯",
        "summary": "清湯魚片——茶餐廳魚粉的家常清淡版。",
        "cuisine": "粵式",
        "whyHealthy": "瘦魚蛋白，自己控鹽。",
        "alternatives": ["湯少喝", "加生菜"],
        "steps": ["清湯煮沸。", "下米粉與魚片至熟。", "少鹽，加葱花。"],
    },
    "poached-chicken-rice-light": {
        "title": "清淡版海南雞飯",
        "summary": "白切雞配白飯與大量青菜——少油飯。",
        "cuisine": "東南亞／港式",
        "whyHealthy": "去皮雞肉蛋白高；略過雞油飯可減脂。",
        "alternatives": ["去皮", "多菜"],
        "steps": ["浸雞至熟，去皮切片。", "配白飯與黃瓜青菜。", "蘸料另盛少用。"],
    },
    "home-bibimbap": {
        "title": "家常韓式拌飯",
        "summary": "蔬菜為主的拌飯，醬汁自己控。",
        "cuisine": "韓式家常",
        "whyHealthy": "大量蔬菜＋蛋／瘦肉，比外食炸雞套餐均衡。",
        "alternatives": ["辣醬減半"],
        "steps": ["準備多款菜絲。", "鋪飯上，加蛋。", "拌醬少加。"],
    },
    "rice-paper-rolls": {
        "title": "越南米紙卷",
        "summary": "新鮮蔬菜卷——低油、高纖。",
        "cuisine": "越式",
        "whyHealthy": "幾乎不油炸，蔬菜與瘦蛋白清楚。",
        "alternatives": ["蘸醬少用"],
        "steps": ["米紙沾水软。", "卷入蝦／豆腐與大量菜。", "蘸料另盛。"],
    },
    "steamed-sweet-potato": {
        "title": "清蒸番薯",
        "summary": "高纖點心或配菜。",
        "cuisine": "家常",
        "whyHealthy": "比薯條好太多的碳水選擇。",
        "alternatives": ["可烤製"],
        "steps": ["番薯蒸熟即可。"],
    },
    "less-sugar-lemon-tea": {
        "title": "少糖凍檸茶（家常）",
        "summary": "自己沖，糖量你話事。",
        "cuisine": "飲品",
        "whyHealthy": "比茶餐廳甜檸茶少很多添加糖。",
        "alternatives": ["可完全走糖"],
        "steps": ["泡茶放凍。", "加檸檬，糖按喜好極少量。"],
    },
    "mango-yogurt-smoothie": {
        "title": "芒果乳酪昔",
        "summary": "用乳酪與水果，少加糖漿。",
        "cuisine": "輕食飲品",
        "whyHealthy": "有蛋白質與纖維，比糖分奶昔穩妥。",
        "alternatives": ["乳糖不耐用植物乳酪"],
        "steps": ["芒果、乳酪、少許奶打匀。", "不另加糖。"],
    },
    "edamame-snack": {
        "title": "毛豆點心",
        "summary": "高蛋白植物點心。",
        "cuisine": "日式小食",
        "whyHealthy": "比薯片有蛋白質與纖維。",
        "alternatives": ["少鹽"],
        "steps": ["毛豆焯熟，少許海鹽。"],
    },
    "borscht-light": {
        "title": "清淡羅宋湯",
        "summary": "蔬菜湯——港式西餐廳靈感的家常版。",
        "cuisine": "港式西餐靈感",
        "whyHealthy": "以蔬菜為主，比忌廉湯負擔小。",
        "alternatives": ["少鹽"],
        "steps": ["炒香蔬菜。", "加水燉軟。", "少許番茄醬調味。"],
    },
    "winter-melon-soup": {
        "title": "冬瓜湯",
        "summary": "清淡湯品，適合配飯。",
        "cuisine": "粵式",
        "whyHealthy": "低熱量補水，少油。",
        "alternatives": ["可加瘦肉片"],
        "steps": ["冬瓜加水煮软。", "少鹽調味。"],
    },
    "chicken-tikka-skewers": {
        "title": "坦都里風味雞串",
        "summary": "烤製香料雞——少忌廉咖喱。",
        "cuisine": "南亞",
        "whyHealthy": "烘烤取代油炸與濃咖喱醬。",
        "alternatives": ["配沙律"],
        "steps": ["雞件香料醃製。", "烤或氣炸至熟。"],
    },
    "grilled-mackerel": {
        "title": "烤鯖魚",
        "summary": "富含優質脂肪的烤魚。",
        "cuisine": "日式家常",
        "whyHealthy": "烘烤魚類比油炸好，脂肪品質佳。",
        "alternatives": ["配白飯與菜"],
        "steps": ["鯖魚少許鹽。", "烤至皮脆肉熟。"],
    },
    "home-poke-bowl": {
        "title": "家常波奇碗",
        "summary": "半飯半菜，醬清淡。",
        "cuisine": "夏威夷靈感",
        "whyHealthy": "自己控飯量與醬汁，比外賣碗穩妥。",
        "alternatives": ["可改豆腐"],
        "steps": ["鋪糙米與蔬菜。", "放魚或豆腐。", "少許醬油芝麻油。"],
    },
    "veggie-omelette": {
        "title": "蔬菜奄列",
        "summary": "蛋＋大量菜的快速早餐。",
        "cuisine": "家常",
        "whyHealthy": "蛋白質與蔬菜兼顧。",
        "alternatives": ["少油鍋"],
        "steps": ["菜先炒軟。", "倒蛋液烙熟。"],
    },
    "light-mango-pomelo-sago": {
        "title": "少糖楊枝甘露",
        "summary": "減少椰奶與糖的水果甜品。",
        "cuisine": "港式甜品改良",
        "whyHealthy": "保留水果，大幅減糖與椰奶。",
        "alternatives": ["用乳酪替代部分椰奶"],
        "steps": ["芒果柚子切塊。", "西米煮熟過冷河。", "少許低糖椰奶或乳酪拌匀。"],
    },
    "lentil-veg-soup": {
        "title": "扁豆蔬菜湯",
        "summary": "平價高纖一鍋湯。",
        "cuisine": "地中海／家常",
        "whyHealthy": "植物蛋白與纖維，適合預算與血糖意識。",
        "alternatives": ["配全麥包"],
        "steps": ["炒香料與菜。", "加扁豆與水燉軟。"],
    },
    "tofu-pak-choi-noodles": {
        "title": "豆腐白菜湯麵",
        "summary": "清湯麵——比車仔麵少加工配料。",
        "cuisine": "中式家常",
        "whyHealthy": "自己控鈉，豆腐＋青菜清楚。",
        "alternatives": ["湯少喝"],
        "steps": ["清湯煮麵。", "下豆腐與白菜。", "少豉油。"],
    },
    "baked-chicken-wings-light": {
        "title": "焗雞翼（少油）",
        "summary": "烤箱版雞翼，滿足嘴饞少油鍋。",
        "cuisine": "家常",
        "whyHealthy": "焗製比油炸少很多油。",
        "alternatives": ["去皮更瘦", "配沙律"],
        "steps": ["雞翼抹香料。", "烤箱焗至熟。"],
    },
    "black-bean-beef-peppers": {
        "title": "豉椒牛肉（少油）",
        "summary": "多菜少汁的快炒牛肉。",
        "cuisine": "粵式家常",
        "whyHealthy": "增加甜椒體積、減少鑊油，比乾炒牛河清淡。",
        "alternatives": ["可改鸡片"],
        "steps": ["牛肉少油快炒盛起。", "炒甜椒。", "回鍋少許豉椒醬翻匀。"],
    },
}

# Fill any catalog recipe missing from RECIPE_ZH with titleZh + lightweight copy
for r in SRC["recipes"]:
    if r["id"] in ("banana-oat-pancakes",):
        continue
    if map_existing_recipe(r["id"]) and map_existing_recipe(r["id"]) != r["id"]:
        continue
    if r["id"] not in RECIPE_ZH:
        RECIPE_ZH[r["id"]] = {
            "title": r.get("titleZh") or r["title"],
            "summary": r.get("description") or "",
            "cuisine": "家常",
            "whyHealthy": r.get("whyHealthier") or "",
            "alternatives": r.get("swaps") or [],
            "steps": r.get("steps") or [],
            "regionAvailability": [r.get("availability") or "街市與超市"],
        }
    else:
        RECIPE_ZH[r["id"]].setdefault("regionAvailability", [r.get("availability") or "街市與超市"])

locale_entries = []
for rid, copy in RECIPE_ZH.items():
    ings = None
    # try attach translated ingredient names from catalog using ingredient-locale at runtime;
    # here just omit ingredients so fallback translator works.
    locale_entries.append(
        f"""  {js_str(rid)}: {{
    title: {js_str(copy['title'])},
    summary: {js_str(copy['summary'])},
    cuisine: {js_str(copy.get('cuisine', '家常'))},
    regionAvailability: {json.dumps(copy.get('regionAvailability') or ['街市與超市'], ensure_ascii=False)},
    whyHealthy: {js_str(copy['whyHealthy'])},
    alternatives: {json.dumps(copy.get('alternatives') or [], ensure_ascii=False)},
    steps: {json.dumps(copy.get('steps') or [], ensure_ascii=False)},
  }}"""
    )

locale_ts = f"""/* Auto-generated catalog recipe 繁中 — merge into recipe-locale */
export const CATALOG_RECIPE_ZH = {{
{",\n".join(locale_entries)}
}} as const;
"""
(ROOT / "src/lib/i18n/catalog-recipe-locale.ts").write_text(locale_ts)

print("foods", len(SRC["foods"]))
print("catalog recipes written", len(catalog_recipes))
print("zh recipes", len(RECIPE_ZH))
print("OK")
