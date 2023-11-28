export class PieceModel {
    constructor(id , pieceName , color , availableMoves , div) {
        this.id = id;
        this.pieceName = pieceName;
        this.color = color;
        this.availableMoves = availableMoves;
        this.div = div;
    }
}