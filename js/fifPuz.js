// ----- PARAMETERS -----
// sizes
let minimumDim = 3;
let maximumDim = 8;
let dim = 4;
let rPieceSize = 16;
let rGapSize = 1;
let unit = "%";
let borderTop = 0;
let borderLeft = 0;
let pieceSize = 16;
let gapSize = 1;
let pieceWithGapSize = pieceSize + gapSize;

pieces = [...Array(dim)].map(e => Array(dim))

// empty cell
let ex = dim - 1;
let ey = dim - 1;

// moves
let moves = 0;

// time
let timeout = 100;
let timePassed = 0;
let timerActive = false;

// solveDegree
let solveDegree = dim * dim - 1;

// colourPattern
let defaultColourPattern = [];
let monochromeColourPattern = [];
let palenightColourPattern = [];
let colourPattern = "none";


function startGame() {
    $('#startingInstruction').hide();
    updateDimPieces();
    pieces = [...Array(dim)].map(e => Array(dim))
    timePassed = 0;
    solveDegree = dim * dim - 1;

    initializePieces();


    if (timerActive) {
        endTimer();
    }

    shuffle(1500);
    moves = 0;
    $("#movesCounterValue").html(moves);

    timerActive = true;
    startTimer();
}


function updateDim(newDim) {
    dim = newDim;
    $('#dimValue').html(newDim);

    // reset all buttons
    for (let i = minimumDim; i <= maximumDim; i++) {
        $('#topButton' + i).css("background-color", "darkorange");
    }

    // set the button active
    $('#topButton' + newDim).css("background-color", "crimson");
}


function updateDimPieces() {
    $("#gameBoard").empty();

    for (let i = 0; i < dim * dim - 1; i++) {
        $("#gameBoard").append(
            '<div class="piece" style="user-select: none" onclick="onClickOnPiece(' + (i + 1) + ')" id="p' + (i + 1) + '">' + (i + 1) + '</div>'
        )
    }
}


function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}


function shuffle(depth) {
    let rand;

    for (let i = 0; i < depth; i++) {
        rand = randomInteger(1, 4);

        if (rand === 1) {
            moveEmptyPiece(-1, 0);
        } else if (rand === 2) {
            moveEmptyPiece(1, 0);
        } else if (rand === 3) {
            moveEmptyPiece(0, -1);
        } else {
            moveEmptyPiece(0, 1);
        }
    }
}


// key handling
window.onkeydown = function (event) {
    if (event.keyCode === 32) {
        startGame();
    } else if (event.keyCode === 87 || event.keyCode === 38) {
        // up
        if (event.shiftKey) {
            moveUntilEdge(-1, 0);
            return;
        }
        moveEmptyPiece(-1, 0);
    } else if (event.keyCode === 83 || event.keyCode === 40) {
        // down
        if (event.shiftKey) {
            moveUntilEdge(1, 0);
            return;
        }
        moveEmptyPiece(1, 0);
    } else if (event.keyCode === 65 || event.keyCode === 37) {
        // left
        if (event.shiftKey) {
            moveUntilEdge(0, -1);
            return;
        }
        moveEmptyPiece(0, -1);
    } else if (event.keyCode === 68 || event.keyCode === 39) {
        // right
        if (event.shiftKey) {
            moveUntilEdge(0, 1);
            return;
        }
        moveEmptyPiece(0, 1);
    } else if (event.keyCode === 72) {
        // Controls (H)
        onSettingsCloseButton();
        onControlsCloseButton();
        onControlsButton();
    } else if (event.keyCode === 80) {
        // Settings (P)
        onSettingsCloseButton();
        onControlsCloseButton();
        onSettingsButton();
    } else if (event.keyCode === 27) {
        // close the window (ESC)
        onSettingsCloseButton();
        onControlsCloseButton();

    } else if (event.keyCode >= 51 && event.keyCode <= 56) {
        // set size
        updateDim(event.keyCode - 48);
        startGame();
    } else if (event.keyCode === 109) {
        // decrease size
        onChangeSizeButton(-1);

    } else if (event.keyCode === 107) {
        // increase size
        onChangeSizeButton(1);
    }
}


