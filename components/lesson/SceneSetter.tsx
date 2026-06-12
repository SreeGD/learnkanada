interface SceneSetterProps {
  scene: string
}

export default function SceneSetter({ scene }: SceneSetterProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="text-xs font-bold text-[#B45309] uppercase tracking-widest mb-1">
        📍 The Scene
      </div>
      <p className="text-sm text-[#1E293B]">{scene}</p>
    </div>
  )
}
