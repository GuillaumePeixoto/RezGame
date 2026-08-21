function DetailRow({ label, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <span className="text-neutral-400 text-sm">{label}</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {items.map((item) => (
          <span
            key={item.id}
            className="bg-neutral-600 text-white text-sm px-2 py-1 rounded-md"
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DetailRow;