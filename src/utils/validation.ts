import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface FormValues {
  [key: string]: string;
}

export const validateForm = (values: FormValues, rules: Record<string, (value: string) => string | null>): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const field in rules) {
    const error = rules[field](values[field]);
    if (error) {
      isValid = false;
      errors[field] = error;
    }
  }

  return { isValid, errors };
};

export const useFormValidation = (initialValues: FormValues, validationRules: Record<string, (value: string) => string | null>) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, onSubmit: (values: FormValues) => Promise<void>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const validationResult = validateForm(values, validationRules);
    setErrors(validationResult.errors);

    if (validationResult.isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Submission error:', error);
      }
    }

    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};

// Example validation rules
export const validationRules = {
  email: (value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Invalid email address';
  },
  password: (value: string) => {
    if (!value) return 'Password is required';
    return value.length >= 6 ? null : 'Password must be at least 6 characters';
  },
};