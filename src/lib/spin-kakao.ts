const KAKAO_KEY = "ea95354167038ebb0be11c1aae1ffe26";
const DOMAIN = "https://dhlm-studio.com/spin";


export function initKakao(): void {
  if (typeof window === "undefined") return;

  const tryInit = (retries = 5) => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_KEY);
      }
    } else if (retries > 0) {
      setTimeout(() => tryInit(retries - 1), 500);
    }
  };

  tryInit();
}

function webShare(title: string, text: string, url: string): boolean {
  if (typeof navigator !== "undefined" && navigator.share) {
    navigator
      .share({ title, text, url })
      .catch(() => {});
    return true;
  }
  return false;
}

export function shareResult(result: string, items: string[]): void {
  const title = "돌려돌려 룰렛 결과";
  const text = `${items.length}개 중 당첨: ${result}! 🎰`;
  const url = `${DOMAIN}/roulette?items=${encodeURIComponent(items.join(","))}`;

  if (webShare(title, text, url)) return;

  if (window.Kakao?.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description: text,
        imageUrl: `${DOMAIN}/og-image.png`,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [
        {
          title: "나도 돌려보기",
          link: { mobileWebUrl: url, webUrl: url },
        },
      ],
    });
  }
}
