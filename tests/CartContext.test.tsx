// __tests__/CartContext.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CartProvider, useCart } from '../contexts/CartContext';
import { Text, Button, View } from 'react-native';

const TestComponent = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  return (
    <View>
      {cartItems.map(item => (
        <Text key={item.id} testID={`item-${item.id}`}>
          {item.name} {item.quantity}
        </Text>
      ))}
      <Button
        testID="addButton"
        title="Add Item"
        onPress={() =>
          addToCart({ id: '1', name: 'Test Item', price: 10, image: 'url' })
        }
      />
      <Button
        testID="removeButton"
        title="Remove Item"
        onPress={() => removeFromCart('1')}
      />
      <Button testID="clearButton" title="Clear Cart" onPress={clearCart} />
    </View>
  );
};

describe('CartContext', () => {
  it('initially has an empty cart', () => {
    const { queryByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(queryByTestId('item-1')).toBeNull();
  });

  it('adds an item to the cart', () => {
    const { getByTestId, queryByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    fireEvent.press(getByTestId('addButton'));
    const item = queryByTestId('item-1');
    expect(item).not.toBeNull();
    expect(item.props.children).toContain('Test Item');
    expect(item.props.children).toContain('1');
  });

  it('increments item quantity if same item is added', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    const addButton = getByTestId('addButton');
    fireEvent.press(addButton);
    fireEvent.press(addButton);
    // The item should show quantity 2
    expect(getByText('Test Item 2')).toBeTruthy();
  });

  it('removes an item from the cart when quantity is 1', () => {
    const { getByTestId, queryByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    fireEvent.press(getByTestId('addButton'));
    fireEvent.press(getByTestId('removeButton'));
    expect(queryByTestId('item-1')).toBeNull();
  });

  it('decrements item quantity if more than one', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    const addButton = getByTestId('addButton');
    const removeButton = getByTestId('removeButton');
    fireEvent.press(addButton); // quantity 1
    fireEvent.press(addButton); // quantity 2
    fireEvent.press(removeButton); // should decrement to 1
    expect(getByText('Test Item 1')).toBeTruthy();
  });

  it('clears the cart', () => {
    const { getByTestId, queryByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    fireEvent.press(getByTestId('addButton'));
    fireEvent.press(getByTestId('addButton'));
    fireEvent.press(getByTestId('clearButton'));
    expect(queryByTestId('item-1')).toBeNull();
  });
});
