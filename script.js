const board = document.getElementById("chessboard");
const gameStatus = document.getElementById("game-status");

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
    return "♟♜♞♛♚".includes(piece);
}

function findKing(color) {

    const king = color === "white" ? "♔" : "♚";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            if (pieces[row][col] === king) {
                return { row, col };
            }
        }
    }

    return null;
}

function isSquareAttacked(row, col, byColor) {

    for (let r = 0; r < 8; r++) {

        for (let c = 0; c < 8; c++) {

            const piece = pieces[r][c];

            if (piece === "") continue;

            if (byColor === "white" && !isWhite(piece)) continue;
            if (byColor === "black" && !isBlack(piece)) continue;

            const rowDistance = Math.abs(row - r);
            const colDistance = Math.abs(col - c);

            // Knight attacks
            if (piece === "♘" || piece === "♞") {

                if (
                    (rowDistance === 2 && colDistance === 1) ||
                    (rowDistance === 1 && colDistance === 2)
                ) {
                    return true;
                }
            }

            // King attacks
            if (piece === "♔" || piece === "♚") {

                if (
                    rowDistance <= 1 &&
                    colDistance <= 1 &&
                    rowDistance + colDistance > 0
                ) {
                    return true;
                }
            }

            // Pawn attacks
            if (piece === "♙") {

                if (
                    row === r - 1 &&
                    colDistance === 1
                ) {
                    return true;
                }
            }

            if (piece === "♟") {

                if (
                    row === r + 1 &&
                    colDistance === 1
                ) {
                    return true;
                }
            }

            // Bishop / Queen diagonal attacks
            if (
                piece === "♗" ||
                piece === "♝" ||
                piece === "♕" ||
                piece === "♛"
            ) {

                if (rowDistance === colDistance && rowDistance > 0) {

                    const rowStep = row > r ? 1 : -1;
                    const colStep = col > c ? 1 : -1;

                    let rr = r + rowStep;
                    let cc = c + colStep;

                    let blocked = false;

                    while (rr !== row && cc !== col) {

                        if (pieces[rr][cc] !== "") {
                            blocked = true;
                            break;
                        }

                        rr += rowStep;
                        cc += colStep;
                    }

                    if (!blocked) {
                        return true;
                    }
                }
            }

            // Rook / Queen straight attacks
            if (
                piece === "♖" ||
                piece === "♜" ||
                piece === "♕" ||
                piece === "♛"
            ) {

                if (
                    (row === r || col === c) &&
                    !(row === r && col === c)
                ) {

                    const rowStep = row === r
                        ? 0
                        : (row > r ? 1 : -1);

                    const colStep = col === c
                        ? 0
                        : (col > c ? 1 : -1);

                    let rr = r + rowStep;
                    let cc = c + colStep;

                    let blocked = false;

                    while (rr !== row || cc !== col) {

                        if (pieces[rr][cc] !== "") {
                            blocked = true;
                            break;
                        }

                        rr += rowStep;
                        cc += colStep;
                    }

                    if (!blocked) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function isInCheck(color) {

    const king = findKing(color);

    if (!king) return false;

    const opponent = color === "white" ? "black" : "white";

    return isSquareAttacked(
        king.row,
        king.col,
        opponent
    );
}

function isLegalMove(oldRow, oldCol, newRow, newCol) {

    const piece = pieces[oldRow][oldCol];
    const target = pieces[newRow][newCol];

    if (piece === "") return false;

    // Don't capture your own piece
    if (
        target !== "" &&
        (
            (isWhite(piece) && isWhite(target)) ||
            (isBlack(piece) && isBlack(target))
        )
    ) {
        return false;
    }

    // Pawn
    if (piece === "♙") {

        if (
            newCol === oldCol &&
            newRow === oldRow - 1 &&
            target === ""
        ) return true;

        if (
            oldRow === 6 &&
            newCol === oldCol &&
            newRow === oldRow - 2 &&
            pieces[5][oldCol] === "" &&
            pieces[4][oldCol] === ""
        ) return true;

        if (
            newRow === oldRow - 1 &&
            Math.abs(newCol - oldCol) === 1 &&
            target !== "" &&
            isBlack(target)
        ) return true;
    }

    if (piece === "♟") {

        if (
            newCol === oldCol &&
            newRow === oldRow + 1 &&
            target === ""
        ) return true;

        if (
            oldRow === 1 &&
            newCol === oldCol &&
            newRow === oldRow + 2 &&
            pieces[2][oldCol] === "" &&
            pieces[3][oldCol] === ""
        ) return true;

        if (
            newRow === oldRow + 1 &&
            Math.abs(newCol - oldCol) === 1 &&
            target !== "" &&
            isWhite(target)
        ) return true;
    }

    // Knight
    if (piece === "♘" || piece === "♞") {

        const rd = Math.abs(newRow - oldRow);
        const cd = Math.abs(newCol - oldCol);

        if (
            (rd === 2 && cd === 1) ||
            (rd === 1 && cd === 2)
        ) return true;
    }

    // Bishop, rook and queen
    let diagonal =
        Math.abs(newRow - oldRow) ===
        Math.abs(newCol - oldCol);

    let straight =
        newRow === oldRow ||
        newCol === oldCol;

    if (
        (piece === "♗" || piece === "♝") &&
        diagonal
    ) {
        return pathClear(oldRow, oldCol, newRow, newCol);
    }

    if (
        (piece === "♖" || piece === "♜") &&
        straight
    ) {
        return pathClear(oldRow, oldCol, newRow, newCol);
    }

    if (
        (piece === "♕" || piece === "♛") &&
        (diagonal || straight)
    ) {
        return pathClear(oldRow, oldCol, newRow, newCol);
    }

    // King
    if (piece === "♔" || piece === "♚") {

        const rd = Math.abs(newRow - oldRow);
        const cd = Math.abs(newCol - oldCol);

        if (rd <= 1 && cd <= 1 && rd + cd > 0) {
            return true;
        }
    }

    return false;
}

function pathClear(oldRow, oldCol, newRow, newCol) {

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

    return true;
}

function updateStatus() {

    if (isInCheck(turn)) {
        gameStatus.textContent =
            turn === "white"
                ? "⚠️ White is in CHECK!"
                : "⚠️ Black is in CHECK!";
    } else {
        gameStatus.textContent =
            turn === "white"
                ? "White's Turn"
                : "Black's Turn";
    }
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

    updateStatus();
}

function handleClick(row, col) {

    const piece = pieces[row][col];

    if (selected === null) {

        if (piece === "") return;

        if (turn === "white" && !isWhite(piece)) return;

        if (turn === "black" && !isBlack(piece)) return;

        selected = { row, col };

        return;
    }

    const oldRow = selected.row;
    const oldCol = selected.col;

    if (isLegalMove(oldRow, oldCol, row, col)) {

        const movingPiece = pieces[oldRow][oldCol];

        pieces[row][col] = movingPiece;
        pieces[oldRow][oldCol] = "";

        turn = turn === "white" ? "black" : "white";
    }

    selected = null;

    createBoard();
}

createBoard();
