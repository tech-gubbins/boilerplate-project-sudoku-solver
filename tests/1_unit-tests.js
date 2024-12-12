const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  // Valid puzzle string
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.validate(input));
  });

  // Invalid characters
  test('Logic handles a puzzle string with invalid characters', () => {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    assert.isFalse(solver.validate(input));
  });

  // Incorrect length
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914';
    assert.isFalse(solver.validate(input));
  });

  // Row placement tests
  test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 2, 3));
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 2, 1));
  });

  // Column placement tests
  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkColPlacement(puzzle, 'A', 2, 3));
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkColPlacement(puzzle, 'A', 2, 9));
  });

  // Region placement tests
  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', 2, 3));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRegionPlacement(puzzle, 'H', 2, 4));
  });

  // Solver tests
  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(puzzle);
    assert.notEqual(solution, false);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    assert.isFalse(solver.solve(invalidPuzzle));
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(puzzle);
    assert.isString(solution);
    assert.equal(solution.length, 81);
    assert.isTrue(/^[1-9]+$/.test(solution.replace(/\./g, '')));
  });
});