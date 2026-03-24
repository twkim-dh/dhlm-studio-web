export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  emoji: string;
}

export interface Session {
  id: string;
  creatorId: string;
  categoryId: string;
  shareCode: string;
  status: "waiting" | "completed";
  createdAt: string;
}

export interface Selection {
  id: string;
  sessionId: string;
  userType: "creator" | "respondent";
  menuIds: string[];
  respondentId?: string;
  respondentName?: string;
  createdAt: string;
}

export interface MatchResult {
  id: string;
  sessionId: string;
  respondentId: string;
  respondentName: string;
  matchedMenus: string[];
  creatorMenus: string[];
  respondentMenus: string[];
  matchCount: number;
  createdAt: string;
}
