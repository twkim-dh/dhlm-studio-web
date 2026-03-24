import type { MenuCategory, MenuItem } from "@/types/mwomuk";

// ---------------------------------------------------------------------------
// 8 Categories
// ---------------------------------------------------------------------------

export const categories: MenuCategory[] = [
  { id: "korean", name: "한식", emoji: "\uD83C\uDF5A" },
  { id: "chinese", name: "중식", emoji: "\uD83E\uDD5F" },
  { id: "japanese", name: "일식", emoji: "\uD83C\uDF63" },
  { id: "western", name: "양식", emoji: "\uD83C\uDF5D" },
  { id: "chicken", name: "치킨", emoji: "\uD83C\uDF57" },
  { id: "pizza", name: "피자", emoji: "\uD83C\uDF55" },
  { id: "snack", name: "분식", emoji: "\uD83C\uDF5C" },
  { id: "cafe", name: "카페", emoji: "\u2615" },
];

// ---------------------------------------------------------------------------
// 120 Menu Items (15 per category)
// ---------------------------------------------------------------------------

export const menus: MenuItem[] = [
  // korean (한식) - 15 items
  { id: "korean-1", categoryId: "korean", name: "김치찌개", emoji: "\uD83C\uDF72" },
  { id: "korean-2", categoryId: "korean", name: "된장찌개", emoji: "\uD83C\uDF5C" },
  { id: "korean-3", categoryId: "korean", name: "비빔밥", emoji: "\uD83C\uDF5A" },
  { id: "korean-4", categoryId: "korean", name: "불고기", emoji: "\uD83E\uDD69" },
  { id: "korean-5", categoryId: "korean", name: "삼겹살", emoji: "\uD83E\uDD53" },
  { id: "korean-6", categoryId: "korean", name: "제육볶음", emoji: "\uD83C\uDF56" },
  { id: "korean-7", categoryId: "korean", name: "김밥", emoji: "\uD83C\uDF63" },
  { id: "korean-8", categoryId: "korean", name: "떡볶이", emoji: "\uD83C\uDF36\uFE0F" },
  { id: "korean-9", categoryId: "korean", name: "순두부찌개", emoji: "\uD83E\uDD6B" },
  { id: "korean-10", categoryId: "korean", name: "갈비탕", emoji: "\uD83C\uDF56" },
  { id: "korean-11", categoryId: "korean", name: "냉면", emoji: "\uD83C\uDF5C" },
  { id: "korean-12", categoryId: "korean", name: "잔치국수", emoji: "\uD83C\uDF5C" },
  { id: "korean-13", categoryId: "korean", name: "칼국수", emoji: "\uD83C\uDF5C" },
  { id: "korean-14", categoryId: "korean", name: "부대찌개", emoji: "\uD83C\uDF72" },
  { id: "korean-15", categoryId: "korean", name: "쌈밥", emoji: "\uD83E\uDD57" },

  // chinese (중식) - 15 items
  { id: "chinese-1", categoryId: "chinese", name: "짜장면", emoji: "\uD83C\uDF5C" },
  { id: "chinese-2", categoryId: "chinese", name: "짬뽕", emoji: "\uD83C\uDF36\uFE0F" },
  { id: "chinese-3", categoryId: "chinese", name: "탕수육", emoji: "\uD83C\uDF56" },
  { id: "chinese-4", categoryId: "chinese", name: "볶음밥", emoji: "\uD83C\uDF5A" },
  { id: "chinese-5", categoryId: "chinese", name: "마파두부", emoji: "\uD83E\uDD6B" },
  { id: "chinese-6", categoryId: "chinese", name: "깐풍기", emoji: "\uD83C\uDF57" },
  { id: "chinese-7", categoryId: "chinese", name: "양장피", emoji: "\uD83E\uDD57" },
  { id: "chinese-8", categoryId: "chinese", name: "팔보채", emoji: "\uD83E\uDD58" },
  { id: "chinese-9", categoryId: "chinese", name: "유산슬", emoji: "\uD83E\uDD58" },
  { id: "chinese-10", categoryId: "chinese", name: "라조기", emoji: "\uD83C\uDF36\uFE0F" },
  { id: "chinese-11", categoryId: "chinese", name: "고추잡채", emoji: "\uD83E\uDD66" },
  { id: "chinese-12", categoryId: "chinese", name: "군만두", emoji: "\uD83E\uDD5F" },
  { id: "chinese-13", categoryId: "chinese", name: "울면", emoji: "\uD83C\uDF5C" },
  { id: "chinese-14", categoryId: "chinese", name: "잡채밥", emoji: "\uD83C\uDF5A" },
  { id: "chinese-15", categoryId: "chinese", name: "마라탕", emoji: "\uD83C\uDF36\uFE0F" },

  // japanese (일식) - 15 items
  { id: "japanese-1", categoryId: "japanese", name: "초밥", emoji: "\uD83C\uDF63" },
  { id: "japanese-2", categoryId: "japanese", name: "라멘", emoji: "\uD83C\uDF5C" },
  { id: "japanese-3", categoryId: "japanese", name: "돈카츠", emoji: "\uD83C\uDF56" },
  { id: "japanese-4", categoryId: "japanese", name: "우동", emoji: "\uD83C\uDF5C" },
  { id: "japanese-5", categoryId: "japanese", name: "카레", emoji: "\uD83C\uDF5B" },
  { id: "japanese-6", categoryId: "japanese", name: "덮밥", emoji: "\uD83C\uDF5A" },
  { id: "japanese-7", categoryId: "japanese", name: "소바", emoji: "\uD83C\uDF5C" },
  { id: "japanese-8", categoryId: "japanese", name: "타코야키", emoji: "\uD83E\uDDC6" },
  { id: "japanese-9", categoryId: "japanese", name: "오니기리", emoji: "\uD83C\uDF59" },
  { id: "japanese-10", categoryId: "japanese", name: "규동", emoji: "\uD83C\uDF5A" },
  { id: "japanese-11", categoryId: "japanese", name: "사시미", emoji: "\uD83E\uDD62" },
  { id: "japanese-12", categoryId: "japanese", name: "텐동", emoji: "\uD83C\uDF64" },
  { id: "japanese-13", categoryId: "japanese", name: "오코노미야키", emoji: "\uD83E\uDD5E" },
  { id: "japanese-14", categoryId: "japanese", name: "나가사키짬뽕", emoji: "\uD83C\uDF5C" },
  { id: "japanese-15", categoryId: "japanese", name: "가츠동", emoji: "\uD83C\uDF5A" },

  // western (양식) - 15 items
  { id: "western-1", categoryId: "western", name: "파스타", emoji: "\uD83C\uDF5D" },
  { id: "western-2", categoryId: "western", name: "피자", emoji: "\uD83C\uDF55" },
  { id: "western-3", categoryId: "western", name: "스테이크", emoji: "\uD83E\uDD69" },
  { id: "western-4", categoryId: "western", name: "햄버거", emoji: "\uD83C\uDF54" },
  { id: "western-5", categoryId: "western", name: "리조또", emoji: "\uD83C\uDF5A" },
  { id: "western-6", categoryId: "western", name: "오므라이스", emoji: "\uD83C\uDF73" },
  { id: "western-7", categoryId: "western", name: "샐러드", emoji: "\uD83E\uDD57" },
  { id: "western-8", categoryId: "western", name: "샌드위치", emoji: "\uD83E\uDD6A" },
  { id: "western-9", categoryId: "western", name: "그라탕", emoji: "\uD83E\uDDC0" },
  { id: "western-10", categoryId: "western", name: "필라프", emoji: "\uD83C\uDF5A" },
  { id: "western-11", categoryId: "western", name: "미트볼", emoji: "\uD83E\uDDC6" },
  { id: "western-12", categoryId: "western", name: "라자냐", emoji: "\uD83C\uDF5D" },
  { id: "western-13", categoryId: "western", name: "크림스프", emoji: "\uD83C\uDF5C" },
  { id: "western-14", categoryId: "western", name: "갈릭브레드", emoji: "\uD83C\uDF5E" },
  { id: "western-15", categoryId: "western", name: "브런치", emoji: "\uD83E\uDD5E" },

  // chicken (치킨) - 15 items
  { id: "chicken-1", categoryId: "chicken", name: "후라이드", emoji: "\uD83C\uDF57" },
  { id: "chicken-2", categoryId: "chicken", name: "양념치킨", emoji: "\uD83C\uDF57" },
  { id: "chicken-3", categoryId: "chicken", name: "간장치킨", emoji: "\uD83C\uDF57" },
  { id: "chicken-4", categoryId: "chicken", name: "마늘치킨", emoji: "\uD83E\uDDC4" },
  { id: "chicken-5", categoryId: "chicken", name: "파닭", emoji: "\uD83E\uDD66" },
  { id: "chicken-6", categoryId: "chicken", name: "치킨텐더", emoji: "\uD83C\uDF57" },
  { id: "chicken-7", categoryId: "chicken", name: "순살치킨", emoji: "\uD83C\uDF57" },
  { id: "chicken-8", categoryId: "chicken", name: "허니버터", emoji: "\uD83C\uDF6F" },
  { id: "chicken-9", categoryId: "chicken", name: "매운치킨", emoji: "\uD83C\uDF36\uFE0F" },
  { id: "chicken-10", categoryId: "chicken", name: "반반치킨", emoji: "\uD83C\uDF57" },
  { id: "chicken-11", categoryId: "chicken", name: "치즈치킨", emoji: "\uD83E\uDDC0" },
  { id: "chicken-12", categoryId: "chicken", name: "뿌링클", emoji: "\uD83C\uDF57" },
  { id: "chicken-13", categoryId: "chicken", name: "고추바사삭", emoji: "\uD83C\uDF36\uFE0F" },
  { id: "chicken-14", categoryId: "chicken", name: "크리스피", emoji: "\uD83C\uDF57" },
  { id: "chicken-15", categoryId: "chicken", name: "숯불치킨", emoji: "\uD83D\uDD25" },

  // pizza (피자) - 15 items
  { id: "pizza-1", categoryId: "pizza", name: "페퍼로니", emoji: "\uD83C\uDF55" },
  { id: "pizza-2", categoryId: "pizza", name: "치즈피자", emoji: "\uD83E\uDDC0" },
  { id: "pizza-3", categoryId: "pizza", name: "불고기피자", emoji: "\uD83C\uDF55" },
  { id: "pizza-4", categoryId: "pizza", name: "포테이토", emoji: "\uD83E\uDD54" },
  { id: "pizza-5", categoryId: "pizza", name: "하와이안", emoji: "\uD83C\uDF4D" },
  { id: "pizza-6", categoryId: "pizza", name: "고구마피자", emoji: "\uD83C\uDF60" },
  { id: "pizza-7", categoryId: "pizza", name: "콤비네이션", emoji: "\uD83C\uDF55" },
  { id: "pizza-8", categoryId: "pizza", name: "바베큐", emoji: "\uD83C\uDF56" },
  { id: "pizza-9", categoryId: "pizza", name: "마르게리따", emoji: "\uD83C\uDF45" },
  { id: "pizza-10", categoryId: "pizza", name: "쉬림프", emoji: "\uD83E\uDD90" },
  { id: "pizza-11", categoryId: "pizza", name: "미트러버", emoji: "\uD83E\uDD69" },
  { id: "pizza-12", categoryId: "pizza", name: "치즈크러스트", emoji: "\uD83E\uDDC0" },
  { id: "pizza-13", categoryId: "pizza", name: "씬피자", emoji: "\uD83C\uDF55" },
  { id: "pizza-14", categoryId: "pizza", name: "시카고딥디쉬", emoji: "\uD83C\uDF55" },
  { id: "pizza-15", categoryId: "pizza", name: "갈릭피자", emoji: "\uD83E\uDDC4" },

  // snack (분식) - 15 items
  { id: "snack-1", categoryId: "snack", name: "떡볶이", emoji: "\uD83C\uDF36\uFE0F" },
  { id: "snack-2", categoryId: "snack", name: "순대", emoji: "\uD83C\uDF2D" },
  { id: "snack-3", categoryId: "snack", name: "튀김", emoji: "\uD83C\uDF64" },
  { id: "snack-4", categoryId: "snack", name: "김밥", emoji: "\uD83C\uDF63" },
  { id: "snack-5", categoryId: "snack", name: "라면", emoji: "\uD83C\uDF5C" },
  { id: "snack-6", categoryId: "snack", name: "쫄면", emoji: "\uD83C\uDF5C" },
  { id: "snack-7", categoryId: "snack", name: "비빔면", emoji: "\uD83C\uDF5C" },
  { id: "snack-8", categoryId: "snack", name: "만두", emoji: "\uD83E\uDD5F" },
  { id: "snack-9", categoryId: "snack", name: "어묵", emoji: "\uD83E\uDED5" },
  { id: "snack-10", categoryId: "snack", name: "핫도그", emoji: "\uD83C\uDF2D" },
  { id: "snack-11", categoryId: "snack", name: "토스트", emoji: "\uD83C\uDF5E" },
  { id: "snack-12", categoryId: "snack", name: "붕어빵", emoji: "\uD83D\uDC1F" },
  { id: "snack-13", categoryId: "snack", name: "호떡", emoji: "\uD83E\uDD5E" },
  { id: "snack-14", categoryId: "snack", name: "계란빵", emoji: "\uD83E\uDD5A" },
  { id: "snack-15", categoryId: "snack", name: "닭꼬치", emoji: "\uD83C\uDF62" },

  // cafe (카페) - 15 items
  { id: "cafe-1", categoryId: "cafe", name: "아메리카노", emoji: "\u2615" },
  { id: "cafe-2", categoryId: "cafe", name: "카페라떼", emoji: "\u2615" },
  { id: "cafe-3", categoryId: "cafe", name: "카푸치노", emoji: "\u2615" },
  { id: "cafe-4", categoryId: "cafe", name: "바닐라라떼", emoji: "\uD83E\uDD5B" },
  { id: "cafe-5", categoryId: "cafe", name: "녹차라떼", emoji: "\uD83C\uDF75" },
  { id: "cafe-6", categoryId: "cafe", name: "초코라떼", emoji: "\uD83C\uDF6B" },
  { id: "cafe-7", categoryId: "cafe", name: "스무디", emoji: "\uD83E\uDD64" },
  { id: "cafe-8", categoryId: "cafe", name: "프라푸치노", emoji: "\uD83E\uDD64" },
  { id: "cafe-9", categoryId: "cafe", name: "아이스티", emoji: "\uD83E\uDDCA" },
  { id: "cafe-10", categoryId: "cafe", name: "에이드", emoji: "\uD83C\uDF4B" },
  { id: "cafe-11", categoryId: "cafe", name: "밀크쉐이크", emoji: "\uD83E\uDD5B" },
  { id: "cafe-12", categoryId: "cafe", name: "와플", emoji: "\uD83E\uDDC7" },
  { id: "cafe-13", categoryId: "cafe", name: "케이크", emoji: "\uD83C\uDF70" },
  { id: "cafe-14", categoryId: "cafe", name: "마카롱", emoji: "\uD83C\uDF6A" },
  { id: "cafe-15", categoryId: "cafe", name: "크로플", emoji: "\uD83E\uDDC7" },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getMenusByCategory(categoryId: string): MenuItem[] {
  return menus.filter((m) => m.categoryId === categoryId);
}

export function getMenuById(id: string): MenuItem | undefined {
  return menus.find((m) => m.id === id);
}

export function getCategoryById(categoryId: string): MenuCategory | undefined {
  return categories.find((cat) => cat.id === categoryId);
}
