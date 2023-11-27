// let white_pieces = $("div[class = 'white']");
// let black_pieces = $("div[class = 'black']");
let all_squares = $("#squares_wrapper > div");
let squares_wrapper = $("#squares_wrapper");

let selected_piece = null;
let selected_piece_id = null;
let selected_piece_index = null;

let all_squares_ar = [];
let board_ar = [];

let available_moves = [];
let toMove = false; // w = true; b=false; last moved

let isCheck = false;
let checkColor = null;
let checkedSq = null;
let checkedBy = [];

selected_piece = all_squares.eq(32);
selected_piece_id = " ";


// for (let i = 0; i < all_squares.length; i++) {
//     all_squares.eq(i).addClass("hide");
// }

squares_wrapper.on("click", "div", function () {
    clearSelectedPieces();

    if ($(this).children().length > 0) {
        let child = $(this).children();
        let child_id = child.attr("id");

        child_id = child_id.charAt(child_id.length - 1);

        if ((toMove && child_id === "w") || (toMove === false && child_id === "b")) {
            // console.log("captcha");
            clear_available_moves();
            return;
        }

        selected_piece_id = child_id;

        child_id = child_id.charAt(child_id.length - 1);
        if (child_id == "w") {
            $(this).addClass('white_clicked');

        } else {
            $(this).addClass('black_clicked');

        }

        selected_piece = $(this);
        // selected_piece_index = i;
        movements();

    } else {
        clearSelectedPieces();
        clear_available_moves();

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
        if (temp_i != null) {
            temp_row_board.push(temp_i.attr("id"));

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


function movements() {
    let piece_i_html = selected_piece.children("i");
    let class_list = piece_i_html.attr("class").split(" ");

    clear_available_moves();

    let piece = null;

    if (class_list.includes("pawn")) {
        piece = "pawn";

        pawnMoves(piece_i_html);

    } else if (class_list.includes("rook")) {
        piece = "rook";

        rookMoves(piece_i_html);

    } else if (class_list.includes("knight")) {
        piece = "knight";

        knightMoves(piece_i_html)

    } else if (class_list.includes("bishop")) {
        piece = "bishop";

        bishopMoves(piece_i_html);

    } else if (class_list.includes("king")) {
        piece = "king";

        kingMoves(piece_i_html);

    } else if (class_list.includes("queen")) {
        piece = "queen";

        queenMoves(piece_i_html);

    } else {
        console.log("Unknown piece");

    }

    addActions();

}

function find_place_in_board(id) {
    for (let i = 0; i < board_ar.length; i++) {
        for (let j = 0; j < board_ar[i].length; j++) {
            if (board_ar[i][j] == id) {
                return i + " " + j;
            }
        }
    }
}

function clear_available_moves() {
    for (let i = 0; i < available_moves.length; i++) {
        // console.log(i);
        available_moves[i].removeClass("available");
        available_moves[i].removeClass("available_cut");

        available_moves[i].off("click", availableMovesAction);

    }
    available_moves = [];

}

function add_available_moves(piece) {
    let id = selected_piece.children("i").attr("id");
    // console.log(id);
    let color = id.charAt(id.length - 1);

    let isCut = null;

    try {
        isCut = isOpponentColor(color, piece);
    } catch (e) {
        piece.addClass("available");
        available_moves.push(piece);
    }

    if (isCut) {
        piece.addClass("available_cut");
        available_moves.push(piece);
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
            isCheck = true;
            checkColor = temp_color;
            checkedBy.push(selected_piece);
            checkedSq = square;

            selected_piece.addClass("check");
            square.addClass("check");
            return false;
        }

    } catch (e) {
        throw DOMException;
    }

    return temp_color != color;

}

function addActions() {
    for (let i = 0; i < available_moves.length; i++) {
        available_moves[i].on("click", availableMovesAction);
    }

}

function availableMovesAction() {
    // console.log(selected_piece.html());

    $(this).html(selected_piece.html());
    let temp_id = $(this).children("i").attr("id");

    // console.log(selected_piece);

    selected_piece_id = temp_id;

    temp_id = temp_id.charAt(temp_id.length - 1);

    toMove = (temp_id === "w");

    $(this).removeClass("white");
    $(this).removeClass("black");

    if (temp_id == "w") {
        $(this).addClass("white");

    } else {
        $(this).addClass("black");

    }
    // console.log(temp_id);


    selected_piece.removeClass("black_clicked");
    selected_piece.removeClass("white_clicked");

    selected_piece.html("");
    selected_piece = $(this);

    // console.log(selected_piece);
    clear_available_moves();
    addIdsToArray();
    // let empty_div = findEmptyDiv();\

    clearCheck();
    check();

}

addIdsToArray();

function pawnMoves(piece_i_html) {
    // console.log(selected_piece);
    let id = piece_i_html.attr("id");
    let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    let square_row_1 = null;
    let square_1 = null;

    if (color == "w") {
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

            if (color == "w") {
                square_row_2 = all_squares_ar[row - 2];
                square_2 = square_row_2[col];
            } else {
                square_row_2 = all_squares_ar[row + 2];
                square_2 = square_row_2[col];
            }

            if (square_2.children().length == 0) {
                add_available_moves(square_2);
                // available_moves.push(square_2);
                // square_2.addClass("available");

            }

            add_available_moves(square_1);
            // available_moves.push(square_1)
            // square_1.addClass("available");

        } else {
            add_available_moves(square_1);
            // available_moves.push(square_1);
            // square_1.addClass("available");

        }

    }


    // side 2
    try {
        let square_row = null;
        if (color == "w") {
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
                temp_i_left = isOpponentColor(color, square_left);

            }

            if (temp_i_right) {
                temp_i_right = isOpponentColor(color, square_right);

            }

            if (temp_i_left) {
                add_available_moves(square_left);

                // available_moves.push(square_left);
                // square_left.addClass("available_cut");

            }

            if (temp_i_right) {
                add_available_moves(square_right);

                // available_moves.push(square_right);
                // square_right.addClass("available_cut");

            }

        } else if (col == 0) {
            let square_right = square_row[col + 1];

            if (square_right.children().length > 0) {
                let is_opponent_color = isOpponentColor(color, square_right);

                if (is_opponent_color) {
                    add_available_moves(square_right);

                }

            }

        } else {
            let square_left = square_row[col - 1];

            if (square_left.children().length > 0) {
                let is_opponent_color = isOpponentColor(color, square_left);

                if (is_opponent_color) {
                    add_available_moves(square_left);

                }

            }

        }

        // if (col + 1 != 0) {
        //     let square_row_4 = all_squares_ar[row - 1];
        //     let square_4 = square_row_2[col + 1];
        //
        //     square_4.children("i");
        // }
        // clearSelectedPieces();
        // addActions();
    } catch (e) {
        console.log(e);
    }

    // console.log(place_in_board);
    // let old_div_html = all_squares_ar[row].[col].html();
    // console.log(old_div_html);

}

function rookMoves(piece_i_html) {
    let id = piece_i_html.attr("id");
    let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    L1:for (let i = (col + 1); i < 8; i++) {
        if (all_squares_ar[row][i].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[row][i])) {
                add_available_moves(all_squares_ar[row][i]);
            }
            break L1;
        }

        add_available_moves(all_squares_ar[row][i]);
    }

    L2:for (let i = (col - 1); i >= 0; i--) {
        if (all_squares_ar[row][i].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[row][i])) {
                add_available_moves(all_squares_ar[row][i]);
            }
            break L2;
        }

        add_available_moves(all_squares_ar[row][i]);
    }

    L3:for (let i = (row + 1); i < 8; i++) {
        if (all_squares_ar[i][col].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[i][col])) {
                add_available_moves(all_squares_ar[i][col]);
            }
            break;
        }

        add_available_moves(all_squares_ar[i][col]);
    }

    L4:for (let i = (row - 1); i >= 0; i--) {
        if (all_squares_ar[i][col].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[i][col])) {
                add_available_moves(all_squares_ar[i][col]);
            }
            break;
        }

        add_available_moves(all_squares_ar[i][col]);
    }

    // addActions();

}

