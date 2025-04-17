import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders the spinner with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-6 w-6');
  });

  it('renders the spinner with a custom size', () => {
    render(<LoadingSpinner size="8" />);
    const spinner = screen.getByTestId('loading-spinner');
    
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8 w-8');
  });
}); 