class SudokuSolver {
  validate(puzzleString) {
    // Early return if puzzle string isn't the right length
    if (puzzleString.length !== 81) {
      return false;
    }

    // Store regex valid characters in a variable to,
    const validChars = /^[1-9.]+$/;
    // use test() to validate the whole puzzle.
    return validChars.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;  // 'A' is 65 in ASCII
    const startIndex = rowIndex * 9;
    const endIndex = startIndex + 9;
    
    // Check the entire row for conflicts
    for (let i = startIndex; i < endIndex; i++) {
      // Ignore the current cell inside this row
      if (puzzleString[i] === value.toString()) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = column - 1;
    
    // Check the entire column for conflicts
    for (let i = 0; i < 9; i++) {
      const index = (i * 9) + colIndex;

      // Ignore the current cell inside this column
      if (puzzleString[index] === value.toString()) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;  // Convert 'A' to 0, 'B' to 1, etc.
    const colIndex = column - 1;
    
    // Find the top-left corner of the 3x3 box
    const boxRowStart = Math.floor(rowIndex / 3) * 3;
    const boxColStart = Math.floor(colIndex / 3) * 3;
    
    // Check all positions in the 3x3 box
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = boxRowStart + i;
        const currentCol = boxColStart + j;
        const index = (currentRow * 9) + currentCol;
        
        // Ignore the current cell in this region
        if (puzzleString[index] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    // Early return if the puzzle is invalid
    if (!this.validate(puzzleString)) {
      return false;
    }

    // Create an array out of the string for processing
    let puzzle = puzzleString.split('');

    // Return the puzzle as a string
    if (this.solveSudoku(puzzle)) {
      return puzzle.join('');
    }

    return false;
  }

  solveSudoku(puzzle) {
    const emptyCell = puzzle.indexOf('.');

    // Early return if the puzzle has been solved
    if (emptyCell === -1) {
      return true; // Puzzle is solved
    }

    const row = String.fromCharCode('A'.charCodeAt(0) + Math.floor(emptyCell / 9));
    const col = (emptyCell % 9) + 1;

    for (let num = 1; num <= 9; num++) {
      const value = num.toString();
      if (
        this.checkRowPlacement(puzzle.join(''), row, col, value) &&
        this.checkColPlacement(puzzle.join(''), row, col, value) &&
        this.checkRegionPlacement(puzzle.join(''), row, col, value)
      ) {
        puzzle[emptyCell] = value;
        if (this.solveSudoku(puzzle)) {
          return true;
        }
        puzzle[emptyCell] = '.';
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;