import type { Ingredient } from '@/types';

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ingredients.map(ing => (
        <div key={ing.id} className="flex items-center gap-3 p-3 bg-white border border-surface-border rounded-btn">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: ing.color }}>
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: ing.color, filter: 'brightness(0.7)' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-txt truncate">{ing.name}</p>
            <p className="text-xs text-txt-muted">
              {ing.quantity}{ing.detail && ` · ${ing.detail}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
