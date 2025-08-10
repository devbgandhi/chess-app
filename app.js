let boardSquaresArray = [];
let isWhiteTurn = true; 
const boardSquares = document.querySelectorAll('.square'); //console.log(boardSquares);
const pieces = document.querySelectorAll('.piece'); //console.log(pieces); 
const piecesImages = document.querySelectorAll("img"); //console.log(piecesImages)


//function to setup board squares
function setupBoardSquares(){
    setupPieces();
    for(let i = 0; i <boardSquares.length; i++){
        //set eventlisteners for drop
        boardSquares[i].addEventListener('dragover', allowDrop);
        boardSquares[i].addEventListener('drop', drop);
        
        //method to set up rows this way each square will have a a1 - h8 defined
        let row = 8 - Math.floor(i/8);
        let col = String.fromCharCode(97 + (i % 8));

        //set up id for each square
        let square = boardSquares[i];
        square.id = col + row; 
    }
    setupPieces(); 
}

setupBoardSquares();

//function to setup each peice
function setupPieces() {
    for(let i = 0; i < pieces.length; i++){
        //Add events dragstart and set draggable = true;
        pieces[i].addEventListener('dragstart', drag);
        pieces[i].setAttribute('draggable', true);
        //way to get a second class name 
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;

    }
    for(let i = 0; i < piecesImages.length; i++){
        piecesImages[i].setAttribute('draggable', false);
    }
}



//
function allowDrop(e){
    e.preventDefault();
}
function drag(e){
    const piece = e.target;
    const pieceColor = piece.getAttribute('color');
    const pieceType = piece.classList[1];
    const pieceId = piece.id;

    //check turn === color 
    if((isWhiteTurn && pieceColor == "white") || (!isWhiteTurn && pieceColor == "black")){
        const startingSquareID = piece.parentNode.id;
        e.dataTransfer.setData("text", pieceId);
    }
}
function drop(e){
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = e.currentTarget; 
    let destinationSquareID = destinationSquare.id;
    //check if the square is occupied 
    if(isSquareOccupied(destinationSquare) == "blank"){
    //add
    destinationSquare.appendChild(piece);
    //change turn
    isWhiteTurn = !isWhiteTurn;
    return;
    }
    if(isSquareOccupied(destinationSquare) != "blank"){
        
        //remove the piece and add new piece
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        //add
        destinationSquare.appendChild(piece);
        //change turn
        isWhiteTurn = !isWhiteTurn;
        return;
    }
}

//check if the isSquareOccupied
function isSquareOccupied(square){
    if(square.querySelector('.piece')){
        const color = square.querySelector('.piece').getAttribute('color');
        return color;   
    } else {
        return "blank";
    }
}


