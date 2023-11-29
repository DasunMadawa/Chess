import {CheckModel} from "../../model/CheckModel.js";
import {PieceModel} from "../../model/PieceModel.js";
// import {SelectedPieceModel} from "../../model/SelectedPieceModel.js";

// let white_pieces = $("div[class = 'white']");
// let black_pieces = $("div[class = 'black']");
let all_squares = $("#squares_wrapper > div");
let squares_wrapper = $("#squares_wrapper");

let selected_piece = null;

let all_squares_ar = [];
let board_ar = [];

// let available_moves = [];
let toMove = false; // w = true; b=false; last moved

let checked = new CheckModel(false, null, null, []);

// selected_piece = all_squares.eq(32);
// selected_piece_id = " ";

let break_iteration_check = false;

// for (let i = 0; i < all_squares.length; i++) {
//     all_squares.eq(i).addClass("hide");
// }

function init() {

}

squares_wrapper.on("click", "div", function () {
    clearSelectedPieces();
    clear_available_moves();

    if ($(this).children().length > 0) {
        selected_piece = findPieceObject($(this).children("i").attr("id"));

        // let child_id = child.attr("id");

        // let color = child_id.charAt(child_id.length - 1);

        if ((toMove && selected_piece.color === "w") || (toMove === false && selected_piece.color === "b")) {
            // console.log("captcha");
            clear_available_moves();
            return;
        }

        if (selected_piece.color == "w") {
            $(this).addClass('white_clicked');

        } else {
            $(this).addClass('black_clicked');

        }

        // selected_piece_index = i;
        // movements();
        showAvailableMoves();

    } else {

    }


});


// for (let i = 0; i < white_pieces.length; i++) {
//     white_pieces.eq(i).on("click", function () {
//         try {
//             if (selected_piece_index != null) {
//                 white_pieces.eq(selected_piece_index).removeClass('white_clicked');
//                 black_pieces.eq(selected_piece_index).removeClass('black_clicked');
//             }
//
//         } catch (e) {
//             console.log(e);
//
//         }
//         $(this).addClass('white_clicked');
//
//         selected_piece = $(this);
//         selected_piece_index = i;
//         movements();
//
//     });
//
// }
//
// for (let i = 0; i < black_pieces.length; i++) {
//     black_pieces.eq(i).on("click", function () {
//         try {
//             if (selected_piece_index != null) {
//                 black_pieces.eq(selected_piece_index).removeClass('black_clicked');
//                 white_pieces.eq(selected_piece_index).removeClass('white_clicked');
//             }
//
//         } catch (e) {
//             console.log(e);
//
//         }
//         $(this).addClass('black_clicked');
//         selected_piece = $(this);
//         selected_piece_index = i;
//         movements();
//
//     });
//
// }

function clearSelectedPieces() {
    for (let i = 0; i < all_squares.length; i++) {
        try {
            all_squares.eq(i).removeClass('black_clicked');
            all_squares.eq(i).removeClass('white_clicked');

        } catch (e) {
            console.log(e);
        }
    }
    selected_piece = null;
}

function addIdsToArray() {
    all_squares_ar = [];
    board_ar = [];

    var temp_row_divs = [];
    var temp_row_board = [];

    for (let i = 0; i < all_squares.length; i++) {
        temp_row_divs.push(all_squares.eq(i));

        let temp_i = all_squares.eq(i).children("i");
        if (temp_i.length > 0) {
            let id = temp_i.attr("id");
            let list = id.split("_");
            let name = list[0];
            let color = list[list.length - 1];
            let sq = $(`i[id = ${id}]`).parent();

            // selected_piece_id = id;
            // movements();
            // let moves = available_moves;
            // clear_available_moves();

            temp_row_board.push(new PieceModel(id, name, color, [], sq));

        } else {
            temp_row_board.push(null);

        }

        if (temp_row_divs.length == 8) {
            all_squares_ar.push(temp_row_divs);
            board_ar.push(temp_row_board);
            temp_row_divs = [];
            temp_row_board = [];

        }

    }

    // console.log(all_squares_ar);
    // console.log(board_ar);

}

