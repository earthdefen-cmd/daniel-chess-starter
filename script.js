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

function isLegalMove(oldRow, oldCol, newRow, newCol) {

    const piece = pieces[oldRow][oldCol];
    const target = pieces[newRow][newCol];

    // WHITE PAWN
    if (piece === "♙") {

        // One square forward
        if (
            newCol === oldCol &&
            newRow === oldRow - 1 &&
            target === ""
        ) {
            return true;
        }

        // Two squares from starting position
        if (
            oldRow === 6 &&
            newCol === oldCol &&
            newRow === oldRow - 2 &&
            pieces[5][oldCol] === "" &&
            pieces[4][oldCol] === ""
        ) {
            return true;
        }

        // Capture diagonally
        if (
            newRow === oldRow - 1 &&
            Math.abs(newCol - oldCol) === 1 &&
            target !== "" &&
            isBlack(target)
        ) {
            return true;
        }
    }

    // BLACK PAWN
    if (piece === "♟") {

        // One square forward
        if (
            newCol === oldCol &&
            newRow === oldRow + 1 &&
            target === ""
        ) {
            return true;
        }

        // Two squares from starting position
        if (
            oldRow === 1 &&
            newCol === oldCol &&
            newRow === oldRow + 2 &&
            pieces[2][oldCol] === "" &&
            pieces[3][oldCol] === ""
        ) {
            return true;
        }

        // Capture diagonally
        if (
            newRow === oldRow + 1 &&
            Math.abs(newCol - oldCol) === 1 &&
            target !== "" &&
            isWhite(target)
        ) {
            return true;
        }
    }

    // KNIGHTS
if (piece === "♘" || piece === "♞") {

    const rowDistance = Math.abs(newRow - oldRow);
    const colDistance = Math.abs(newCol - oldCol);

    // Knight moves in an L shape
    if (
        (rowDistance === 2 && colDistance === 1) ||
        (rowDistance === 1 && colDistance === 2)
    ) {

        // Empty square or enemy piece
        if (
            target === "" ||
            (isWhite(piece) && isBlack(target)) ||
            (isBlack(piece) && isWhite(target))
        ) {
            return true;
        }
    }
}// BISHOPS
if (piece === "♗" || piece === "♝") {

    const rowDistance = Math.abs(newRow - oldRow);
    const colDistance = Math.abs(newCol - oldCol);

    // Bishop moves diagonally
    if (rowDistance === colDistance && rowDistance > 0) {

        const rowStep = newRow > oldRow ? 1 : -1;
        const colStep = newCol > oldCol ? 1 : -1;

        let r = oldRow + rowStep;
        let c = oldCol + colStep;

        // Check that nothing is blocking the bishop
        while (r !== newRow && c !== newCol) {

            if (pieces[r][c] !== "") {
                return false;
            }

            r += rowStep;
            c += colStep;
        }

        // Empty square or enemy piece
        if (
            target === "" ||
            (isWhite(piece) && isBlack(target)) ||
            (isBlack(piece) && isWhite(target))
        ) {
            return true;
        }
    }
}


// ROOKS
if (piece === "♖" || piece === "♜") {

    // Rook moves horizontally or vertically
    if (
        (newRow === oldRow || newCol === oldCol) &&
        !(newRow === oldRow && newCol === oldCol)
    ) {

        const rowStep = newRow === oldRow
            ? 0
            : (newRow > oldRow ? 1 : -1);

        const colStep = newCol === oldCol
            ? 0
            : (newCol > oldCol ? 1 : -1);

        let r = oldRow + rowStep;
        let c = oldCol + colStep;

        // Check that nothing is blocking the rook
        while (r !== newRow || c !== newCol) {

            if (pieces[r][c] !== "") {
                return false;
            }

            r += rowStep;
            c += colStep;
        }

        // Empty square or enemy piece
        if (
            target === "" ||
            (isWhite(piece) && isBlack(target)) ||
            (isBlack(piece) && isWhite(target))
        ) {
            return true;
        }
    }
}// QUEEN
if (piece === "♕" || piece === "♛") {

    const straight =
        newRow === oldRow || newCol === oldCol;

    const diagonal =
        Math.abs(newRow - oldRow) ===
        Math.abs(newCol - oldCol);

    if (straight || diagonal) {

        const rowStep = newRow === oldRow
            ? 0
            : (newRow > oldRow ? 1 : -1);

        const colStep = newCol === oldCol
            ? 0
            : (newCol > oldCol ? 1 : -1);

        let r = oldRow + rowStep;
        let c = oldCol + colStep;

        while (r !== newRow || c !== newCol) {

            if (pieces[r][c] !== "") {
                return false;
            }

            r += rowStep;
            c += colStep;
        }

        if (
            target === "" ||
            (isWhite(piece) && isBlack(target)) ||
            (isBlack(piece) && isWhite(target))
        ) {
            return true;
        }
    }
}


// KING
if (piece === "♔" || piece === "♚") {

    const rowDistance = Math.abs(newRow - oldRow);
    const colDistance = Math.abs(newCol - oldCol);

    if (
        rowDistance <= 1 &&
        colDistance <= 1 &&
        (rowDistance + colDistance) > 0
    ) {

        if (
            target === "" ||
            (isWhite(piece) && isBlack(target)) ||
            (isBlack(piece) && isWhite(target))
        ) {
            return true;
        }
    }
}return false;
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

    // Select piece
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

    const oldRow = selected.row;
    const oldCol = selected.col;

    const movingPiece = pieces[oldRow][oldCol];

    // Try legal move
    if (isLegalMove(oldRow, oldCol, row, col)) {

        pieces[row][col] = movingPiece;
        pieces[oldRow][oldCol] = "";

        if (turn === "white") {
            turn = "black";
        } else {
            turn = "white";
        }
    }

    selected = null;

    createBoard();
}

createBoard();
