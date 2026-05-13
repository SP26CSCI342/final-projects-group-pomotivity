// Following this to set up: https://www.geeksforgeeks.org/javascript/testing-with-jest/

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});