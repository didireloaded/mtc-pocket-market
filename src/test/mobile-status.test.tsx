// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { NetworkStatus } from "@/components/NetworkStatus";

const originalOnline = Object.getOwnPropertyDescriptor(window.navigator, "onLine");
const setOnline = (online: boolean) => {
  Object.defineProperty(window.navigator, "onLine", { configurable: true, value: online });
};

afterEach(() => {
  cleanup();
  if (originalOnline) Object.defineProperty(window.navigator, "onLine", originalOnline);
});

describe("mobile offline feedback", () => {
  it("announces the loss of connectivity without promising offline transactions", () => {
    setOnline(false);
    render(<NetworkStatus />);
    const status = screen.getByRole("status");
    expect(status.textContent).toContain("You're offline.");
    expect(status.textContent).toContain("account actions, orders and live updates need an internet connection");
  });

  it("clears the offline message when the connection returns", () => {
    setOnline(false);
    render(<NetworkStatus />);
    expect(screen.getByRole("status")).not.toBeNull();
    act(() => {
      setOnline(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.queryByRole("status")).toBeNull();
  });
});
