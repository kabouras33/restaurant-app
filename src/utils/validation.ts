import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export const validateField = (name: string, value: string, rules: ValidationRules): ValidationResult => {
  const errors: Record<string, string> = {};

  if (rules.required && !value.trim()) {
    errors[name] = 'This field is required.';
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors[name] = `Minimum length is ${rules.minLength} characters.`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors[name] = `Maximum length is ${rules.maxLength} characters.`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors[name] = 'Invalid format.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const useFormValidation = (initialValues: Record<string, string>, validationRules: Record<string, ValidationRules>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const { isValid, errors: fieldErrors } = validateField(name, value, validationRules[name]);
    setErrors({ ...errors, ...fieldErrors });

    if (isValid) {
      delete errors[name];
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, onSubmit: () => Promise<void>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResults = Object.keys(values).map((field) =>
      validateField(field, values[field], validationRules[field])
    );

    const formIsValid = validationResults.every((result) => result.isValid);
    const formErrors = validationResults.reduce((acc, result) => ({ ...acc, ...result.errors }), {});

    setErrors(formErrors);

    if (formIsValid) {
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