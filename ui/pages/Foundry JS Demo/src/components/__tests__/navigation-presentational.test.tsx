import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationUI } from '../navigation-presentational.tsx';

describe('NavigationUI', () => {
  const mockNavigationLinks = [
    {
      path: '/events',
      label: 'Events',
      category: 'Core',
      description: 'Event handling',
    },
    {
      path: '/workflows',
      label: 'Workflows',
      category: 'Logic',
      description: 'Workflow execution',
    },
    {
      path: '/collections',
      label: 'Collections',
      category: 'Data',
      description: 'CRUD operations',
    },
  ];

  it('should render navigation links', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        onNavigate={() => {}}
      />
    );

    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        onNavigate={() => {}}
      >
        <div>Test Content</div>
      </NavigationUI>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should highlight active navigation item', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/workflows"
        onNavigate={() => {}}
      />
    );

    const workflowsButton = screen.getByRole('button', { name: /workflows/i });
    expect(workflowsButton).toHaveClass('bg-primary-idle');
  });

  it('should call onNavigate when link is clicked', async () => {
    const user = userEvent.setup();
    const mockOnNavigate = vi.fn();

    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        onNavigate={mockOnNavigate}
      />
    );

    const workflowsButton = screen.getByRole('button', { name: /workflows/i });
    await user.click(workflowsButton);

    expect(mockOnNavigate).toHaveBeenCalledWith('/workflows');
  });

  it('should show event count badge', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        eventCount={5}
        onNavigate={() => {}}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should not show badge when event count is 0', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        eventCount={0}
        onNavigate={() => {}}
      />
    );

    // The badge span element should not be present when eventCount is 0
    const eventsButton = screen.getByRole('button', { name: /^events$/i });
    const badge = eventsButton.querySelector('span.inline-flex');
    expect(badge).not.toBeInTheDocument();
  });

  it('should group links by category', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        onNavigate={() => {}}
      />
    );

    // Check that category sections exist by checking structure
    // The component renders categories as headings
    const categoryHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(categoryHeadings.length).toBeGreaterThanOrEqual(3);

    // Verify all navigation items are rendered
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  it('should render with default props', () => {
    render(
      <NavigationUI>
        <div>Content</div>
      </NavigationUI>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render Foundry-JS SDK title', () => {
    render(
      <NavigationUI
        navigationLinks={mockNavigationLinks}
        currentPath="/events"
        onNavigate={() => {}}
      />
    );

    expect(screen.getByText('Foundry-JS SDK')).toBeInTheDocument();
  });
});
