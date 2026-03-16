export default function LoadingScreen({ label = 'Loading your wishlist...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-ring" />
      <p>{label}</p>
    </div>
  );
}

