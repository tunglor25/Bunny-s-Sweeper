export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export class MinesweeperEngine {
  public width: number;
  public height: number;
  public mineCount: number;
  public board: Cell[][];
  public isFirstClick: boolean;
  public isGameOver: boolean;
  public isWin: boolean;
  public flagsPlaced: number;

  constructor(width: number, height: number, mineCount: number) {
    this.width = width;
    this.height = height;
    this.mineCount = mineCount;
    this.board = [];
    this.isFirstClick = true;
    this.isGameOver = false;
    this.isWin = false;
    this.flagsPlaced = 0;
    this.initializeBoard();
  }

  private initializeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          x,
          y,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      this.board.push(row);
    }
  }

  private generateMines(safeX: number, safeY: number) {
    let minesPlaced = 0;
    while (minesPlaced < this.mineCount) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);

      // Prevent placing mine on the first clicked cell
      if (x === safeX && y === safeY) continue;
      
      // Prevent placing mine if it's already a mine
      if (!this.board[y][x].isMine) {
        this.board[y][x].isMine = true;
        minesPlaced++;
      }
    }
    this.calculateNeighbors();
  }

  private calculateNeighbors() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.board[y][x].isMine) {
          let count = 0;
          this.forEachNeighbor(x, y, (nx, ny) => {
            if (this.board[ny][nx].isMine) count++;
          });
          this.board[y][x].neighborMines = count;
        }
      }
    }
  }

  private forEachNeighbor(x: number, y: number, callback: (nx: number, ny: number) => void) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          callback(nx, ny);
        }
      }
    }
  }

  // Trả về true nếu đạp phải mìn (Thua)
  public reveal(x: number, y: number): boolean {
    if (this.isGameOver || this.isWin) return false;
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;

    const cell = this.board[y][x];
    if (cell.isRevealed || cell.isFlagged) return false;

    if (this.isFirstClick) {
      this.isFirstClick = false;
      this.generateMines(x, y);
    }

    if (cell.isMine) {
      this.isGameOver = true;
      cell.isRevealed = true;
      return true; // Hit a mine
    }

    this.floodFill(x, y);
    this.checkWinCondition();
    return false;
  }

  private floodFill(x: number, y: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const cell = this.board[y][x];

    if (cell.isRevealed || cell.isFlagged || cell.isMine) return;

    cell.isRevealed = true;

    // Nếu ô trống (không có mìn xung quanh), tiếp tục loang
    if (cell.neighborMines === 0) {
      this.forEachNeighbor(x, y, (nx, ny) => {
        this.floodFill(nx, ny);
      });
    }
  }

  public toggleFlag(x: number, y: number) {
    if (this.isGameOver || this.isWin || this.isFirstClick) return;
    const cell = this.board[y][x];
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      this.flagsPlaced += cell.isFlagged ? 1 : -1;
    }
  }

  // Đào nhanh nếu số cờ xung quanh bằng số neighborMines
  public chord(x: number, y: number): boolean {
    if (this.isGameOver || this.isWin) return false;
    const cell = this.board[y][x];
    
    if (!cell.isRevealed || cell.neighborMines === 0) return false;

    let flagCount = 0;
    this.forEachNeighbor(x, y, (nx, ny) => {
      if (this.board[ny][nx].isFlagged) flagCount++;
    });

    if (flagCount === cell.neighborMines) {
      let hitMine = false;
      this.forEachNeighbor(x, y, (nx, ny) => {
        const neighbor = this.board[ny][nx];
        if (!neighbor.isRevealed && !neighbor.isFlagged) {
           if (this.reveal(nx, ny)) hitMine = true;
        }
      });
      return hitMine;
    }
    return false;
  }

  private checkWinCondition() {
    let unrevealedSafeCells = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.board[y][x];
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }
    
    if (unrevealedSafeCells === 0) {
      this.isWin = true;
    }
  }
}
