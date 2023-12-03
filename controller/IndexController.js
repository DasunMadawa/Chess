import {CheckModel} from "../model/CheckModel.js";
import {PieceModel} from "../model/PieceModel.js";
import {KingCastleModel} from "../model/KingCastleModel.js";

let all_squares = $("#squares_wrapper > div");
let squares_wrapper = $("#squares_wrapper");

let selected_piece = null;

let all_squares_ar = [];
let board_ar = [];

let toMove = false; // w = true; b=false; last moved

let checked_w = new CheckModel(false, null, null, []);
let checked_b = new CheckModel(false, null, null, []);

let break_iteration_check = false;

let newId = 3;

let white_castle = new KingCastleModel(true, true, true, false);
let black_castle = new KingCastleModel(true, true, true, false);

squares_wrapper.on("click", "div", function () {
    clearSelectedPieces();
    clear_available_moves();

    if ($(this).children().length > 0) {
        selected_piece = findPieceObject($(this).children("i").attr("id"));

        if ((toMove && selected_piece.color === "w") || (toMove === false && selected_piece.color === "b")) {
            clear_available_moves();
            return;
        }

        if (selected_piece.color == "w") {
            $(this).addClass('white_clicked');

        } else {
            $(this).addClass('black_clicked');

        }

        showAvailableMoves();

    } else {

    }


});

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

}

function setMovements() {
    let temp_sel_piece = selected_piece;


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pieceObj = board_ar[i][j];
            if (pieceObj != null) {
                selected_piece = pieceObj;

                clear_available_moves();
                movements();

            }
        }
    }

    selected_piece = temp_sel_piece;



}

