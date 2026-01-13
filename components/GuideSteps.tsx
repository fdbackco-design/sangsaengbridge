interface Step {
  step_number: number
  title: string
  description?: string | null
}

interface GuideStepsProps {
  steps: Step[]
}

export default function GuideSteps({ steps }: GuideStepsProps) {
  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number)

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">이용 안내</h2>
      <div className="space-y-4">
        {sortedSteps.map((step, index) => (
          <div
            key={step.step_number}
            className="flex gap-4 bg-white rounded-card shadow-soft p-4 md:p-6"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-burgundy-700 text-white rounded-full flex items-center justify-center font-bold">
              {step.step_number}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              {step.description && (
                <p className="text-sm text-gray-600">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
