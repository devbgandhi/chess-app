let boardSquaresArray = [];
let isWhiteTurn = true; 
const boardSquares = document.querySelectorAll('.square'); //console.log(boardSquares);
const pieces = document.querySelectorAll('.piece'); //console.log(pieces); 
const piecesImages = document.querySelectorAll("img"); //console.log(piecesImages)
let legalSquares = [];


//drop and drag for every square
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
    //function to setup 
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
        legalSquares = [];
        getPossibleMoves(startingSquareID, piece);
    }
}
function drop(e){
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = e.currentTarget; 
    let destinationSquareID = destinationSquare.id;
    //check if the square is occupied 
    if(isSquareOccupied(destinationSquare) == "blank" && (legalSquares.includes(destinationSquareID))){
    //add
    destinationSquare.appendChild(piece);
    //change turn
    isWhiteTurn = !isWhiteTurn;
    legalSquares = [];
    return;
    }
    if(isSquareOccupied(destinationSquare) != "blank" && (legalSquares.includes(destinationSquareID))){
        
        //remove the piece and add new piece
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        //add
        destinationSquare.appendChild(piece);
        //change turn
        isWhiteTurn = !isWhiteTurn;
        legalSquares = [];
        return;
    }
}

//function to get all the possible views
function getPossibleMoves(startingSquareID, piece){
    const pieceColor = piece.getAttribute("color");
    if(piece.classList.contains("pawn")){
        getPawnMoves(startingSquareID, pieceColor);
    }
    if(piece.classList.contains("bishop")){
        getBishopMoves(startingSquareID, pieceColor);
    }
    if (piece.classList.contains("knight")){
        getKnightMoves(startingSquareID, pieceColor);
    }
    //if rook
    if(piece.classList.contains("rook")){
        getRookMoves(startingSquareID, pieceColor);
    }
    //if queen
    if(piece.classList.contains("queen")){
        getQueenMoves(startingSquareID, pieceColor);
    }

    //if king
    if(piece.classList.contains("king")){
        getKingMoves(startingSquareID, pieceColor);
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
//pawn
function getPawnMoves(startingSquareID, pieceColor){
    checkPawnDiagonalCaptures(startingSquareID, pieceColor);
    checkPawnForwardMoves(startingSquareID,pieceColor);
}
function checkPawnDiagonalCaptures(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor == "white" ? 1 : -1;
    const newRank = rankNumber + direction;
    
    // Check both diagonal squares (left and right)
    for(let i = -1; i <= 1; i += 2){
        const newFileCode = file.charCodeAt(0) + i;
        if(newFileCode >= 97 && newFileCode <= 104){ // 'a' to 'h'
            const newFile = String.fromCharCode(newFileCode);
            const currentSquareID = newFile + newRank;
            const currentSquare = document.getElementById(currentSquareID);
            
            if(currentSquare){
                const squareContent = isSquareOccupied(currentSquare);
                // Can only capture enemy pieces diagonally
                if(squareContent != "blank" && squareContent != pieceColor){
                    legalSquares.push(currentSquareID);
                }
            }
        }
    }
}

function checkPawnForwardMoves(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor == "white" ? 1 : -1;
    
    // Check one square forward
    const oneSquareForward = rankNumber + direction;
    const oneSquareID = file + oneSquareForward;
    const oneSquare = document.getElementById(oneSquareID);
    
    if(oneSquare && isSquareOccupied(oneSquare) == "blank"){
        legalSquares.push(oneSquareID);
        
        // Check two squares forward if on starting rank
        const isStartingRank = (pieceColor == "white" && rankNumber == 2) || 
                              (pieceColor == "black" && rankNumber == 7);
        
        if(isStartingRank){
            const twoSquaresForward = rankNumber + (direction * 2);
            const twoSquareID = file + twoSquaresForward;
            const twoSquare = document.getElementById(twoSquareID);
            
            if(twoSquare && isSquareOccupied(twoSquare) == "blank"){
                legalSquares.push(twoSquareID);
            }
        }
    }
}
//function getKnightMoves()
function getKnightMoves(startingSquareID, pieceColor){
    const file = startingSquareID.charCodeAt(0)-97;
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;

    const moves = [
        [-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2],[-2,-1]
    ];
    moves.forEach((move) => {
        currentFile= file + move[0];
        currentRank = rankNumber + move[1];
        if(currentFile >= 0 && currentFile <= 7 && currentRank > 0 && currentRank <= 8){
            let currentSquareID = String.fromCharCode(currentFile+97)+ currentRank;
            let currentSquare = document.getElementById(currentSquareID);
            let squareContent = isSquareOccupied(currentSquare);
            if(squareContent != "blank" && squareContent == pieceColor){
                return;
            } else{
                legalSquares.push(String.fromCharCode(currentFile+97)+currentRank);
            }
        }
    });
}

//Rook Moves
function getRookMoves(startingSquareID, pieceColor){
    moveToEightRank(startingSquareID, pieceColor);
    moveToFirstRank(startingSquareID, pieceColor);
    moveToAFile(startingSquareID, pieceColor);
    moveToHFile(startingSquareID, pieceColor);
}
function moveToEightRank(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentRank = rankNumber;
    while(currentRank != 8 ){
        currentRank++;
        let currentSquareID = file + currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        
        if(squareContent != "blank" && squareContent == pieceColor) return;
        
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
    return;

}
function moveToFirstRank(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentRank = rankNumber;
    while(currentRank != 1 ){
        currentRank--;
        let currentSquareID = file + currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        
        if(squareContent != "blank" && squareContent == pieceColor) return;
        
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
    return;

}
function moveToAFile(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    let currentFile = file;
    while(currentFile != "a"){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length - 1) - 1);
        let currentSquareID = currentFile + rank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        
        if(squareContent != "blank" && squareContent == pieceColor) return;
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
    return;

}
function moveToHFile(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    let currentFile = file;
    while(currentFile != "h"){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length - 1) +1);
        let currentSquareID = currentFile + rank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        
        if(squareContent != "blank" && squareContent == pieceColor) return;
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
    return;

}

//Bishop Moves
function getBishopMoves(startingSquareID, pieceColor){
    moveToEightRankHFile(startingSquareID, pieceColor);
    moveToEightRankAFile(startingSquareID, pieceColor);
    moveToFirstRankHFile(startingSquareID, pieceColor);
    moveToFirstRankAFile(startingSquareID, pieceColor);
}
function moveToEightRankAFile(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    while(!(currentFile == "a" && currentRank == 8)){
        currentFile = String.fromCharCode(
            currentFile.charCodeAt(currentFile.length-1) - 1
        );
        currentRank++;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        if(squareContent != "blank" && squareContent == pieceColor) return;
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
}
function moveToEightRankHFile(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    while(!(currentFile == "h" && currentRank == 8)){
        currentFile = String.fromCharCode(
            currentFile.charCodeAt(currentFile.length-1) + 1
        );
        currentRank++;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        if(squareContent != "blank" && squareContent == pieceColor) return;
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
}
function moveToFirstRankAFile(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    while(!(currentFile == "a" && currentRank == 1)){
        currentFile = String.fromCharCode(
            currentFile.charCodeAt(currentFile.length-1) - 1
        );
        currentRank--;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        if(squareContent != "blank" && squareContent == pieceColor) return;
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
}
function moveToFirstRankHFile(startingSquareID, pieceColor){
    const file = startingSquareID.charAt(0);
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    while(!(currentFile == "h" && currentRank == 1)){
        currentFile = String.fromCharCode(
            currentFile.charCodeAt(currentFile.length-1) + 1
        );
        currentRank--;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        let squareContent = isSquareOccupied(currentSquare);
        if(squareContent != "blank" && squareContent == pieceColor) return;
        legalSquares.push(currentSquareID);
        if(squareContent != "blank" && squareContent != pieceColor) return;

    }
}

//Queen Moves 

function getQueenMoves (startingSquareID, pieceColor) {
    getRookMoves(startingSquareID, pieceColor);
    getBishopMoves(startingSquareID, pieceColor);
}

function getKingMoves(startingSquareID, pieceColor){
    const file = startingSquareID.charCodeAt(0)-97;
    const rank = startingSquareID.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;

    const moves = [
        [0,1], [0,-1], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1], [1,0]
    ];
    moves.forEach((move) => {
        currentFile= file + move[0];
        currentRank = rankNumber + move[1];
        if(currentFile >= 0 && currentFile <= 7 && currentRank > 0 && currentRank <= 8){
            let currentSquareID = String.fromCharCode(currentFile+97)+ currentRank;
            let currentSquare = document.getElementById(currentSquareID);
            let squareContent = isSquareOccupied(currentSquare);
            if(squareContent != "blank" && squareContent == pieceColor){
                return;
            } else{
                legalSquares.push(String.fromCharCode(currentFile+97)+currentRank);
            }
        }
    });
}