function setMovements() {
    let temp_sel_piece = selected_piece;
    // let temp_sel_id = selected_piece_id;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pieceObj = board_ar[i][j];
            if (pieceObj != null) {
                selected_piece = pieceObj;
                // selected_piece_id = pieceObj.id;
                clear_available_moves();
                movements();

                // board_ar[i][j].availableMoves = available_moves;
            }
        }
    }

    selected_piece = temp_sel_piece;
    // selected_piece_id = temp_sel_id;


}

function removeIllegalMoves() {
    for (let i = 0; i < selected_piece.availableMoves.length; i++) {
        let temp_moves = selected_piece.availableMoves;

        let isCheckedCover = redoChecking(selected_piece.availableMoves[i]);
        selected_piece.availableMoves = temp_moves;

        if (checked.isCheck && isCheckedCover) {
            selected_piece.availableMoves.splice(i, 1);
            i--;
            continue;
        }

        let isCheckedPrevent = redoChecking(selected_piece.availableMoves[i]);
        selected_piece.availableMoves = temp_moves;

        if (isCheckedPrevent) {
            selected_piece.availableMoves.splice(i, 1);
            console.log(temp_moves.length);
            i--;
            continue;
        }

    }
}

function showAvailableMoves() {
    // for (let i = 0; i < selected_piece.availableMoves.length; i++) {
    //     let temp_moves = selected_piece.availableMoves;
    //
    //     let isCheckedCover = redoChecking(selected_piece.availableMoves[i]);
    //     selected_piece.availableMoves = temp_moves;
    //
    //     if (checked.isCheck && isCheckedCover) {
    //         selected_piece.availableMoves.splice(i, 1);
    //         i--;
    //         continue;
    //     }
    //
    //     let isCheckedPrevent = redoChecking(selected_piece.availableMoves[i]);
    //     selected_piece.availableMoves = temp_moves;
    //
    //     if (isCheckedPrevent) {
    //         selected_piece.availableMoves.splice(i, 1);
    //         console.log(temp_moves.length);
    //         i--;
    //         continue;
    //     }
    //
    // }
    // add_available_moves(selected_piece.availableMoves[i]);
    removeIllegalMoves();

    addActions();
}

function findPieceObject(id) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let piece = board_ar[i][j];
            if (piece != null && piece.id == id) {
                return piece;
            }
        }
    }
}

addIdsToArray();
setMovements();

console.log(board_ar);

// console.log(all_squares_ar);

function movements() {
    clear_available_moves();

    if (selected_piece.pieceName === "pawn") {
        pawnMoves(selected_piece);

    } else if (selected_piece.pieceName === "rook") {
        rookMoves(selected_piece);

    } else if (selected_piece.pieceName === "knight") {
        knightMoves(selected_piece);

    } else if (selected_piece.pieceName === "bishop") {
        bishopMoves(selected_piece);

    } else if (selected_piece.pieceName === "king") {
        kingMoves(selected_piece);

    } else if (selected_piece.pieceName === "queen") {
        queenMoves(selected_piece);

    } else {
        console.log("Unknown piece");

    }

    // addActions();

}

function find_place_in_board(id) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let piece = board_ar[i][j];
            if (piece != null && piece.id == id) {
                return i + " " + j;
            }
        }
    }
}

function clear_available_moves() {
    for (let i = 0; i < all_squares.length; i++) {
        all_squares.eq(i).removeClass("available");
        all_squares.eq(i).removeClass("available_cut");

        all_squares.eq(i).off("click", availableMovesAction);

    }
    if (selected_piece != null) {
        selected_piece.availableMoves = [];

    }
    // available_moves = [];

}

function add_available_moves(piece) {
    let color = selected_piece.color;

    let isCut = null;
    try {
        isCut = isOpponentColor(color, piece);
    } catch (e) {
        piece.addClass("available");
        // available_moves.push(piece);
    }

    if (isCut) {
        piece.addClass("available_cut");
        // available_moves.push(piece);
    }


    // console.log(available_moves.length);
}

