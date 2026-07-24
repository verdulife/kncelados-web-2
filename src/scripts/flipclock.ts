import {
  getNextMonday20EuropeMadrid,
  diffToCountdown,
  pad2,
} from "./nextMonday";

type Unit = "days" | "hours" | "minutes";

const UNIT_ORDER: Unit[] = ["days", "hours", "minutes"];

function setDigit(card: HTMLElement, newValue: string) {
  const old = card.dataset.digit;
  const next = String(newValue);
  if (old === next || !card) return;

  const topStatic = card.querySelector(".flip-top-static") as HTMLElement;
  const topLeaf = card.querySelector(".flip-top-leaf") as HTMLElement;
  const bottomStatic = card.querySelector(".flip-bottom-static") as HTMLElement;
  const bottomLeaf = card.querySelector(".flip-bottom-leaf") as HTMLElement;

  topLeaf.textContent = old;
  topStatic.textContent = next;
  bottomStatic.textContent = old;
  bottomLeaf.textContent = next;

  card.classList.remove("flipping");
  void card.offsetWidth;
  card.classList.add("flipping");

  card.dataset.digit = next;

  const onEnd = (e: AnimationEvent) => {
    if (e.target !== bottomLeaf) return;
    topLeaf.textContent = next;
    bottomStatic.textContent = next;
    card.classList.remove("flipping");
    card.removeEventListener("animationend", onEnd as EventListener);
  };
  card.addEventListener("animationend", onEnd as EventListener);
}

function getCardsForUnit(root: HTMLElement, unit: Unit): HTMLElement[] {
  const group = root.querySelector(`[data-unit="${unit}"]`);
  if (!group) return [];
  return Array.from(group.querySelectorAll("[data-flip-card]")) as HTMLElement[];
}

function renderCount(
  root: HTMLElement,
  count: { days: number; hours: number; minutes: number },
) {
  UNIT_ORDER.forEach((unit) => {
    const digits = pad2(count[unit]);
    const cards = getCardsForUnit(root, unit);
    cards.forEach((card, idx) => {
      setDigit(card, digits[idx]);
    });
  });
}

export function startFlipClock(root: HTMLElement) {
  let target = getNextMonday20EuropeMadrid();

  function updateOnce() {
    const now = new Date();
    let diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      target = getNextMonday20EuropeMadrid(now);
      diff = target.getTime() - now.getTime();
    }

    renderCount(root, diffToCountdown(diff));
  }

  updateOnce();
  document.body.classList.add("flip-ready");
  return setInterval(updateOnce, 1000);
}