// @vitest-environment jsdom

import { ComponentProps, act } from "react";
import { createRoot } from "react-dom/client";
import type { Issue } from "@paperclipai/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routerMock = {
  location: { pathname: "/PAP/inbox/mine", search: "", hash: "", state: null, key: "default" },
  navigate: vi.fn(),
};

vi.mock("../context/GeneralSettingsContext", () => ({
  useGeneralSettings: () => ({ keyboardShortcutsEnabled: false }),
}));

vi.mock("../hooks/useInboxBadge", () => ({
  useDismissedInboxAlerts: () => ({ dismissed: new Set(), dismiss: vi.fn() }),
  useInboxDismissals: () => ({ dismissedAtByKey: new Map(), dismiss: vi.fn() }),
  useReadInboxItems: () => ({
    readItems: new Set(),
    markRead: vi.fn(),
    markUnread: vi.fn(),
  }),
}));

import {
  InboxIssueMetaLeading,
} from "./Inbox";

vi.mock("@/lib/router", () => ({
  Link: ({ children, className, ...props }: ComponentProps<"a">) => (
    <a className={className} {...props}>{children}</a>
  ),
  useLocation: () => routerMock.location,
  useNavigate: () => routerMock.navigate,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function createIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: "issue-1",
    identifier: "PAP-904",
    companyId: "company-1",
    projectId: null,
    projectWorkspaceId: null,
    goalId: null,
    parentId: null,
    title: "Inbox item",
    description: null,
    status: "todo",
    priority: "medium",
    assigneeAgentId: null,
    assigneeUserId: null,
    createdByAgentId: null,
    createdByUserId: null,
    issueNumber: 904,
    requestDepth: 0,
    billingCode: null,
    assigneeAdapterOverrides: null,
    executionWorkspaceId: null,
    executionWorkspacePreference: null,
    executionWorkspaceSettings: null,
    checkoutRunId: null,
    executionRunId: null,
    executionAgentNameKey: null,
    executionLockedAt: null,
    startedAt: null,
    completedAt: null,
    cancelledAt: null,
    hiddenAt: null,
    createdAt: new Date("2026-03-11T00:00:00.000Z"),
    updatedAt: new Date("2026-03-11T00:00:00.000Z"),
    labels: [],
    labelIds: [],
    myLastTouchAt: null,
    lastExternalCommentAt: null,
    isUnreadForMe: false,
    ...overrides,
    workMode: overrides.workMode ?? "standard",
  };
}

describe("InboxIssueMetaLeading", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("keeps status and live accents visible", () => {
    const root = createRoot(container);

    act(() => {
      root.render(<InboxIssueMetaLeading issue={createIssue()} isLive />);
    });

    const statusIcon = container.querySelector('span[class*="border-roman-aqua"]');
    const liveBadge = container.querySelector('span[class*="bg-roman-aqua/10"]');
    const liveBadgeLabel = Array.from(container.querySelectorAll("span")).find(
      (node) => node.textContent === "Live" && node.className.includes("text-roman-aqua"),
    );
    const liveDot = container.querySelector('span[class*="bg-roman-aqua"]');
    const pulseRing = container.querySelector('span[class*="animate-pulse"]');

    expect(statusIcon).not.toBeNull();
    expect(liveBadge).not.toBeNull();
    expect(liveBadge?.className).toContain("bg-roman-aqua/10");
    expect(liveBadgeLabel).not.toBeNull();
    expect(liveBadgeLabel?.className).toContain("text-roman-aqua");
    expect(liveDot).not.toBeNull();
    expect(pulseRing).not.toBeNull();

    act(() => {
      root.unmount();
    });
  });
});
