export default function SearchBar({ value, onChange }) {
    return (
        <input
            className="border rounded-xl px-4 py-3 w-80"
            placeholder="Search organizations..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}