export default function EnquiryItem({ e }) {
  return (
    <div className="card">
      <h4>{e.name}</h4>
      <p>{e.message}</p>
    </div>
  );
}