function knightMoves(piece_i_html) {
    let id = piece_i_html.attr("id");
    let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    try {
        add_available_moves(all_squares_ar[row - 2][col + 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row - 1][col + 2]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row - 2][col - 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 2][col - 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 2][col + 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row - 1][col - 2]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 1][col - 2]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 1][col + 2]);
    } catch (e) {

    }

}

function bishopMoves(piece_i_html) {
    let id = piece_i_html.attr("id");
    let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    L1:for (let i = (row + 1), j = (col + 1); i < 8 && j < 8; i++ , j++) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[i][j])) {
                add_available_moves(all_squares_ar[i][j]);
            }
            break L1;
        }

        add_available_moves(all_squares_ar[i][j]);
    }

    L2:for (let i = (row + 1), j = (col - 1); i < 8 && j >= 0; i++ , j--) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[i][j])) {
                add_available_moves(all_squares_ar[i][j]);
            }
            break L2;
        }

        add_available_moves(all_squares_ar[i][j]);
    }

    L3:for (let i = (row - 1), j = (col + 1); i >= 0 && j < 8; i-- , j++) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[i][j])) {
                add_available_moves(all_squares_ar[i][j]);
            }
            break L3;
        }

        add_available_moves(all_squares_ar[i][j]);
    }

    L4:for (let i = (row - 1), j = (col - 1); i >= 0 && j >= 0; i-- , j--) {
        if (all_squares_ar[i][j].children().length > 0) {
            if (isOpponentColor(color, all_squares_ar[i][j])) {
                add_available_moves(all_squares_ar[i][j]);
            }
            break L4;
        }

        add_available_moves(all_squares_ar[i][j]);
    }

    // addActions();

}

