function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

export default function StatsPanel({ stats }) {
  return (
    <section className="stats-panel">
      <article className="stat-card">
        <span>Total items</span>
        <strong>{stats.totalItems}</strong>
      </article>
      <article className="stat-card">
        <span>Total value</span>
        <strong>{formatCurrency(stats.totalValue)}</strong>
      </article>
    </section>
  );
}

