class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    const validChars = /^[1-9.]+$/;
    return validChars.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;  // 'A' is 65 in ASCII
    const startIndex = rowIndex * 9;
    const endIndex = startIndex + 9;
    
    for (let i = startIndex; i < endIndex; i++) {
      if (puzzleString[i] === value.toString()) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = column - 1;
    
    // Check each row at this column index
    for (let i = 0; i < 9; i++) {
      const index = (i * 9) + colIndex;

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
        
        if (puzzleString[index] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return false;
    }

    let puzzle = puzzleString.split('');
    if (this.solveSudoku(puzzle)) {
      return puzzle.join('');
    }
    return false;
  }

  solveSudoku(puzzle) {
    const emptyCell = puzzle.indexOf('.');
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