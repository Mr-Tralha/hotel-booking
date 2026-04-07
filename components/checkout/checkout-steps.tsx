import { cn } from '@/lib/utils'

interface Step {
  label: string
}

interface CheckoutStepsProps {
  steps: Step[]
  currentStep: number
}

export function CheckoutSteps({ steps, currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Etapas do checkout">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li key={step.label} className="flex items-center gap-2">
              {index > 0 && (
                <div
                  className={cn(
                    'hidden h-px w-8 sm:block',
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                    isCompleted && 'bg-blue-600 text-white',
                    isCurrent && 'bg-blue-600 text-white ring-2 ring-blue-200',
                    !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'hidden text-sm font-medium sm:block',
                    isCurrent ? 'text-gray-900' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
