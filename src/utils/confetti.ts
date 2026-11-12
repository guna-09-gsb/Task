import confetti from 'canvas-confetti';

/**
 * Fires a celebratory confetti burst when a task is completed.
 * Uses pleasant, vibrant task celebration colors.
 */
export function fireTaskConfetti(originX = 0.5, originY = 0.6) {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });
  } catch {
    // Graceful fallback if canvas is not supported
  }
}

/**
 * Fires a grand celebration when all tasks are finished!
 */
export function fireGrandCelebration() {
  try {
    const duration = 1.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#ec4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } catch {
    // Ignore canvas errors
  }
}
