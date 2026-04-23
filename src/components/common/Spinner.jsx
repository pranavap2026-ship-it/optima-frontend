export default function Spinner({ size = 40 }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #C9A84C",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}