function initializePieces() {
    recountPieceGapSize();
    ex = dim - 1;
    ey = dim - 1;

    // initializing the array of pieces
    let piecesCount = 1;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (i === dim - 1 && j === dim - 1) {
                pieces[i][j] = 0;
                break;
            }

            $('#p' + pieces[ex][ey]).data('posx', ex);
            $('#p' + pieces[ex][ey]).data('posy', ey);

            pieces[i][j] = piecesCount++;
        }
    }

    let currentPieceNumber = 1;
    let currentPiece;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (i === dim - 1 && j === dim - 1)
                break;

            currentPiece = document.getElementById("p" + currentPieceNumber++);
            currentPiece.style.top = (borderTop + i * pieceWithGapSize) + unit;
            currentPiece.style.left = (borderLeft + j * pieceWithGapSize) + unit;
        }
    }

    //setColourPattern(colourPattern);
}


function onClickOnPiece(index) {

    let piece = $('#p' + index);
    let x = piece.data('posx');
    let y = piece.data('posy');

    let difX = x - ex;
    let difY = y - ey;

    if (x !== ex && y !== ey)
        return;

    if (x > ex) {
        // down
        for (let i = 0; i < difX; i++)
            moveEmptyPiece(1, 0);
        return;
    }
    if (ex > x) {
        // up
        for (let i = 0; i < -difX; i++)
            moveEmptyPiece(-1, 0);
        return;
    }
    if (y > ey) {
        // right
        for (let i = 0; i < difY; i++)
            moveEmptyPiece(0, 1);
        return;
    }
    if (ey > y) {
        // left
        for (let i = 0; i < -difY; i++)
            moveEmptyPiece(0, -1);
    }

}


function setPieceNewPosition(pieceNumber, x, y) {
    currentPiece = document.getElementById("p" + pieceNumber);
    currentPiece.style.top = (borderTop + x * pieceWithGapSize) + unit;
    currentPiece.style.left = (borderLeft + y * pieceWithGapSize) + unit;
}


function moveEmptyPiece(x, y) {
    let nx = ex + x;
    let ny = ey + y;

    if (0 <= nx && nx < dim && 0 <= ny && ny < dim) {
        changeSolveDegree(ex, ey, pieces[nx][ny], nx, ny);
        pieces[ex][ey] = pieces[nx][ny];

        $('#p' + pieces[ex][ey]).data('posx', ex);
        $('#p' + pieces[ex][ey]).data('posy', ey);

        setPieceNewPosition(pieces[ex][ey], ex, ey);
        pieces[nx][ny] = 0;
        ex = nx;
        ey = ny;

        if (timerActive) {
            moves++;
            $("#movesCounterValue").html(moves);
        }
    }
}

function moveUntilEdge(x, y) {
    for (let i = 0; i < dim - 1; i++)
        moveEmptyPiece(x, y);
}

function changeSolveDegree(oldX, oldY, piece, x, y) {
    let before = ((x * dim + y + 1) === piece);
    let after = ((oldX * dim + oldY + 1) === piece);


    if (before === true && after === false) {
        solveDegree--;
    } else if (before === false && after === true) {
        solveDegree++;
    }

}


function recountPieceGapSize() {
    let relativePieceSize = rPieceSize / rGapSize;
    let relCount = relativePieceSize * dim + rGapSize * (dim - 1);
    let actual = 100.0 / relCount;

    pieceSize = actual * relativePieceSize;
    gapSize = actual;
    pieceWithGapSize = pieceSize + gapSize;

    let pieceSizeProp = pieceSize + "%";

    $(".piece").css("height", pieceSizeProp);
    $(".piece").css("width", pieceSizeProp);
}


function onGameWin() {
    endTimer();
    $(".piece").css("background-color", "green");
}


function changeMPS() {
    let mps = Math.floor(moves * 100 / timePassed);
    let deciseconds = Math.floor(mps % 10);
    mps = Math.floor(mps / 10);
    $('#mpsValue').html(`${mps}.${deciseconds}`);
}


function onChangeSizeButton(newDimOffset) {
    let newDim = dim + newDimOffset;
    if (newDim >= minimumDim && newDim <= maximumDim) {
        updateDim(newDim);
        startGame();
    }
}

// ----- WINDOWS OPENING -----

function onControlsButton() {
    $('#blurredBlock').show();
    $('#popUpInfo').show();
}

function onControlsCloseButton() {
    $('#blurredBlock').hide();
    $('#popUpInfo').hide();
}

function onSettingsButton() {
    $('#blurredBlock').show();
    $('#popUpSettings').show();
}

function onSettingsCloseButton() {
    $('#blurredBlock').hide();
    $('#popUpSettings').hide();
}