function isOpponentColor(color, square) {
    let child = square.children();
    let id = null;
    let temp_color = null;

    try {
        id = child.attr("id");

        temp_color = id.charAt(id.length - 1);

        if (id.substring(0, 4) == "king" && temp_color != color) {
            if (checked.isCheck && checked.checkColor == color) {
                if (selected_piece.id.substring(0, 4) == "king") {

                } else {
                    checked.checkColor = temp_color;

                }

            } else {
                checked.isCheck = true;

                if (selected_piece.color === "w") {
                    checked.checkColor = "b";

                } else {
                    checked.checkColor = "w";

                }

                checked.checkedSq = square;
                checked.checkedBy.push(selected_piece.div);

                // console.log(checked.checkedSq);
                // console.log(checked.checkedBy);

                // isCheck = true;
                // checkColor = temp_color;
                // checkedBy.push(selected_piece);
                // checkedSq = square;

                selected_piece.div.addClass("check");
                square.addClass("check");
            }

            return false;
        }

    } catch (e) {
        throw DOMException;
    }

    return temp_color != color;

}

function addActions() {
    if (selected_piece == null) {
        return;
    }
    // console.log(selected_piece);
    for (let i = 0; i < selected_piece.availableMoves.length; i++) {
        // console.log(selected_piece.id);

        add_available_moves(selected_piece.availableMoves[i]);
        selected_piece.availableMoves[i].on("click", availableMovesAction);
    }

}

function doMoves(piece) {
    piece.html(selected_piece.div.html());

    toMove = (selected_piece.color === "w");

    piece.removeClass("white");
    piece.removeClass("black");

    selected_piece.div.removeClass("white");
    selected_piece.div.removeClass("black");

    if (selected_piece.color == "w") {
        piece.addClass("white");

    } else {
        piece.addClass("black");

    }

    selected_piece.div.removeClass("black_clicked");
    selected_piece.div.removeClass("white_clicked");

    selected_piece.div.html("");
    selected_piece.div = piece;

}

function availableMovesAction() {
    // $(this).html(selected_piece.div.html());
    //
    // toMove = (selected_piece.color === "w");
    //
    // $(this).removeClass("white");
    // $(this).removeClass("black");
    //
    // selected_piece.div.removeClass("white");
    // selected_piece.div.removeClass("black");
    //
    // if (selected_piece.color == "w") {
    //     $(this).addClass("white");
    //
    // } else {
    //     $(this).addClass("black");
    //
    // }
    //
    // selected_piece.div.removeClass("black_clicked");
    // selected_piece.div.removeClass("white_clicked");
    //
    // selected_piece.div.html("");
    // selected_piece.div = $(this);


    doMoves($(this));

    clear_available_moves();
    clearCheck();

    addIdsToArray();
    setMovements();
    // console.log(selected_piece);

    if (checked.isCheck && isCheckMate()) {
        let temp_color = null;
        if (checked.checkColor == "w") {
            temp_color = "White";
        } else {
            temp_color = "Black"
        }

        Swal.fire({
            title: "Checkmate",
            text: temp_color + " player is checkmate",
            icon: "warning"
        });
    }

}

// addIdsToArray();

function redoChecking(sq) {
    let available_move_html = sq.html();
    let selected_piece_html = selected_piece.div.html();
    let temp_sel_piece = selected_piece.div
    let temp_move = toMove;
    let sq_obj = null;

    let is_checked = null;

    if (sq.children().length > 0) {
        sq_obj = findPieceObject(sq.children("i").attr("id"));
    }

    doMoves(sq);

    clear_available_moves();
    clearCheck();

    addIdsToArray();
    setMovements();

    if (checked.isCheck && checked.checkColor == selected_piece.color) {
        is_checked = true;
    } else {
        is_checked = false;
    }

    sq.html(available_move_html);
    selected_piece.div = temp_sel_piece;
    selected_piece.div.html(selected_piece_html);

    toMove = temp_move

    sq.removeClass("white");
    sq.removeClass("black");
    selected_piece.div.removeClass("white");
    selected_piece.div.removeClass("black");

    if (sq_obj != null) {
        if (sq_obj.color == "w") {
            sq.addClass("white");

        } else {
            sq.addClass("black");

        }
    }

    if (selected_piece.color == "w") {
        selected_piece.div.addClass("white");
        selected_piece.div.addClass("white_clicked");
    } else {
        selected_piece.div.addClass("black");
        selected_piece.div.addClass("black_clicked");

    }

    clear_available_moves();
    clearCheck();

    addIdsToArray();
    setMovements();

    return is_checked;

}

