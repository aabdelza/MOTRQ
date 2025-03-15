// __tests__/CheckoutScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CheckoutScreen from '../screens/CheckoutScreen';
import { useStripe } from '@stripe/stripe-react-native';

jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: jest.fn(),
}));

describe('CheckoutScreen', () => {
  const mockInitPaymentSheet = jest.fn();
  const mockPresentPaymentSheet = jest.fn();

  beforeEach(() => {
    (useStripe as jest.Mock).mockReturnValue({
      initPaymentSheet: mockInitPaymentSheet,
      presentPaymentSheet: mockPresentPaymentSheet,
    });
    // Mock fetch to simulate backend PaymentIntent creation
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ paymentIntentClientSecret: 'test_secret' }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays shipping form and does not continue if details are missing', async () => {
    const { getByPlaceholderText, getByText } = render(
      <CheckoutScreen route={{ params: { total: 29.99 } }} navigation={{ goBack: jest.fn() }} />
    );

    // Verify shipping input fields are rendered
    expect(getByPlaceholderText('Full Name')).toBeTruthy();
    expect(getByPlaceholderText('Address')).toBeTruthy();
    expect(getByPlaceholderText('City')).toBeTruthy();
    expect(getByPlaceholderText('Postal Code')).toBeTruthy();

    // Press "Continue to Payment" without entering details
    const continueButton = getByText('Continue to Payment');
    fireEvent.press(continueButton);
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});
    expect(alertSpy).toHaveBeenCalledWith("Please fill in all shipping details.");
    alertSpy.mockRestore();
  });

  it('initializes payment and shows "Complete Payment" button after shipping details are filled', async () => {
    mockInitPaymentSheet.mockResolvedValue({ error: null });
    const { getByPlaceholderText, getByText, queryByText } = render(
      <CheckoutScreen route={{ params: { total: 29.99 } }} navigation={{ goBack: jest.fn() }} />
    );

    // Fill shipping form
    fireEvent.changeText(getByPlaceholderText('Full Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('City'), 'Anytown');
    fireEvent.changeText(getByPlaceholderText('Postal Code'), '12345');

    const continueButton = getByText('Continue to Payment');
    fireEvent.press(continueButton);

    // Wait for PaymentSheet to initialize
    await waitFor(() => expect(mockInitPaymentSheet).toHaveBeenCalled());

    // "Complete Payment" button should now be visible
    expect(queryByText('Complete Payment')).toBeTruthy();
  });

  it('handles payment sheet presentation successfully', async () => {
    mockInitPaymentSheet.mockResolvedValue({ error: null });
    mockPresentPaymentSheet.mockResolvedValue({ error: null });
    const goBackMock = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <CheckoutScreen route={{ params: { total: 29.99 } }} navigation={{ goBack: goBackMock }} />
    );

    // Fill shipping form
    fireEvent.changeText(getByPlaceholderText('Full Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('City'), 'Anytown');
    fireEvent.changeText(getByPlaceholderText('Postal Code'), '12345');

    fireEvent.press(getByText('Continue to Payment'));
    await waitFor(() => expect(mockInitPaymentSheet).toHaveBeenCalled());

    const completePaymentButton = await waitFor(() => getByText('Complete Payment'));
    fireEvent.press(completePaymentButton);

    await waitFor(() => expect(mockPresentPaymentSheet).toHaveBeenCalled());

    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Success! Payment completed. Thank you.")
    );
    expect(goBackMock).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
