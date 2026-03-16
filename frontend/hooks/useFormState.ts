import { useState, useCallback } from 'react';

interface UseFormStateOptions<T> {
  validate?: (data: T) => Record<string, string>;
}

export function useFormState<T extends Record<string, unknown>>(
  initialState: T,
  options?: UseFormStateOptions<T>
) {
  const [formData, setFormData] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  }, [errors]);

  const setMultipleFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  const validate = useCallback(() => {
    if (options?.validate) {
      const validationErrors = options.validate(formData);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [formData, options]);

  const handleSubmit = useCallback(async (
    submitFn: (data: T) => Promise<void>,
    onSuccess?: () => void
  ) => {
    if (!validate()) return false;

    setIsSubmitting(true);
    setErrors({});

    try {
      await submitFn(formData);
      onSuccess?.();
      reset();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setErrors({ _form: message });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, reset]);

  return {
    formData,
    setFormData,
    updateField,
    setMultipleFields,
    reset,
    handleSubmit,
    isSubmitting,
    errors,
    setErrors,
    validate,
  };
}
