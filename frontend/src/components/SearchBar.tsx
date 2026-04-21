interface Props {
    value: string
    onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
    return (
    <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name..."
        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    )
}