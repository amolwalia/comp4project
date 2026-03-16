function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

export default function WishlistList({ items, selectedId, onSelect, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="empty-card">
        <h3>Your orb is empty</h3>
        <p>Add your first wishlist item to start shaping the sphere.</p>
      </div>
    );
  }

  return (
    <div className="wishlist-list">
      {items.map((item) => (
        <article
          key={item.id}
          className={`wishlist-card ${selectedId === item.id ? 'active' : ''}`}
          onMouseEnter={() => onSelect(item)}
        >
          <img src={item.imageUrl} alt={item.name} />
          <div className="wishlist-card-content">
            <div>
              <h3>{item.name}</h3>
              <p>{formatCurrency(item.price)}</p>
            </div>
            <div className="wishlist-card-actions">
              <a href={item.productLink} target="_blank" rel="noreferrer">
                View
              </a>
              <button type="button" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button type="button" className="danger-text" onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

