import { LoginCredentials } from '../types/auth';

export class FormController {
  /**
   * Validate login form data
   */
  static validateLoginForm(formData: Partial<LoginCredentials>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize form input
   */
  static sanitizeInput(input: string): string {
    return input.trim();
  }

  /**
   * Handle form field changes
   */
  static handleFieldChange<T>(
    fieldName: keyof T,
    value: string | boolean,
    currentState: T,
    setter: (newState: T) => void
  ): void {
    const updatedState = {
      ...currentState,
      [fieldName]: typeof value === 'string' ? this.sanitizeInput(value) : value,
    };
    setter(updatedState);
  }

  /**
   * Reset form to initial state
   */
  static resetForm<T>(initialState: T, setter: (state: T) => void): void {
    setter(initialState);
  }

  /**
   * Check if form has been modified
   */
  static isFormModified<T>(currentState: T, initialState: T): boolean {
    return JSON.stringify(currentState) !== JSON.stringify(initialState);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    score: number; // 0-4 (weak to strong)
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Use at least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('Include numbers');
    }

    if (/[^a-zA-Z\d]/.test(password)) {
      score++;
    } else {
      feedback.push('Include special characters');
    }

    return { score: Math.min(score, 4), feedback };
  }
}
