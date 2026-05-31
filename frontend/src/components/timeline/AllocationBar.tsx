interface Props {
    left: number
    width: number
    color: string
    label: string
}

export default function AllocationBar({ left, width, color, label }: Props) {
    return (
        <div
            className="absolute top-1.5 bottom-1.5 rounded-full text-[10px] text-white flex items-center px-3 overflow-hidden shadow-sm font-medium tracking-wide"
            style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: color,
                opacity: 0.9,
            }}
        >
            {label}
        </div>
    )
}
