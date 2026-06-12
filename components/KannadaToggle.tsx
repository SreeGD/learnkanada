'use client'

import { useState } from 'react'

interface KannadaToggleProps {
  script: string
  light?: boolean
}

export default function KannadaToggle({ script, light = false }: KannadaToggleProps) {
  const [open, setOpen] = useState(false)
  if (!script) return null

  return (
    <div className="mt-1">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className={`text-xs underline ${light ? 'text-white/60 hover:text-white/90' : 'text-gray-400 hover:text-gray-600'}`}
      >
        {open ? 'ಲಿಪಿ ಮುಚ್ಚು ▴' : 'ಕನ್ನಡ ಲಿಪಿ ▾'}
      </button>
      {open && (
        <div className={`mt-1 text-lg font-kannada ${light ? 'text-white/90' : 'text-gray-700'}`}>
          {script}
        </div>
      )}
    </div>
  )
}
