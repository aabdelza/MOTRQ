// __tests__/ShopPartsScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ShopPartsScreen from '../screens/ShopPartsScreen';
import { CartProvider } from '../contexts/CartContext';

// Create a dummy navigation prop
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); // Suppress animation warnings

describe('ShopPartsScreen', () => {
  it('renders a list of parts and updates the cart badge on adding an item', async () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <CartProvider>
        <ShopPartsScreen navigation={mockNavigation} />
      </CartProvider>
    );

    // Check that at least one part is rendered
    const part = await waitFor(() => getByText(/Spark Plugs/i));
    expect(part).toBeTruthy();

    // Initially, the badge should not be present (or show 0)
    expect(queryByTestId('cartBadge')).toBeNull();

    // Find an "Add to Cart" button and press it.
    // Assume that the button text is "Add to Cart" on each item.
    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    // After pressing, the cart badge should display 1.
    const badge = await waitFor(() => getByTestId('cartBadge'));
    expect(badge.props.children).toBe(1);
  });
});
