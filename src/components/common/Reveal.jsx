import useInView from "../../hooks/useInView";

export default function Reveal({ children }) {
  const [ref, show] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(40px)",
        transition: "0.8s ease",
      }}
    >
      {children}
    </div>
  );
}