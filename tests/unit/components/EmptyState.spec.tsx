import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/common/empty-state';

// Mock Lucide icons to avoid rendering issues in tests
jest.mock('lucide-react', () => ({
  icons: {
    PackageOpen: () => <div data-testid="package-icon" />,
    Search: () => <div data-testid="search-icon" />,
  },
}));

// Mock Icon component if necessary, but EmptyState uses it directly
// For this test, we'll just check if the text renders.

describe('EmptyState Component', () => {
  it('renders with default title and description', () => {
    render(<EmptyState icon="PackageOpen" />);
    
    expect(screen.getByText('Nenhum item adicionado')).toBeInTheDocument();
    expect(screen.getByText('Adicione novos itens para começar.')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    const customTitle = 'Custom Title';
    const customDesc = 'Custom Description';
    
    render(
      <EmptyState 
        icon="Search" 
        title={customTitle} 
        description={customDesc} 
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDesc)).toBeInTheDocument();
  });
});
