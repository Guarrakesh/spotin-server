import { required, minLength, maxLength, minValue, maxValue, number,
regex, email, choices } from 'react-admin';

const validateName = [required(), minLength(2), maxLength(45)];
const validatePhone = [required(), number()];
