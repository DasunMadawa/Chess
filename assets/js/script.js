let white_pieces = $("div[class = 'white']");
let black_pieces = $("div[class = 'black']");
let all_squares = $("#squares_wrapper > div");

let selected_piece = null;
let selected_piece_index = null;

let all_squares_ar = [];
let board_ar = [];

let available_moves = [];

for (let i = 0; i < white_pieces.length; i++) {
    white_pieces.eq(i).on("click", function () {
        try {
            if (selected_piece_index != null) {
                white_pieces.eq(selected_piece_index).removeClass('white_clicked');
                black_pieces.eq(selected_piece_index).removeClass('black_clicked');
            }

        } catch (e) {
            console.log(e);

        }
        $(this).addClass('white_clicked');

        selected_piece = $(this);
        selected_piece_index = i;
        movements();

    });

}

for (let i = 0; i < black_pieces.length; i++) {
    black_pieces.eq(i).on("click", function () {
        try {
            if (selected_piece_index != null) {
                black_pieces.eq(selected_piece_index).removeClass('black_clicked');
                white_pieces.eq(selected_piece_index).removeClass('white_clicked');
            }

        } catch (e) {
            console.log(e);

        }
        $(this).addClass('black_clicked');
        selected_piece = $(this);
        selected_piece_index = i;
        movements();

    });

}

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


console.log(all_squares_ar);
console.log(board_ar);


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

    } else if (class_list.includes("knight")) {
        piece = "knight";

    } else if (class_list.includes("bishop")) {
        piece = "bishop";

    } else if (class_list.includes("king")) {
        piece = "king";

    } else if (class_list.includes("queen")) {
        piece = "queen";

    } else {
        console.log("Unknown piece");

    }

}

function pawnMoves(piece_i_html) {
    let id = piece_i_html.attr("id");
    let color = id.charAt(id.length - 1);

    let place_in_board = find_place_in_board(id);
    let row = place_in_board.charAt(0);
    let col = place_in_board.charAt(2);

    let square_row_1 = null;
    let square_1 = null;

    if (color == "w") {
        square_row_1 = all_squares_ar[row - 1];
        square_1 = square_row_1[col];

    } else {
        square_row_1 = all_squares_ar[Number.parseInt(row) + 1];
        square_1 = square_row_1[col];

    }

    if (square_1.children().length == 0) {
        // pawns at start
        if (row == 1 || 6) {
            let square_row_2 = null;
            let square_2 = null;

            if (color == "w") {
                square_row_2 = all_squares_ar[row - 2];
                square_2 = square_row_2[col];
            } else {
                square_row_2 = all_squares_ar[Number.parseInt(row) + 2];
                square_2 = square_row_2[col];
            }
            available_moves.push(square_1, square_2);

            square_1.addClass("available");
            square_2.addClass("available");

        } else {
            available_moves.push(square_1);

            square_1.addClass("available");

        }

    }


    // side 2
    try {
        let square_row = null;
        if (color == "w") {
            square_row = all_squares_ar[row - 1];

        } else {
            square_row = all_squares_ar[Number.parseInt(row) + 1];

        }

        if (col != 0 && col != 7) {
            let square_left = square_row[col - 1];
            let square_right = square_row[Number.parseInt(col) + 1];

            let temp_i_left = square_left.children().length > 0;
            let temp_i_right = square_right.children().length > 0;

            if (temp_i_left) {
                temp_i_left = isOpponentColor(color , square_left);

            }

            if (temp_i_right) {
                temp_i_right = isOpponentColor(color , square_right);

            }

            if (temp_i_left) {

                available_moves.push(square_left);
                square_left.addClass("available_cut");

            }

            if (temp_i_right) {
                available_moves.push(square_right);
                square_right.addClass("available_cut");

            }

        } else if (col == 0) {
            let square_right = square_row[Number.parseInt(col) + 1];

            if (square_right.children().length > 0) {
                let is_opponent_color = isOpponentColor(color, square_right);

                if (is_opponent_color) {
                    available_moves.push(square_right);
                    square_right.addClass("available_cut");

                }

            }

        } else {
            let square_left = square_row[col - 1];

            if (square_left.children().length > 0) {
                let is_opponent_color = isOpponentColor(color, square_left);

                if (is_opponent_color) {
                    available_moves.push(square_left);
                    square_left.addClass("available_cut");

                }

            }

        }

        // if (col + 1 != 0) {
        //     let square_row_4 = all_squares_ar[row - 1];
        //     let square_4 = square_row_2[col + 1];
        //
        //     square_4.children("i");
        // }

    } catch (e) {
        console.log(e);
    }

    // console.log(place_in_board);
    // let old_div_html = all_squares_ar[row].[col].html();
    // console.log(old_div_html);

}

function find_place_in_board(id) {
    L1:for (let i = 0; i < board_ar.length; i++) {
        for (let j = 0; j < board_ar[i].length; j++) {
            if (board_ar[i][j] == id) {
                return i + " " + j;
            }
        }
    }
}

function clear_available_moves() {
    for (let i = 0; i < available_moves.length; i++) {
        available_moves[i].removeClass("available");
        available_moves[i].removeClass("available_cut");

    }
    available_moves = [];

}

function isOpponentColor(color, square) {
    let child = square.children();
    child = child.attr("id");
    let temp_color = child.charAt(child.length - 1);

    return temp_color != color;

}
