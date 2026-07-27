import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardStatCard from '../components/stats';

describe('DashboardStatCard Component Tests', () => {

    it('should map standard keys to human-readable labels cleanly', () => {
        render(<DashboardStatCard name="totalTraffic" value="12,540" changes="+15%" />);
        
        // Verifies the key string was successfully converted into human prose
        expect(screen.getByText('Total Traffic')).toBeInTheDocument();
        expect(screen.getByText('12,540')).toBeInTheDocument();
    });

    it('should fall back onto dual dash marks when value parameters are empty strings', () => {
        render(<DashboardStatCard name="bounceRate" value="" changes="-4%" />);
        
        expect(screen.getByText('Bounce Rate')).toBeInTheDocument();
        expect(screen.getByText('--')).toBeInTheDocument();
    });

    it('should apply green styling markers for positive trends or shifts', () => {
        render(<DashboardStatCard name="conversionRate" value="3.4%" changes="+12%" />);
        
        const changeElement = screen.getByText(/\+12%/i);
        expect(changeElement).toBeInTheDocument();
        
        // Verifies that your Tailwind positive layout style class profile gets injected
        expect(changeElement).toHaveClass('text-green-400');
        expect(changeElement).not.toHaveClass('text-red-400');
    });

    it('should apply red styling markers when trend evaluations are negative', () => {
        render(<DashboardStatCard name="avgSessionDuration" value="1m 30s" changes="-8%" />);
        
        const changeElement = screen.getByText(/-8%/i);
        expect(changeElement).toBeInTheDocument();
        
        // Verifies that your Tailwind negative layout style class profile gets injected instead
        expect(changeElement).toHaveClass('text-red-400');
        expect(changeElement).not.toHaveClass('text-green-400');
    });

    it('should render descriptive historical comparison helper spans alongside values', () => {
        render(<DashboardStatCard name="totalTraffic" value="500" changes="+5%" />);
        
        expect(screen.getByText('from last period')).toBeInTheDocument();
    });
});