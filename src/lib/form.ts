// Form validation utilities

export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  return true; // Simplified validation for MVP
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
};

export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
