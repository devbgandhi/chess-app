let boardSquaresArray = [];
let isWhiteTurn = true;
let whiteKingSquare = "e1";
let blackKingSquare = "e8";
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");
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

//fillBoardSquaresArray to get currentBoard
function fillBoardSquaresArray() {
  const boardSquares = document.getElementsByClassName("square");
  for (let i = 0; i < boardSquares.length; i++) {
    let row = 8 - Math.floor(i / 8);
    let column = String.fromCharCode(97 + (i % 8));
    let square = boardSquares[i];
    square.id = column + row;
    let color = "";
    let pieceType = "";
    let pieceId="";
    if (square.querySelector(".piece")) {
      color = square.querySelector(".piece").getAttribute("color");
      pieceType = square.querySelector(".piece").classList[1];
      pieceId=square.querySelector(".piece").id;
    } else {
      color = "blank";
      pieceType = "blank";
      pieceId ="blank";
    }
    let arrayElement = {
      squareId: square.id,
      pieceColor: color,
      pieceType: pieceType,
      pieceId:pieceId
    };
    boardSquaresArray.push(arrayElement);
  }
}
//function to fill and Array as pieces
        function fillBoardSquaresArray() {
    const boardSquares = document.getElementsByClassName("square");
    for (let i = 0; i < boardSquares.length; i++) {
        let row = 8 - Math.floor(i / 8);
        let column = String.fromCharCode(97 + (i % 8));
        let square = boardSquares[i];
        square.id = column + row;
        let color = "";
        let pieceType = "";
        let pieceId="";
        if (square.querySelector(".piece")) {
            color = square.querySelector(".piece").getAttribute("color");
            pieceType = square.querySelector(".piece").classList[1];
            pieceId=square.querySelector(".piece").id;
        } else {
            color = "blank";
            pieceType = "blank";
            pieceId ="blank";
        }
        let arrayElement = {
            squareId: square.id,
            pieceColor: color,
            pieceType: pieceType,
            pieceId:pieceId
        };
        boardSquaresArray.push(arrayElement);
    }
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



//drop and drag
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
        // Check bounds before accessing DOM
        if(currentFile < "a" || currentRank > 8) break;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        if(!currentSquare) break; // Safety check
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
        // Check bounds before accessing DOM
        if(currentFile > "h" || currentRank > 8) break;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        if(!currentSquare) break; // Safety check
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
        // Check bounds before accessing DOM
        if(currentFile < "a" || currentRank < 1) break;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        if(!currentSquare) break; // Safety check
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
        // Check bounds before accessing DOM
        if(currentFile > "h" || currentRank < 1) break;
        let currentSquareID = currentFile+currentRank;
        let currentSquare = document.getElementById(currentSquareID);
        if(!currentSquare) break; // Safety check
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
function checkForCheckMate(){
  let kingSquare=isWhiteTurn ?whiteKingSquare:blackKingSquare;
  let pieceColor=isWhiteTurn ? "white" : "black";
  let boardSquaresArrayCopy=deepCopyArray(boardSquaresArray);
  let kingIsCheck=isKingInCheck(kingSquare,pieceColor,boardSquaresArrayCopy);
  if(!kingIsCheck)return;
  let possibleMoves=getAllPossibleMoves(boardSquaresArrayCopy,pieceColor);
  if(possibleMoves.length>0) return;
  let message="";
  isWhiteTurn ? (message="Black Wins!") : (message="White Wins!");
  showAlert(message);
}

function isMoveValidAgainstCheck(legalSquares,startingSquareId,pieceColor,pieceType){
  let kingSquare=isWhiteTurn ? whiteKingSquare : blackKingSquare;
  let boardSquaresArrayCopy=deepCopyArray(boardSquaresArray);
  let legalSquaresCopy = legalSquares.slice();
  legalSquaresCopy.forEach((element)=>{
    let destinationId=element;
    boardSquaresArrayCopy=deepCopyArray(boardSquaresArray);
    updateBoardSquaresArray(startingSquareId,destinationId,boardSquaresArrayCopy);
    if(pieceType!="king" && isKingInCheck(kingSquare,pieceColor,boardSquaresArrayCopy)){
      legalSquares=legalSquares.filter((item)=>item!=destinationId);
    }
    if(pieceType=="king" && isKingInCheck(destinationId,pieceColor,boardSquaresArrayCopy)){
      legalSquares=legalSquares.filter((item)=>item!=destinationId);
    }
  })
  return legalSquares;
}

function isKingInCheck(squareId,pieceColor,boardSquaresArray) {
  let legalSquares=getRookMoves(squareId,pieceColor,boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId,boardSquaresArray);
    if(
      (pieceProperties.pieceType=="rook" ||
      pieceProperties.pieceType=="queen") &&
      pieceColor!=pieceProperties.pieceColor
    ) return true;
  }
  legalSquares=getBishopMoves(squareId,pieceColor,boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId,boardSquaresArray);
    if(
      (pieceProperties.pieceType=="bishop" ||
      pieceProperties.pieceType=="queen") &&
      pieceColor!=pieceProperties.pieceColor
    ) return true;
  }
   legalSquares=checkPawnDiagonalCaptures(squareId,pieceColor,boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId,boardSquaresArray);
    if(
      (pieceProperties.pieceType=="pawn") &&
      pieceColor!=pieceProperties.pieceColor
    ) return true;
  }
  legalSquares=getKnightMoves(squareId,pieceColor,boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId,boardSquaresArray);
    if(
      (pieceProperties.pieceType=="knight") &&
      pieceColor!=pieceProperties.pieceColor
    ) return true;
  }
  legalSquares=getKingMoves(squareId,pieceColor,boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId,boardSquaresArray);
    if(
      (pieceProperties.pieceType=="king") &&
      pieceColor!=pieceProperties.pieceColor
    ) return true;
  }
  return false;
}

function showAlert(message) {
  const alert= document.getElementById("alert");
  alert.innerHTML=message;
  alert.style.display="block";

  setTimeout(function(){
     alert.style.display="none";
  },3000);
}