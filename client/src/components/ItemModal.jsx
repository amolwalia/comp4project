import { useEffect, useState } from 'react';

const emptyItem = {
  name: '',
  imageUrl: '',
  price: '',
  productLink: ''
};

export default function ItemModal({ open, mode, item, saving, error, onClose, onSave }) {
  const [form, setForm] = useState(emptyItem);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        productLink: item.productLink
      });
    } else {
      setForm(emptyItem);
    }
  }, [item, open]);

  if (!open) {
    return null;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...form,
      price: form.price === '' ? 0 : Number(form.price)
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">{mode === 'create' ? 'New item' : 'Update item'}</span>
            <h3>{mode === 'create' ? 'Add to your orb' : 'Edit wishlist item'}</h3>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="item-form" onSubmit={handleSubmit}>
          <label>
            <span>Item name</span>
            <input name="name" value={form.name} onChange={updateField} required />
          </label>
          <label>
            <span>Image URL</span>
            <input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} required />
          </label>
          <label>
            <span>Price</span>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={updateField}
              required
            />
          </label>
          <label>
            <span>Product link</span>
            <input
              name="productLink"
              type="url"
              value={form.productLink}
              onChange={updateField}
              required
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : mode === 'create' ? 'Add item' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

