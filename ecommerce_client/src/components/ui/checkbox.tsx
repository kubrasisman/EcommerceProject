import * as React from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled, className = '', id }, ref) => {
    return (
      <button
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        id={id}
        onClick={() => onCheckedChange?.(!checked)}
        className={`
          h-4 w-4 shrink-0 rounded border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white'}
          ${className}
        `}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </button>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }