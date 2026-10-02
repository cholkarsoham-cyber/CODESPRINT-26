export function processPayment(paymentToken: string): { success: boolean; message: string } {
  if (paymentToken === 'tok_success') {
    return { success: true, message: 'Payment successful' };
  }
  if (paymentToken === 'tok_fail') {
    return { success: false, message: 'Payment failed' };
  }
  
  // Anything else: 50% random
  const success = Math.random() >= 0.5;
  return { 
    success, 
    message: success ? 'Payment successful' : 'Payment failed' 
  };
}
