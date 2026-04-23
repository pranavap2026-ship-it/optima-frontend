export default function ServiceItem({ s, onEdit, onDelete, onToggle }) {
  return (
    <div className="card">
      {s.image && <img src={s.image} className="img" />}

      <h3>{s.name}</h3>
      <p className="price">₹{s.price}</p>
      <p className="desc">{s.description}</p>

      <div className="actions">
        <button type="button" onClick={() => onEdit(s)}>Edit</button>
        <button type="button" onClick={() => onToggle(s._id)}>
          {s.active ? "Hide" : "Show"}
        </button>
        <button type="button" onClick={() => onDelete(s._id)}>Delete</button>
      </div>

      <style>{`
        .card {
          background: #111;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        button {
          cursor: pointer;
          pointer-events: auto;
        }

        @media (max-width: 600px) {
          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}