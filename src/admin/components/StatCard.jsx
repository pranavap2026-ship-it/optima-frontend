export default function StatCard({ title, value }) {
  return (
    <div className="stat">
      <h3>{value}</h3>
      <p>{title}</p>

      <style>{`
        .stat {
          background: #111;
          padding: 20px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}