function isCheckMate() {
    let isMovesLeft = false;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let temp_el = board_ar[i][j];

            if (temp_el != null) {
                let temp_color = checked.checkedSq.children("i").attr("id");
                temp_color = temp_color.charAt(temp_color.length - 1);

                if (temp_el.color == temp_color) {
                    temp_el.div.click();
                    if (temp_el.availableMoves.length > 0) {
                        isMovesLeft = true;

                    }
                }

            }

        }
    }

    return !isMovesLeft;

}

function pawnMoves(piece) {
    // console.log(selected_piece);
    // let id = piece_i_html.attr("id");
    // let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(piece.id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    if (row == 0 || row == 7) {
        return;
    }

    let square_row_1 = null;
    let square_1 = null;

    if (piece.color == "w") {
        square_row_1 = all_squares_ar[row - 1];
        square_1 = square_row_1[col];

    } else {
        square_row_1 = all_squares_ar[row + 1];
        square_1 = square_row_1[col];

    }

    if (square_1.children().length == 0) {
        // pawns at start
        if (row == 1 || row == 6) {
            let square_row_2 = null;
            let square_2 = null;

            if (piece.color == "w") {
                square_row_2 = all_squares_ar[row - 2];
                square_2 = square_row_2[col];
            } else {
                square_row_2 = all_squares_ar[row + 2];
                square_2 = square_row_2[col];
            }

            if (square_2.children().length == 0) {
                // add_available_moves(square_2);
                piece.availableMoves.push(square_2);

                // available_moves.push(square_2);
                // square_2.addClass("available");

            }

            // add_available_moves(square_1);
            piece.availableMoves.push(square_1);

            // available_moves.push(square_1)
            // square_1.addClass("available");

        } else {
            // add_available_moves(square_1);
            piece.availableMoves.push(square_1);

            // available_moves.push(square_1);
            // square_1.addClass("available");

        }

    }


    // side 2
    try {
        let square_row = null;
        if (piece.color == "w") {
            square_row = all_squares_ar[row - 1];

        } else {
            square_row = all_squares_ar[row + 1];

        }

        if (col != 0 && col != 7) {
            let square_left = square_row[col - 1];
            let square_right = square_row[col + 1];

            let temp_i_left = square_left.children().length > 0;
            let temp_i_right = square_right.children().length > 0;

            if (temp_i_left) {
                temp_i_left = isOpponentColor(piece.color, square_left);

            }

            if (temp_i_right) {
                temp_i_right = isOpponentColor(piece.color, square_right);

            }

            if (temp_i_left) {
                // add_available_moves(square_left);
                piece.availableMoves.push(square_left);

                // available_moves.push(square_left);
                // square_left.addClass("available_cut");

            }

            if (temp_i_right) {
                // add_available_moves(square_right);
                piece.availableMoves.push(square_right);

                // available_moves.push(square_right);
                // square_right.addClass("available_cut");

            }

        } else if (col == 0) {
            let square_right = square_row[col + 1];

            if (square_right.children().length > 0) {
                let is_opponent_color = isOpponentColor(piece.color, square_right);

                if (is_opponent_color) {
                    // add_available_moves(square_right);
                    piece.availableMoves.push(square_right);

                }

            }

        } else {
            let square_left = square_row[col - 1];

            if (square_left.children().length > 0) {
                let is_opponent_color = isOpponentColor(piece.color, square_left);

                if (is_opponent_color) {
                    // add_available_moves(square_left);
                    piece.availableMoves.push(square_left);

                }

            }

        }

    } catch (e) {
        console.log(e);
    }

}

