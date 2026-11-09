import type { CurrencyCode } from "./currency";

export type StoreLink = {
  id: string;
  labelEn: string;
  labelZh: string;
  /** Build a search URL for an ingredient name */
  url: (query: string) => string;
};

function q(s: string) {
  return encodeURIComponent(s.trim());
}

/** Regional grocery search links — educational shopping help, not affiliate. */
export const STORE_LINKS: StoreLink[] = [
  {
    id: "pns",
    labelEn: "ParknShop",
    labelZh: "百佳",
    url: (name) => `https://www.pns.hk/zh-hk/search?text=${q(name)}`,
  },
  {
    id: "wellcome",
    labelEn: "Wellcome",
    labelZh: "惠康",
    url: (name) => `https://www.wellcome.com.hk/zh-hk/search?q=${q(name)}`,
  },
  {
    id: "pxmart",
    labelEn: "PX Mart",
    labelZh: "全聯",
    url: (name) => `https://www.pxmart.com.tw/search?q=${q(name)}`,
  },
  {
    id: "ntuc",
    labelEn: "FairPrice",
    labelZh: "職總超市",
    url: (name) => `https://www.fairprice.com.sg/search?query=${q(name)}`,
  },
  {
    id: "google",
    labelEn: "Google Shopping",
    labelZh: "Google 購物",
    url: (name) => `https://www.google.com/search?tbm=shop&q=${q(name)}`,
  },
];

export function storesForCurrency(currency: CurrencyCode): StoreLink[] {
  if (currency === "HKD" || currency === "MOP") {
    return [STORE_LINKS[0], STORE_LINKS[1], STORE_LINKS[4]];
  }
  if (currency === "TWD") return [STORE_LINKS[2], STORE_LINKS[4]];
  if (currency === "SGD" || currency === "MYR") return [STORE_LINKS[3], STORE_LINKS[4]];
  return [STORE_LINKS[4], STORE_LINKS[0]];
}
