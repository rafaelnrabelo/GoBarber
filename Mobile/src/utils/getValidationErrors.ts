import { ValidationError } from "yup";

interface FormErrors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): FormErrors {
  const validationErrors: FormErrors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
