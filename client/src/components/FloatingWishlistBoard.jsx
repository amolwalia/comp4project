import { useEffect, useMemo, useRef, useState } from 'react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);

const randomBetween = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function buildConfig(itemId) {
  return {
    id: itemId,
    amplitude: randomBetween(6, 16),
    duration: randomBetween(3, 8),
    delay: randomBetween(0, 1.6),
    entranceDelay: randomBetween(0, 0.6),
    tilt: randomBetween(-2, 2)
  };
}

function assignLayout(items, containerSize, baseConfigs) {
  const width = containerSize.width || 900;
  const height = containerSize.height || 460;
  const padding = 24;
  const minSize = 140;
  const maxSize = 190;
  const placed = [];

  return items.map((item) => {
    const config = baseConfigs.get(item.id);
    const size = randomBetween(minSize, maxSize);
    const radius = size / 2;
    const maxX = Math.max(padding + radius, width - padding - radius);
    const maxY = Math.max(padding + radius, height - padding - radius);
    const minX = padding + radius;
    const minY = padding + radius;

    let attempt = 0;
    let x = randomBetween(minX, maxX);
    let y = randomBetween(minY, maxY);

    while (attempt < 40) {
      const isTooClose = placed.some((placedItem) => {
        const dx = x - placedItem.x;
        const dy = y - placedItem.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = (radius + placedItem.radius) * 0.7;
        return distance < minDistance;
      });

      if (!isTooClose) break;
      x = randomBetween(minX, maxX);
      y = randomBetween(minY, maxY);
      attempt += 1;
    }

    const centerX = clamp(x / width, 0.05, 0.95);
    const centerY = clamp(y / height, 0.05, 0.95);
    const distance = Math.hypot(centerX - 0.5, centerY - 0.5) / 0.7;

    placed.push({ x, y, radius });

    return {
      ...config,
      size,
      x: centerX,
      y: centerY,
      depth: Math.min(1.1, 0.35 + distance * 0.75)
    };
  });
}

function FloatingCard({ item, config, parallax, onSelect }) {
  return (
    <div
      className="moodboard-item"
      style={{
        top: `${config.y * 100}%`,
        left: `${config.x * 100}%`,
        '--tile-size': `${config.size}px`,
        '--entrance-delay': `${config.entranceDelay}s`,
        '--tilt': `${config.tilt}deg`,
        '--parallax-x': `${parallax.x * config.depth}px`,
        '--parallax-y': `${parallax.y * config.depth}px`,
        '--float-amplitude': `${config.amplitude}px`,
        '--float-duration': `${config.duration}s`,
        '--float-delay': `${config.delay}s`
      }}
    >
      <div className="moodboard-float">
        <button
          type="button"
          className="moodboard-tile"
          onMouseEnter={() => onSelect?.(item)}
          onFocus={() => onSelect?.(item)}
        >
          <img src={item.imageUrl} alt={item.name} loading="lazy" />
          <div className="moodboard-meta">
            <strong>{item.name}</strong>
            <span>{formatCurrency(item.price)}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function FloatingWishlistBoard({ items = [], onSelect }) {
  const containerRef = useRef(null);
  const configsRef = useRef(new Map());
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (event) => {
      const bounds = container.getBoundingClientRect();
      const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
      const nextX = Math.max(-0.5, Math.min(0.5, relX)) * 40;
      const nextY = Math.max(-0.5, Math.min(0.5, relY)) * 40;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setParallax({ x: nextX, y: nextY });
      });
    };

    const handleLeave = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setParallax({ x: 0, y: 0 });
      });
    };

    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerleave', handleLeave);

    return () => {
      container.removeEventListener('pointermove', handleMove);
      container.removeEventListener('pointerleave', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const cardConfigs = useMemo(() => {
    const map = configsRef.current;
    const next = items.map((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, buildConfig(item.id));
      }
      return map.get(item.id);
    });
    return assignLayout(items, containerSize, map);
  }, [items, containerSize.width, containerSize.height]);

  if (!items.length) {
    return (
      <div className="empty-card">
        <h3>Your orb is empty</h3>
        <p>Add your first wishlist item to start shaping the sphere.</p>
      </div>
    );
  }

  return (
    <div className="moodboard-shell" ref={containerRef}>
      <div
        className="moodboard-canvas"
        style={{
          minHeight: containerSize.width < 700 ? 360 : 460
        }}
      >
        {items.map((item, index) => (
          <FloatingCard
            key={item.id}
            item={item}
            config={cardConfigs[index]}
            parallax={parallax}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