function rookMoves(piece) {
    let place_in_board = find_place_in_board(piece.id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    L1:for (let i = (col + 1); i < 8; i++) {
        if (all_squares_ar[row][i].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[row][i])) {
                piece.availableMoves.push(all_squares_ar[row][i]);
            }
            break L1;
        }

        // add_available_moves(all_squares_ar[row][i]);
        piece.availableMoves.push(all_squares_ar[row][i]);
    }

    L2:for (let i = (col - 1); i >= 0; i--) {
        if (all_squares_ar[row][i].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[row][i])) {
                piece.availableMoves.push(all_squares_ar[row][i]);
            }
            break L2;
        }

        // add_available_moves(all_squares_ar[row][i]);
        piece.availableMoves.push(all_squares_ar[row][i]);
    }

    L3:for (let i = (row + 1); i < 8; i++) {
        if (all_squares_ar[i][col].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][col])) {
                piece.availableMoves.push(all_squares_ar[i][col]);
            }
            break;
        }

        // add_available_moves(all_squares_ar[i][col]);
        piece.availableMoves.push(all_squares_ar[i][col]);
    }

    L4:for (let i = (row - 1); i >= 0; i--) {
        if (all_squares_ar[i][col].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][col])) {
                piece.availableMoves.push(all_squares_ar[i][col]);
            }
            break;
        }

        // add_available_moves(all_squares_ar[i][col]);
        piece.availableMoves.push(all_squares_ar[i][col]);
    }

    // addActions();

}

function knightMoves(piece) {
    let place_in_board = find_place_in_board(piece.id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    try {
        filterKnightMoves(all_squares_ar[row - 2][col + 1]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row - 1][col + 2]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row - 2][col - 1]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row + 2][col - 1]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row + 2][col + 1]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row - 1][col - 2]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row + 1][col - 2]);
    } catch (e) {

    }

    try {
        filterKnightMoves(all_squares_ar[row + 1][col + 2]);
    } catch (e) {

    }

}

function bishopMoves(piece) {
    let place_in_board = find_place_in_board(piece.id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    L1:for (let i = (row + 1), j = (col + 1); i < 8 && j < 8; i++ , j++) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][j])) {
                piece.availableMoves.push(all_squares_ar[i][j]);
            }
            break L1;
        }

        piece.availableMoves.push(all_squares_ar[i][j]);
    }

    L2:for (let i = (row + 1), j = (col - 1); i < 8 && j >= 0; i++ , j--) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][j])) {
                piece.availableMoves.push(all_squares_ar[i][j]);
            }
            break L2;
        }

        piece.availableMoves.push(all_squares_ar[i][j]);
    }

    L3:for (let i = (row - 1), j = (col + 1); i >= 0 && j < 8; i-- , j++) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][j])) {
                piece.availableMoves.push(all_squares_ar[i][j]);
            }
            break L3;
        }

        piece.availableMoves.push(all_squares_ar[i][j]);
    }

    L4:for (let i = (row - 1), j = (col - 1); i >= 0 && j >= 0; i-- , j--) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][j])) {
                piece.availableMoves.push(all_squares_ar[i][j]);
            }
            break L4;
        }

        piece.availableMoves.push(all_squares_ar[i][j]);
    }

    // addActions();

}

function queenMoves(piece_i_html) {
    rookMoves(piece_i_html);
    bishopMoves(piece_i_html);

}

function kingMoves(piece) {
    let place_in_board = find_place_in_board(piece.id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    try {
        filterKingMoves(all_squares_ar[row - 1][col - 1]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row - 1][col]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row - 1][col + 1]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row][col - 1]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row][col + 1]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row + 1][col - 1]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row + 1][col]);
    } catch (e) {

    }

    try {
        filterKingMoves(all_squares_ar[row + 1][col + 1]);
    } catch (e) {

    }

}

function check() {
    let temp_selected_piece = selected_piece;
    let temp_selected_piece_id = selected_piece_id;
    let temp_move = toMove;

    // if (isCheck) {
    //     selected_piece.click();
    //     console.log(available_moves.length);
    //
    //     if (available_moves.children().length > 0) {
    //
    //     }
    //
    // }

    let white_pieces = $("div[class = 'white']");
    let black_pieces = $("div[class = 'black']");


    for (let i = 0; i < white_pieces.length; i++) {
        toMove = false;

        white_pieces.eq(i).click();

        toMove = temp_move;
        selected_piece = temp_selected_piece;
        // selected_piece_id = temp_selected_piece_id;
        clear_available_moves();
    }

    for (let i = 0; i < black_pieces.length; i++) {
        toMove = true;

        white_pieces.eq(i).click();

        toMove = temp_move;
        selected_piece = temp_selected_piece;
        // selected_piece_id = temp_selected_piece_id;
        clear_available_moves();
    }

}

