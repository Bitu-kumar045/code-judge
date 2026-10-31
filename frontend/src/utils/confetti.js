import confetti from 'canvas-confetti';

export function fireAcceptedConfetti() {
  try {
    // Left cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10B981', '#6366F1', '#8B5CF6', '#3B82F6', '#F59E0B']
    });

    // Right cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#10B981', '#6366F1', '#8B5CF6', '#3B82F6', '#F59E0B']
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['circle', 'square'],
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });
    }, 250);
  } catch (err) {
    console.warn('Confetti trigger ignored:', err);
  }
}

