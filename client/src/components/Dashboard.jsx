import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import ItemModal from './ItemModal';
import LoadingScreen from './LoadingScreen';
import OrbSphere from './OrbSphere';
import StatsPanel from './StatsPanel';
import WishlistList from './WishlistList';

const emptyState = {
  items: [],
  stats: {
    totalItems: 0,
    totalValue: 0
  }
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [wishlist, setWishlist] = useState(emptyState);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [modalState, setModalState] = useState({ open: false, mode: 'create', item: null });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [pageError, setPageError] = useState('');
  const [moodboardOnly, setMoodboardOnly] = useState(false);
  const [moodboardPulse, setMoodboardPulse] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    if (!wishlist.items.length) {
      setActiveItem(null);
      return;
    }

    const currentActive = wishlist.items.find((item) => item.id === activeItem?.id);
    setActiveItem(currentActive || wishlist.items[0]);
  }, [wishlist.items]);

  async function loadWishlist() {
    setLoading(true);
    setPageError('');

    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setModalError('');
    setModalState({ open: true, mode: 'create', item: null });
  }

  function openEditModal(item) {
    setModalError('');
    setModalState({ open: true, mode: 'edit', item });
  }

  function closeModal(force = false) {
    if (saving && !force) {
      return;
    }
    setModalState({ open: false, mode: 'create', item: null });
    setModalError('');
  }

  async function handleSave(payload) {
    setSaving(true);
    setModalError('');

    try {
      if (modalState.mode === 'create') {
        await api.createWishlistItem(payload);
      } else {
        await api.updateWishlistItem(modalState.item.id, payload);
      }
      closeModal(true);
      await loadWishlist();
    } catch (error) {
      setModalError(error.details?.join(' ') || error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId) {
    const confirmed = window.confirm('Delete this wishlist item?');
    if (!confirmed) {
      return;
    }

    try {
      await api.deleteWishlistItem(itemId);
      await loadWishlist();
    } catch (error) {
      setPageError(error.message);
    }
  }

  async function handleLogout() {
    await logout();
  }

  function handleMoodboardToggle() {
    setMoodboardOnly((current) => !current);
    setMoodboardPulse(true);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className={`dashboard-shell ${moodboardOnly ? 'dashboard-shell--moodboard' : ''}`}>
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Personal space</span>
            <h1>{user.name}&apos;s wishlist</h1>
            <p>Everything here is private to your account until future sharing controls are enabled.</p>
          </div>
          <div className="header-actions">
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        {pageError ? <div className="form-error page-error">{pageError}</div> : null}

        <StatsPanel stats={wishlist.stats} />

        <div className="dashboard-grid">
          <OrbSphere
            items={wishlist.items}
            activeItem={activeItem}
            onSelect={setActiveItem}
            moodboardOnly={moodboardOnly}
            onToggleMoodboard={handleMoodboardToggle}
            moodboardPulse={moodboardPulse}
            onMoodboardPulseEnd={() => setMoodboardPulse(false)}
          />
          <section className="panel panel--inventory">
            <div className="panel-header panel-header--inventory">
              <div>
                <span className="eyebrow">Inventory</span>
                <h2>Wishlist items</h2>
                <p>{wishlist.items.length ? 'Manage each product here.' : 'Start by adding your first item.'}</p>
              </div>
              <button type="button" className="primary-button" onClick={openCreateModal}>
                Add item
              </button>
            </div>

            <WishlistList
              items={wishlist.items}
              selectedId={activeItem?.id}
              onSelect={setActiveItem}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </div>

      <ItemModal
        open={modalState.open}
        mode={modalState.mode}
        item={modalState.item}
        saving={saving}
        error={modalError}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
}
