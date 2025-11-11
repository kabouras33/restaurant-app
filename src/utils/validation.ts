import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => boolean;
}

export const validateField = (value: string, rules: ValidationRules): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && !value.trim()) {
    errors.push('This field is required.');
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters.`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters.`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('Invalid format.');
  }

  if (rules.customValidator && !rules.customValidator(value)) {
    errors.push('Custom validation failed.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const useFormValidation = (initialValues: Record<string, string>, validationRules: Record<string, ValidationRules>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const validationResult = validateField(value, validationRules[name]);
    setErrors({ ...errors, [name]: validationResult.errors });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, onSubmit: () => Promise<void>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResults = Object.keys(values).reduce((acc, key) => {
      const result = validateField(values[key], validationRules[key]);
      acc[key] = result.errors;
      return acc;
    }, {} as Record<string, string[]>);

    setErrors(validationResults);

    const hasErrors = Object.values(validationResults).some(errorList => errorList.length > 0);
    if (!hasErrors) {
      try {
        await onSubmit();
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