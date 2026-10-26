const board = document.getElementById("chessboard");

const pieces = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

let selected = null;
let turn = "white";

function isWhite(piece) {
    return "♙♖♘♗♕♔".includes(piece);
}

function isBlack(piece) {
    return "♟♜♞♝♛♚".includes(piece);
}

function createBoard() {

    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square = document.createElement("div");

            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }

            square.textContent = pieces[row][col];

            square.addEventListener("click", () => {
                handleClick(row, col);
            });

            board.appendChild(square);
        }
    }
}

function handleClick(row, col) {

    const piece = pieces[row][col];

    // Select a piece
    if (selected === null) {

        if (piece === "") return;

        if (turn === "white" && !isWhite(piece)) return;
        if (turn === "black" && !isBlack(piece)) return;

        selected = {
            row: row,
            col: col
        };

        return;
    }

    // Move the selected piece
    const oldRow = selected.row;
    const oldCol = selected.col;

    const movingPiece = pieces[oldRow][oldCol];

    // Don't capture your own piece
    if (
        pieces[row][col] !== "" &&
        (
            (isWhite(movingPiece) && isWhite(pieces[row][col])) ||
            (isBlack(movingPiece) && isBlack(pieces[row][col]))
        )
    ) {
        selected = {
            row: row,
            col: col
        };

        return;
    }

    // Move piece
    pieces[row][col] = movingPiece;
    pieces[oldRow][oldCol] = "";

    // Change turn
    if (turn === "white") {
        turn = "black";
    } else {
        turn = "white";
    }

    selected = null;

    createBoard();
}

createBoard();
