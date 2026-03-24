const KAKAO_KEY = "ea95354167038ebb0be11c1aae1ffe26";
const DOMAIN = "https://balance.dhlm-studio.com";


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

export function shareBalance(questionText: string): void {
  const title = "오늘의 밸런스";
  const text = `${questionText}, 너는 어느 쪽? ⚡`;
  const url = DOMAIN;

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
          title: "나도 투표하기",
          link: { mobileWebUrl: url, webUrl: url },
        },
      ],
    });
  }
}

export function shareResult(
  questionText: string,
  myChoice: string,
  percentA: number,
  percentB: number
): void {
  const title = "오늘의 밸런스 결과";
  const optionA = questionText.split(" vs ")[0] || questionText;
  const optionB = questionText.split(" vs ")[1] || questionText;
  const text = `${optionA} ${percentA}% vs ${optionB} ${percentB}% — 나는 ${myChoice}! 😋`;
  const url = DOMAIN;

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
          title: "나도 투표하기",
          link: { mobileWebUrl: url, webUrl: url },
        },
      ],
    });
  }
}
