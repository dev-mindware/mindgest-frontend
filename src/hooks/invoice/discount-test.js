// Test case for discount calculation
// Expected behavior: VAT should be calculated on original subtotal, not on discounted amount

const items = [
  { unitPrice: 100, quantity: 1, tax: 14 }
];

const discount = 10; // 10%
const retention = 0;

// Expected results:
// Subtotal: 100€
// Discount (10%): 10€
// Taxable Base: 90€
// VAT (14% of 100€): 14€  <-- Should NOT change with discount
// Total: 90 + 14 = 104€

console.log('Test: Discount should not affect VAT calculation');
console.log('Item: 100€ x 1, VAT 14%');
console.log('Discount: 10%');
console.log('Expected VAT: 14€ (14% of 100€)');
console.log('Expected Total: 104€ (90€ + 14€)');
