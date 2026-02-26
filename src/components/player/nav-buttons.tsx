"use client";

// Nav buttons have been moved to a fixed bottom bar in tutorial-player.
// This component is kept as a no-op so card imports don't break.

interface NavButtonsProps {
  showBack: boolean;
  onBack: () => void;
  onContinue: () => void;
  cta?: string;
}

export function NavButtons(_props: NavButtonsProps) {
  return null;
}