function clearCheck() {
    if (!checked.isCheck) {
        return;
    }

    for (let i = 0; i < checked.checkedBy.length; i++) {
        let temp_square = checked.checkedBy[i];
        temp_square.removeClass("check");

    }

    checked.checkedSq.removeClass("check");

    checked = new CheckModel(false, null, null, []);

}

function removeCheckingMoves(availableMove, i) {
    if (break_iteration_check) {
        return;
    }

    console.log(available_moves.length);
    console.log(selected_piece);
    let temp_available_moves = available_moves.slice();
    let temp_sel_piece = selected_piece
    let available_move_html = availableMove.html();
    let selected_piece_html = selected_piece.html();

    let temp_sel_id = selected_piece_id;
    let temp_move = toMove;


    //
    availableMove.html(selected_piece.html());
    let temp_id = availableMove.children("i").attr("id");
    console.log(temp_id);
    // selected_piece_id = temp_id;

    let color = temp_id.charAt(temp_id.length - 1);

    toMove = (color === "w");

    availableMove.removeClass("white");
    availableMove.removeClass("black");

    selected_piece.removeClass("white");
    selected_piece.removeClass("black");

    if (color == "w") {
        availableMove.addClass("white");

    } else {
        availableMove.addClass("black");

    }

    selected_piece.removeClass("black_clicked");
    selected_piece.removeClass("white_clicked");

    selected_piece.html("");
    selected_piece = availableMove;

    clear_available_moves();
    // addIdsToArray();

    break_iteration_check = true;

    clearCheck();
    check();

    //
    // available_moves = temp_available_moves;
    availableMove.removeClass("white");
    availableMove.removeClass("black");

    console.log(available_move_html);
    console.log(selected_piece_html);

    availableMove.html(available_move_html);
    selected_piece = temp_sel_piece;
    selected_piece.html(selected_piece_html);

    // selected_piece_id = temp_sel_id;

    toMove = temp_move;
    availableMove.addClass("available");

    if (color == "w") {
        selected_piece.addClass("white");
        selected_piece.addClass("white_clicked");

    } else {
        selected_piece.addClass("black");
        selected_piece.addClass("black_clicked");

    }

    if (isCheck) {
        console.log("check");
        available_moves[i].removeClass("available");
        available_moves[i].removeClass("available_cut");
        available_moves.splice(i, 1);
    }

    console.log("helloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");

    break_iteration_check = false;
}

function filterKnightMoves(piece) {
    if (piece.children().length > 0) {
        if (isOpponentColor(selected_piece.color, piece)) {
            selected_piece.availableMoves.push(piece);

        }

    } else {
        selected_piece.availableMoves.push(piece);

    }

}

function filterKingMoves(piece) {
    if (piece.children().length > 0) {
        if (isOpponentColor(selected_piece.color, piece)) {
            selected_piece.availableMoves.push(piece);
            // let is_check_move = filterCheckMoves(piece);
            // if (!is_check_move) {
            // }

        }

    } else {
        selected_piece.availableMoves.push(piece);
        // let is_check_move = filterCheckMoves(piece);
        // if (!is_check_move) {
        // }

    }


    // filterKnightMoves(piece);

}

function filterCheckMoves(piece) {
    // let current_move_id = piece.attr("id");
    // console.log(selected_piece.id);
    //
    // for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //         let temp_el = board_ar[i][j];
    //         // console.log(current_move_id);
    //         if (temp_el != null) {
    //             console.log(temp_el.color);
    //             console.log(selected_piece.color);
    //
    //             for (let k = 0; k < temp_el.availableMoves.length; k++) {
    //                 if (temp_el.availableMoves[k].attr("id") == current_move_id && temp_el.color != selected_piece.color) {
    //                     console.log("gotchaaaaaaaaaaaaaa");
    //                     console.log(temp_el.availableMoves[k].attr("id"));
    //                     return true;
    //
    //                 }
    //             }
    //
    //         }
    //
    //     }
    // }
    // return false;

}

// setInterval(check, 3000);



