import { useEffect, useState } from 'react';
import FloatingWishlistBoard from './FloatingWishlistBoard';

export default function OrbSphere({
  items,
  activeItem,
  onSelect,
  moodboardOnly,
  onToggleMoodboard,
  moodboardPulse,
  onMoodboardPulseEnd
}) {
  const [selected, setSelected] = useState(activeItem ?? null);

  useEffect(() => {
    if (activeItem) {
      setSelected(activeItem);
    }
  }, [activeItem]);

  useEffect(() => {
    if (!items?.length) {
      setSelected(null);
      return;
    }

    if (!selected || !items.some((item) => item.id === selected.id)) {
      setSelected(items[0]);
      onSelect?.(items[0]);
    }
  }, [items]);

  return (
    <section className="orb-panel">
      <div className="orb-header">
        <div>
          <span className="eyebrow">Mood board</span>
          <h2>Your wishlist wall</h2>
        </div>
        <p>Hover a tile to preview the item details.</p>
      </div>

      <div className="orb-stage orb-stage--moodboard">
        <FloatingWishlistBoard
          items={items}
          variant="moodboard"
          onSelect={(item) => {
            setSelected(item);
            onSelect?.(item);
          }}
        />
      </div>

      <div className="orb-detail-card">
        {selected ? (
          <>
            <img src={selected.imageUrl} alt={selected.name} />
            <div>
              <h3>{selected.name}</h3>
              <p>${Number(selected.price).toFixed(2)}</p>
              <a href={selected.productLink} target="_blank" rel="noreferrer">
                Open product link
              </a>
            </div>
          </>
        ) : (
          <div className="orb-empty-message">
            <h3>Nothing selected</h3>
            <p>Add your first wishlist item to populate the mood board.</p>
          </div>
        )}
      </div>

      <div className="orb-actions">
        <button
          type="button"
          className={`moodboard-toggle ${moodboardOnly ? 'is-active' : ''} ${
            moodboardPulse ? 'is-pulsing' : ''
          }`}
          onClick={onToggleMoodboard}
          onAnimationEnd={onMoodboardPulseEnd}
        >
          {moodboardOnly ? 'Exit mood board' : 'Open mood board'}
        </button>
      </div>
    </section>
  );
}
