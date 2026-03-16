import { useEffect, useRef, useState } from 'react';

function buildOrbPoints(items) {
  const count = items.length;
  const radius = count > 8 ? 220 : 180;

  return items.map((item, index) => {
    const phi = Math.acos(1 - (2 * (index + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi) * 0.9;
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const depthScale = (z + radius) / (radius * 2);

    return {
      item,
      style: {
        transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${0.7 + depthScale * 0.55})`,
        opacity: 0.5 + depthScale * 0.6,
        zIndex: Math.round(depthScale * 100)
      }
    };
  });
}

export default function OrbSphere({ items, activeItem, onSelect }) {
  const [rotation, setRotation] = useState({ x: -14, y: 0 });
  const dragState = useRef(null);

  useEffect(() => {
    let frameId = 0;
    let angle = 0;

    function animate() {
      angle += 0.12;
      setRotation((current) => {
        if (dragState.current?.dragging) {
          return current;
        }

        return {
          x: current.x,
          y: angle
        };
      });
      frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const points = items.length ? buildOrbPoints(items) : [];

  function handlePointerDown(event) {
    dragState.current = {
      dragging: true,
      x: event.clientX,
      y: event.clientY,
      startRotation: rotation
    };
  }

  function handlePointerMove(event) {
    if (!dragState.current?.dragging) {
      return;
    }

    const deltaX = event.clientX - dragState.current.x;
    const deltaY = event.clientY - dragState.current.y;

    setRotation({
      x: Math.max(-40, Math.min(25, dragState.current.startRotation.x - deltaY * 0.08)),
      y: dragState.current.startRotation.y + deltaX * 0.18
    });
  }

  function handlePointerUp() {
    if (dragState.current) {
      dragState.current.dragging = false;
    }
  }

  return (
    <section className="orb-panel">
      <div className="orb-header">
        <div>
          <span className="eyebrow">Orb view</span>
          <h2>Your wishlist constellation</h2>
        </div>
        <p>Hover or drag for a closer look.</p>
      </div>

      <div
        className="orb-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="orb-glow" />
        <div
          className="orb-core"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          <div className="orb-shell" />
          {points.map(({ item, style }) => (
            <button
              key={item.id}
              type="button"
              className={`orb-node ${activeItem?.id === item.id ? 'active' : ''}`}
              style={style}
              onMouseEnter={() => onSelect(item)}
              onFocus={() => onSelect(item)}
              onClick={() => onSelect(item)}
            >
              <img src={item.imageUrl} alt={item.name} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="orb-detail-card">
        {activeItem ? (
          <>
            <img src={activeItem.imageUrl} alt={activeItem.name} />
            <div>
              <h3>{activeItem.name}</h3>
              <p>${Number(activeItem.price).toFixed(2)}</p>
              <a href={activeItem.productLink} target="_blank" rel="noreferrer">
                Open product link
              </a>
            </div>
          </>
        ) : (
          <div className="orb-empty-message">
            <h3>Nothing selected</h3>
            <p>Hover a node in the orb to inspect the item details.</p>
          </div>
        )}
      </div>
    </section>
  );
}

