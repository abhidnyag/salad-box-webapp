import type { RecipeStep } from '@/types';

export function RecipeSteps({ steps, accentColor = 'bg-brand-green' }: {
  steps: RecipeStep[];
  accentColor?: string;
}) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 ${accentColor} text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0`}>
              {step.stepNumber}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-brand-green-pale my-1" />}
          </div>
          <div className="pb-8">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-bold text-txt">{step.title}</h4>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-green-light text-brand-green">{step.duration}</span>
            </div>
            <p className="text-sm text-txt-secondary leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
