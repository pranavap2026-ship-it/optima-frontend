export default function ApiBanner({ status }) {
  if (!status) return null;

  const ok = status === "ok";

  return (
    <div style={{
      position: "fixed",
      bottom: 10,
      right: 10,
      background: ok ? "green" : "red",
      color: "#fff",
      padding: "6px 12px",
      fontSize: 12
    }}>
      {ok ? "Backend Connected" : "Offline Mode"}
    </div>
  );
}