function onColorThemeButton(theme) {

    if (theme === "default") {
        // default colour theme
        document.documentElement.style.setProperty('--body-color', 'black');
        document.documentElement.style.setProperty('--body-background-color', 'cornsilk');
        document.documentElement.style.setProperty('--piece-background-color', 'coral');
        document.documentElement.style.setProperty('--piece-text-color', '#f1f1f1');
        document.documentElement.style.setProperty('--toppanelelement-background-color', 'darkorange');
        document.documentElement.style.setProperty('--toppanelelement-text-color', 'darkred');
        document.documentElement.style.setProperty('--toppanelelement-border', '1px solid sienna');
        document.documentElement.style.setProperty('--toppanelsizeelement-background-color', 'lightcoral');
        document.documentElement.style.setProperty('--bottompanelvalue-background-color', '#c8ffae');
        document.documentElement.style.setProperty('--blurredblock-color', 'rgba(240, 128, 128, 0.5)');

    } else if (theme === "monochrome") {
        // monochrome colour theme
        document.documentElement.style.setProperty('--body-color', 'black');
        document.documentElement.style.setProperty('--body-background-color', 'white');
        document.documentElement.style.setProperty('--piece-background-color', 'lightgray');
        document.documentElement.style.setProperty('--piece-text-color', 'black');
        document.documentElement.style.setProperty('--toppanelelement-background-color', 'gray');
        document.documentElement.style.setProperty('--toppanelelement-text-color', 'black');
        document.documentElement.style.setProperty('--toppanelelement-border', '1px solid gray');
        document.documentElement.style.setProperty('--toppanelsizeelement-background-color', 'darkgray');
        document.documentElement.style.setProperty('--bottompanelvalue-background-color', 'lightgray');
        document.documentElement.style.setProperty('--blurredblock-color', 'rgba(128, 128, 128, 0.5)');

    } else if (theme === "palenight") {
        // palenight colour theme
        document.documentElement.style.setProperty('--body-color', 'rgb(166, 172, 205)');
        document.documentElement.style.setProperty('--body-background-color', 'rgb(32, 35, 49)');
        document.documentElement.style.setProperty('--piece-background-color', 'rgb(65, 72, 99)');
        document.documentElement.style.setProperty('--piece-text-color', 'rgb(128, 203, 196)');
        document.documentElement.style.setProperty('--toppanelelement-background-color', 'rgb(67, 50, 87)');
        document.documentElement.style.setProperty('--toppanelelement-text-color', 'rgb(128, 203, 196)');
        document.documentElement.style.setProperty('--toppanelelement-border', '1px solid rgb(175, 177, 179)');
        document.documentElement.style.setProperty('--toppanelsizeelement-background-color', 'rgb(35, 34, 53)');
        document.documentElement.style.setProperty('--bottompanelvalue-background-color', 'rgb(65, 72, 99)');
        document.documentElement.style.setProperty('--blurredblock-color', 'rgba(171, 71, 188, 0.5)');

    }
}


function onColourPatternButton(pattern) {
    setColourPattern(pattern);
}


// ----- TIMER -----

function startTimer() {
    timerInterval = setInterval(() => {

        if (solveDegree === dim * dim - 1)
            onGameWin();

        $("#timerValue").html(formatTime(timePassed));
        timePassed++;

        changeMPS();

    }, timeout);
}


function endTimer() {
    timerActive = false;

    clearInterval(timerInterval);
}


