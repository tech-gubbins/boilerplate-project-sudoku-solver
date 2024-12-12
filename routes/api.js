'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
	let solver = new SudokuSolver();

  app.route('/api/solve').post((req, res) => {
		const { puzzle } = req.body;

		// Early return if puzzle is missing
		if (!puzzle) {
			return res.json({ error: 'Required field missing' });
		}

		// Validate puzzle string
		if (!solver.validate(puzzle)) {
			if (puzzle.length !== 81) {
				return res.json({ error: 'Expected puzzle to be 81 characters long' });
			}
			return res.json({ error: 'Invalid characters in puzzle' });
		}

		// Attempt to solve
		const solution = solver.solve(puzzle);

    // Early return if solution is not found
		if (!solution) {
			return res.json({ error: 'Puzzle cannot be solved' });
		}

    return res.json({ solution });
	});

	app.route('/api/check').post((req, res) => {
		const { puzzle, coordinate, value } = req.body;

		// Early return if any fields are missing
		if (!puzzle || !coordinate || !value) {
			return res.json({ error: 'Required field(s) missing' });
		}

		// Validate puzzle string
		if (!solver.validate(puzzle)) {
			if (puzzle.length !== 81) {
				return res.json({ error: 'Expected puzzle to be 81 characters long' });
			}
			return res.json({ error: 'Invalid characters in puzzle' });
		}

		// Validate coordinate
		if (!/^[A-I][1-9]$/.test(coordinate)) {
			return res.json({ error: 'Invalid coordinate' });
		}

		// Validate value
		if (!/^[1-9]$/.test(value.toString())) {
			return res.json({ error: 'Invalid value' });
		}

		const row = coordinate[0];
		const column = parseInt(coordinate[1]);

		// Get current value at coordinate
		const rowIndex = row.charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1, etc.
		const cellIndex = rowIndex * 9 + (column - 1);

		// If cell already has the same value, it's valid
		if (puzzle[cellIndex] === value.toString()) {
			return res.json({ valid: true });
		}

		// Check for conflicts
		const conflicts = [];

		if (!solver.checkRowPlacement(puzzle, row, column, value)) {
			conflicts.push('row');
		}
		if (!solver.checkColPlacement(puzzle, row, column, value)) {
			conflicts.push('column');
		}
		if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
			conflicts.push('region');
		}

		return res.json({
			valid: conflicts.length === 0,
			conflict: conflicts.length > 0 ? conflicts : undefined,
		});
	});
};