function queenMoves(piece_i_html) {
    rookMoves(piece_i_html);
    bishopMoves(piece_i_html);

}

function kingMoves(piece_i_html) {
    let id = piece_i_html.attr("id");
    let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(id);
    let row = Number.parseInt(place_in_board.charAt(0));
    let col = Number.parseInt(place_in_board.charAt(2));

    try {
        add_available_moves(all_squares_ar[row - 1][col - 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row - 1][col]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row - 1][col + 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row][col - 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row][col + 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 1][col - 1]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 1][col]);
    } catch (e) {

    }

    try {
        add_available_moves(all_squares_ar[row + 1][col + 1]);
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
        selected_piece_id = temp_selected_piece_id;
        clear_available_moves();
    }

    for (let i = 0; i < black_pieces.length; i++) {
        toMove = true;

        white_pieces.eq(i).click();

        toMove = temp_move;
        selected_piece = temp_selected_piece;
        selected_piece_id = temp_selected_piece_id;
        clear_available_moves();
    }

}

function clearCheck() {
    if (!isCheck) {
        return;
    }

    for (let i = 0; i < checkedBy.length; i++) {
        let temp_square = checkedBy[i];

        temp_square.removeClass("check");

    }

    checkedSq.removeClass("check");

    isCheck = false;
    checkColor = null;
    checkedBy = [];

}

function removeCheckingMoves(availableMove , i) {
    // console.log(selected_piece.html());
    let available_move_html = availableMove.html();
    let selected_piece_html = selected_piece.html();

    let temp_sel_id = selected_piece_id;

    //
    $(this).html(selected_piece.html());
    let temp_id = $(this).children("i").attr("id");

    selected_piece_id = temp_id;

    let color = temp_id.charAt(temp_id.length - 1);

    toMove = (color === "w");

    $(this).removeClass("white");
    $(this).removeClass("black");

    if (temp_id == "w") {
        $(this).addClass("white");

    } else {
        $(this).addClass("black");

    }

    selected_piece.removeClass("black_clicked");
    selected_piece.removeClass("white_clicked");

    selected_piece.html("");
    selected_piece = $(this);

    // console.log(selected_piece);
    clear_available_moves();
    addIdsToArray();
    // let empty_div = findEmptyDiv();\

    clearCheck();
    check();

    if (isCheck) {
        available_moves[i]
    }

}

// setInterval(check, 3000);