function formatTime(time) {
    let deciseconds = time % 10;
    time = Math.floor(time / 10);

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}.${deciseconds}`;
}


// ----- COLOUR -----
function setColourPattern(pattern) {
    if (pattern === 'none') {
        colourPattern = "none";
    } else if (pattern === 'rows') {
        colourPattern = "rows";
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                $('#p' + (i * dim + j + 1)).css('background-color', defaultColourPattern[i]);
            }
        }

    } else if (pattern === 'fringe') {
        colourPattern = "fringe";
        for (let i = 0; i < dim; i++) {
            for (let j = i; j < dim; j++) {
                $('#p' + (i * dim + j + 1)).css('background-color', defaultColourPattern[i]);
                $('#p' + (j * dim + i + 1)).css('background-color', defaultColourPattern[i]);
            }
        }
    }
}


function initializeColourPattern() {
    //let defaultThemePieceColour = [255, 127, 80];
    let monochromeThemePieceColour =  [211, 211, 211];
    let palenightThemePieceColour = [65, 72, 99];

    // default
    defaultColourPattern.push(
        'rgb(220, 5, 12)',
        'rgb(232, 96, 28)',
        'rgb(241, 147, 45)',
        'rgb(246, 193, 65)',
        'rgb(247, 240, 86)',
        'rgb(202, 224, 171)',
        'rgb(144, 201, 135)',
        'rgb(78, 178, 101)',
        'rgb(123, 175, 222)',
        'rgb(82, 137, 199)',
        'rgb(25, 101, 176)',
        'rgb(136, 46, 114)',
    );
}


// on load
window.onload = function() {
    setDayNightColourTheme();
    //initializeColourPattern();
}

function setDayNightColourTheme() {
    let currentDate = new Date();
    let hours = currentDate.getHours();

    if (hours >= 20 || hours < 8)
        onColorThemeButton("palenight");
}

// language
function setLanguage(language) {
    if (language === "english") {
        $('#settingsLabel').html('Settings');
        $('#settingsLabel').css('font-size', '2.8vmin');
        $('#controlsLabel').html('Controls');
        $('#controlsLabel').css('font-size', '2.8vmin');

        $('#mpsLabel').html('MPS');
        $('#timerLabel').html('TIME');
        $('#movesCounterLabel').html('MOVES');

        $('#startingInstructionH1').html(
            'Press <span class="keySpan">SPACE</span> or click to start a new game '
        );

        $('#controlsPopUpWindowElement').html(
            'Controls'
        );

        $('#controlsPopUpWindowElement2').html(
            '     <span class="keySpan">SPACE</span> start a new game <br/>\n' +
            '            <span class="keySpan">P</span> open the settings <br/>\n' +
            '            <span class="keySpan">H</span> open the controls <br/>\n' +
            '            <span class="keySpan">ESC</span> close the window <br/>\n' +
            '            <span class="keySpan">↑←↓→</span> <span class="keySpan">WASD</span> <span class="keySpan">mouse</span> move pieces<br/>\n' +
            '            <span class="keySpan">SHIFT</span> + <span class="keySpan">↑←↓→</span> <span class="keySpan">WASD</span>  move multiple pieces<br/>\n' +
            '            <span class="keySpan">3-8</span> <span class="keySpan">-</span> <span class="keySpan">+</span> set the size <br/>'

        );

        $('#settingsPopUpWindowElement2').html(
            'Colour theme'
        );

        $('#defaultThemeButton').html('default');
        $('#monochromeThemeButton').html('monochrome');
        $('#palenightThemeButton').html('palenight');

        $('#languagePopUpWindowElement').html(
            'Language'
        );


    } else if (language === "russian") {
        $('#settingsLabel').html('Настройки');
        $('#settingsLabel').css('font-size', '2.2vmin');
        $('#controlsLabel').html('Управление');
        $('#controlsLabel').css('font-size', '2.1vmin');

        $('#mpsLabel').html('ходов/сек');
        $('#timerLabel').html('ВРЕМЯ');
        $('#movesCounterLabel').html('ХОДЫ');

        $('#startingInstructionH1').html(
            'Нажмите <span class="keySpan">ПРОБЕЛ</span> или кликните, чтобы начать новую игру '
        );

        $('#controlsPopUpWindowElement').html(
            'Управление'
        );

        $('#controlsPopUpWindowElement2').html(
            '     <span class="keySpan">SPACE</span> начать новую игру <br/>\n' +
            '            <span class="keySpan">P</span> открыть настройки <br/>\n' +
            '            <span class="keySpan">H</span> открыть управление <br/>\n' +
            '            <span class="keySpan">ESC</span> закрыть окно <br/>\n' +
            '            <span class="keySpan">↑←↓→</span> <span class="keySpan">WASD</span> <span class="keySpan">мышь</span> перемещать костяшки<br/>\n' +
            '            <span class="keySpan">SHIFT</span> + <span class="keySpan">↑←↓→</span> <span class="keySpan">WASD</span>  перемещать несколько костяшек<br/>\n' +
            '            <span class="keySpan">3-8</span> <span class="keySpan">-</span> <span class="keySpan">+</span> изменить размер <br/>'
        );

        $('#settingsPopUpWindowElement2').html(
            'Цветовая схема'
        );

        $('#defaultThemeButton').html('по умолчанию');
        $('#monochromeThemeButton').html('черно-белая');
        $('#palenightThemeButton').html('темная');

        $('#languagePopUpWindowElement').html(
            'Язык'
        );
    }
}