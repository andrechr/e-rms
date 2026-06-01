import { useRef, useState, useEffect } from 'react'
import { snapToDay } from '../../utils/timeline'

interface Props {
    allocationId: string
    left: number
    width: number
    color: string
    label: string
    timelineStart: number
    totalMs: number
    onUpdate: (id: string, startDate: string, endDate: string) => void
}

type DragMode = 'move' | 'resize-left' | 'resize-right' | null

export default function AllocationBar({ allocationId, left, width, color, label, timelineStart, totalMs, onUpdate }: Props) {
    const barRef = useRef<HTMLDivElement>(null)
    const dragMode = useRef<DragMode>(null)
    const dragStartX = useRef<number>(0)
    const initialLeft = useRef<number>(left)
    const initialWidth = useRef<number>(width)
    const [preview, setPreview] = useState({ left, width })
    const previewRef = useRef({ left, width })
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (!isDragging) {
            setPreview({ left, width })
        }
    }, [left, width])

    function toDate(ms: number) {
        return new Date(ms).toISOString().split('T')[0]
    }

    function pctToMs(pct: number) {
        return timelineStart + (pct / 100) * totalMs
    }

    function snapPct(pct: number) {
        return ((snapToDay(pctToMs(pct)) - timelineStart) / totalMs) * 100
    }

    function handleMouseDown(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        const rect = barRef.current!.getBoundingClientRect()
        const x = e.clientX - rect.left
        dragStartX.current = e.clientX
        initialLeft.current = left
        initialWidth.current = width
        if (x < 10) dragMode.current = 'resize-left'
        else if (x > rect.width - 10) dragMode.current = 'resize-right'
        else dragMode.current = 'move'
        setIsDragging(true)
    }

    useEffect(() => {
        if (!isDragging) return

        function handleMouseMove(e: MouseEvent) {
            if (!dragMode.current || !barRef.current) return
            const parentRect = barRef.current.parentElement!.getBoundingClientRect()
            const deltaX = e.clientX - dragStartX.current
            const deltaPct = (deltaX / parentRect.width) * 100

            if (dragMode.current === 'move') {
                const newLeft = snapPct(initialLeft.current + deltaPct)
                const next = { left: newLeft, width: initialWidth.current }
                previewRef.current = next
                setPreview(next)
            } else if (dragMode.current === 'resize-left') {
                const newLeft = snapPct(initialLeft.current + deltaPct)
                const newWidth = initialWidth.current - (newLeft - initialLeft.current)
                const next = { left: newLeft, width: newWidth }
                previewRef.current = next
                setPreview(next)
            } else if (dragMode.current === 'resize-right') {
                const newWidth = snapPct(initialLeft.current + initialWidth.current + deltaPct) - initialLeft.current
                const next = { left: initialLeft.current, width: newWidth }
                previewRef.current = next
                setPreview(next)
            }
        }

        function handleMouseUp(_e: MouseEvent) {
            const newStartMs = snapToDay(pctToMs(previewRef.current.left))
            const newEndMs = snapToDay(pctToMs(previewRef.current.left + previewRef.current.width))
            onUpdate(allocationId, toDate(newStartMs), toDate(newEndMs))
            dragMode.current = null
            setIsDragging(false)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    return (
        <div
            ref={barRef}
            className="absolute top-1.5 bottom-1.5 rounded-full text-[10px] text-white flex items-center px-3 overflow-hidden shadow-sm font-medium tracking-wide select-none"
            style={{
                left: `${preview.left}%`,
                width: `${preview.width}%`,
                backgroundColor: color,
                opacity: 0.9,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
        >
            {label}
        </div>
    )
}
