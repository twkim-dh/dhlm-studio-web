
interface KakaoShareParams {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "https://mwomuk.dhlm-studio.com";
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "https://mwomuk.dhlm-studio.com";
}

function isKakaoAvailable(): boolean {
  return typeof window !== "undefined" && !!window.Kakao;
}

export function initKakao(): void {
  const kakaoKey =
    process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "e5b2dcb918ad868354738b52fa9e69be";

  function tryInit() {
    if (typeof window === "undefined") return;
    if (!window.Kakao) {
      console.log("[Kakao] SDK not yet loaded, retrying in 500ms...");
      setTimeout(tryInit, 500);
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
      console.log("[Kakao] SDK initialized.");
    } else {
      console.log("[Kakao] Already initialized.");
    }
  }

  tryInit();
}

export async function shareMenu(categoryName: string, shareCode: string): Promise<void> {
  const shareUrl = `https://mwomuk.dhlm-studio.com/s/${shareCode}`;
  const shareData = {
    title: "오늘 뭐 먹지? 🍽️",
    text: `${categoryName} - 같이 골라보자!`,
    url: shareUrl,
  };

  // Try Web Share API first (works on mobile, opens native share sheet including KakaoTalk)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      // User cancelled or error - fall through to Kakao
      if ((err as Error).name === 'AbortError') return;
    }
  }

  // Fallback to Kakao SDK
  if (isKakaoAvailable() && window.Kakao.isInitialized()) {
    const params: KakaoShareParams = {
      objectType: "feed",
      content: {
        title: shareData.title,
        description: shareData.text,
        imageUrl: "https://mwomuk.dhlm-studio.com/og-share.png?v=1",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "메뉴 골라보기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    };
    window.Kakao.Share.sendDefault(params);
  } else {
    // Final fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다! 카카오톡에 붙여넣기 해주세요.');
    } catch {
      prompt('아래 링크를 복사해주세요:', shareUrl);
    }
  }
}

export async function shareResult(matchCount: number, sessionId: string): Promise<void> {
  const resultUrl = `https://mwomuk.dhlm-studio.com/result/${sessionId}`;
  const baseUrl = getBaseUrl();
  const shareData = {
    title: `우리 겹치는 메뉴 ${matchCount}개! 🎉`,
    text: "오늘 저녁은 이거다!",
    url: resultUrl,
  };

  // Try Web Share API first (works on mobile, opens native share sheet including KakaoTalk)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      // User cancelled or error - fall through to Kakao
      if ((err as Error).name === 'AbortError') return;
    }
  }

  // Fallback to Kakao SDK
  if (isKakaoAvailable() && window.Kakao.isInitialized()) {
    const params: KakaoShareParams = {
      objectType: "feed",
      content: {
        title: shareData.title,
        description: shareData.text,
        imageUrl: "https://mwomuk.dhlm-studio.com/og-share.png?v=1",
        link: {
          mobileWebUrl: resultUrl,
          webUrl: resultUrl,
        },
      },
      buttons: [
        {
          title: "결과 보기",
          link: {
            mobileWebUrl: resultUrl,
            webUrl: resultUrl,
          },
        },
        {
          title: "나도 해보기",
          link: {
            mobileWebUrl: baseUrl,
            webUrl: baseUrl,
          },
        },
      ],
    };
    window.Kakao.Share.sendDefault(params);
  } else {
    // Final fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(resultUrl);
      alert('링크가 복사되었습니다! 카카오톡에 붙여넣기 해주세요.');
    } catch {
      prompt('아래 링크를 복사해주세요:', resultUrl);
    }
  }
}