function removeIllegalMoves() {
    for (let i = 0; i < selected_piece.availableMoves.length; i++) {
        let temp_moves = selected_piece.availableMoves;

        let isCheckedCover = redoChecking(selected_piece.availableMoves[i]);
        selected_piece.availableMoves = temp_moves;

        if (isCheckedCover) {
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


}

function add_available_moves(piece) {
    let color = selected_piece.color;

    let isCut = null;
    try {
        isCut = isOpponentColor(color, piece);
    } catch (e) {
        piece.addClass("available");

    }

    if (isCut) {
        piece.addClass("available_cut");

    }

}

function isOpponentColor(color, square) {
    let child = square.children();
    let id = null;
    let temp_color = null;

    try {
        id = child.attr("id");

        temp_color = id.charAt(id.length - 1);

        if (id.substring(0, 4) == "king" && temp_color != color) {

            let temp_check = null;

            if (selected_piece.color === "w") {
                temp_check = checked_b;
                temp_check.checkColor = "b";

            } else {
                temp_check = checked_w;
                temp_check.checkColor = "w";

            }

            temp_check.isCheck = true;


            temp_check.checkedSq = square;
            temp_check.checkedBy.push(selected_piece.div);

            selected_piece.div.addClass("check");
            square.addClass("check");

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

    for (let i = 0; i < selected_piece.availableMoves.length; i++) {

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

    pawnChecking($(this));
    doMoves($(this));

    clear_available_moves();
    clearCheck();

    addIdsToArray();
    setMovements();

    checkMateChecking();

    let temp_castle = null;

    if (selected_piece.color == "w") {
        temp_castle = white_castle;
    } else {
        temp_castle = black_castle;
    }

    let temp_sel = selected_piece;

    if (temp_castle.isOk && selected_piece.pieceName == "king") {
        console.log("inside");
        let temp_div_id = selected_piece.div.attr("id");
        let row = temp_div_id.charAt(0);
        let col = temp_div_id.charAt(2);

        console.log(col);

        let temp_rook = null;
        let temp_col = null;
        if (col == 2) {
            temp_rook = board_ar[row][0];
            temp_col = 3;
        } else if (col == 6) {
            temp_rook = board_ar[row][7];
            temp_col = 5;
        } else if (col == 3 || col == 5) {
            checkCastleFacilities();
            return;
        }

        toMove = !toMove;

        temp_rook.div.click();
        doMoves(all_squares_ar[row][temp_col]);

        temp_castle.isOk = false;
        console.log("changed");

    } else {
        black_castle.isOk = false;
        white_castle.isOk = false;
    }

    selected_piece = temp_sel

    checkCastleFacilities();

}

function checkMateChecking() {
    let temp_check = null;
    if (selected_piece.color === "w") {
        temp_check = checked_b;

    } else {
        temp_check = checked_w;

    }

    if (temp_check.isCheck && isCheckMate(temp_check)) {
        let temp_color = null;
        if (temp_check.checkColor == "w") {
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

    let temp_check = null;

    if (selected_piece.color === "w") {
        temp_check = checked_w;

    } else {
        temp_check = checked_b;

    }

    if (temp_check.isCheck && temp_check.checkColor == selected_piece.color) {
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

function checkCastleFacilities() {
    let temp_castle = null;

    let place_in_board = find_place_in_board(selected_piece.id);
    let col = Number.parseInt(place_in_board.charAt(2));

    if (selected_piece.color == "w") {
        temp_castle = white_castle;
    } else {
        temp_castle = black_castle;
    }

    if (selected_piece.pieceName == "rook") {
        console.log(selected_piece.id);
        if (col == 0) {
            temp_castle.isRook1Ok = false;
        } else if (col == 7) {
            temp_castle.isRook2Ok = false
        }

    } else if (selected_piece.pieceName == "king") {
        console.log(selected_piece.id);
        temp_castle.isKingOk = false;
    }

}

function addCastleMoves(row, col) {
    let temp_castle = null;

    if (selected_piece.color == "w") {
        temp_castle = white_castle;
    } else {
        temp_castle = black_castle;
    }

    if (!temp_castle.isKingOk) {
        temp_castle.isOk = false;
        return;
    }

    let left_ok = (board_ar[row][col - 1] == null) && (board_ar[row][col - 2] == null) && (board_ar[row][col - 3] == null);
    let right_ok = (board_ar[row][col + 1] == null) && (board_ar[row][col + 2] == null);

    if (!temp_castle.isRook1Ok) {
        left_ok = false;
    } else if (left_ok) {
        temp_castle.isOk = true;
        selected_piece.availableMoves.push(all_squares_ar[row][col - 2]);

    }

    if (!temp_castle.isRook2Ok) {
        right_ok = false;
    } else if (right_ok) {
        temp_castle.isOk = true;
        selected_piece.availableMoves.push(all_squares_ar[row][col + 2]);

    }

}

function isCheckMate(check_ob) {
    let temp_check = check_ob;
    let temp_sel = selected_piece.div;

    let isMovesLeft = false;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let temp_el = board_ar[i][j];

            if (temp_el != null) {
                let temp_color = temp_check.checkedSq.children("i").attr("id");
                temp_color = temp_color.charAt(temp_color.length - 1);

                if (temp_el.color == temp_color) {
                    temp_el.div.click();
                    if (temp_el.availableMoves.length > 0) {
                        isMovesLeft = true;
                        console.log(temp_el.id);

                    }
                }

            }

        }
    }

    temp_sel.click();
    return !isMovesLeft;

}

function pawnChecking(piece) {
    if (selected_piece.pieceName != "pawn") {
        return;
    }

    if (!(piece.attr("id").charAt(0) == 0 || piece.attr("id").charAt(0) == 7)) {
        return;
    }

    let temp_color = null;
    if (selected_piece.color == "w") {
        temp_color = "white";
    } else {
        temp_color = "black";

    }

    $("#pawn_promo_bg > #pawn_promo_wrapper > div").css("color", temp_color);
    $("#pawn_promo_bg").css("display", "block");


}


function setPawnPromoActions() {
    let choices = $("#pawn_promo_bg > #pawn_promo_wrapper > div");

    for (let i = 0; i < choices.length; i++) {
        let temp_choice = choices.eq(i);

        temp_choice.on("click", () => {

            let temp_id = temp_choice.children("i").attr("id");

            selected_piece.pieceName = temp_id;

            temp_id = temp_id + "_" + newId + "_" + selected_piece.color;
            selected_piece.div.html(temp_choice.html());

            selected_piece.div.children("i").attr("id", temp_id);

            $("#pawn_promo_bg").css("display", "none");

            selected_piece.id = temp_id;

            toMove = !toMove;

            addIdsToArray();
            movements();
            toMove = !toMove;
            checkMateChecking();

            newId++;
        });

    }

}

setPawnPromoActions();

function pawnMoves(piece) {
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
        if ((row == 1 && piece.color == "b") || (row == 6 && piece.color == "w")) {
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
                piece.availableMoves.push(square_2);

            }

            piece.availableMoves.push(square_1);

        } else {
            piece.availableMoves.push(square_1);

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
                piece.availableMoves.push(square_left);

            }

            if (temp_i_right) {
                piece.availableMoves.push(square_right);

            }

        } else if (col == 0) {
            let square_right = square_row[col + 1];

            if (square_right.children().length > 0) {
                let is_opponent_color = isOpponentColor(piece.color, square_right);

                if (is_opponent_color) {
                    piece.availableMoves.push(square_right);

                }

            }

        } else {
            let square_left = square_row[col - 1];

            if (square_left.children().length > 0) {
                let is_opponent_color = isOpponentColor(piece.color, square_left);

                if (is_opponent_color) {
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

        piece.availableMoves.push(all_squares_ar[row][i]);
    }

    L2:for (let i = (col - 1); i >= 0; i--) {
        if (all_squares_ar[row][i].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[row][i])) {
                piece.availableMoves.push(all_squares_ar[row][i]);
            }
            break L2;
        }

        piece.availableMoves.push(all_squares_ar[row][i]);
    }

    L3:for (let i = (row + 1); i < 8; i++) {
        if (all_squares_ar[i][col].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][col])) {
                piece.availableMoves.push(all_squares_ar[i][col]);
            }
            break;
        }

        piece.availableMoves.push(all_squares_ar[i][col]);
    }

    L4:for (let i = (row - 1); i >= 0; i--) {
        if (all_squares_ar[i][col].children().length > 0) {
            if (isOpponentColor(piece.color, all_squares_ar[i][col])) {
                piece.availableMoves.push(all_squares_ar[i][col]);
            }
            break;
        }

        piece.availableMoves.push(all_squares_ar[i][col]);
    }

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

    addCastleMoves(row, col);

}

function check() {
    let temp_selected_piece = selected_piece;
    let temp_move = toMove;

    let white_pieces = $("div[class = 'white']");
    let black_pieces = $("div[class = 'black']");


    for (let i = 0; i < white_pieces.length; i++) {
        toMove = false;

        white_pieces.eq(i).click();

        toMove = temp_move;
        selected_piece = temp_selected_piece;
        clear_available_moves();
    }

    for (let i = 0; i < black_pieces.length; i++) {
        toMove = true;

        white_pieces.eq(i).click();

        toMove = temp_move;
        selected_piece = temp_selected_piece;
        clear_available_moves();
    }

}

function clearCheck() {
    if (checked_b.isCheck) {
        clearCheckSq(checked_b);
        checked_b = new CheckModel(false, null, null, []);
    }

    if (checked_w.isCheck) {
        clearCheckSq(checked_w);
        checked_w = new CheckModel(false, null, null, []);
    }

}

function clearCheckSq(checked) {
    for (let i = 0; i < checked.checkedBy.length; i++) {
        let temp_square = checked.checkedBy[i];
        temp_square.removeClass("check");

    }

    checked.checkedSq.removeClass("check");


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

        }

    } else {
        selected_piece.availableMoves.push(piece);

    }

}


