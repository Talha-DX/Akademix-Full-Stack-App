import { useState } from 'react'

/**
 * Minimal controlled-form hook: values + change handler + reset.
 * Pair with components/forms/ValidationError.jsx for error display.
 */
export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, setErrors, handleChange, setValues, reset }
}
