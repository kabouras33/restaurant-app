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

export const useFormValidation = (initialValues: Record<string, any>, validationRules: Record<string, ValidationRules>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value) {
      return 'This field is required.';
    }
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength}.`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength}.`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format.';
    }
    return '';
  };

  const validateForm = (): ValidationResult => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const name in values) {
      const error = validateField(name, values[name]);
      if (error) {
        isValid = false;
        newErrors[name] = error;
      }
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  return {
    values,
    errors,
    handleChange,
    validateForm,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordPattern.test(password);
};