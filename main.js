// les sons
// let music = document.querySelector(".music");
// let winSound = document.querySelector(".win-sound");
// let looseSound = document.querySelector(".loose-sound");
let music = new Audio('sounds/music.mp4');
music.volume = 0.5;
music.volume *= 2;
let winSound = new Audio('sounds/win.mp3');
winSound.volume = 0.05;
let looseSound = new Audio('sounds/loose.mp3');
looseSound.volume = 0.1;

// créer la grille et placer les aliens
let container = document.querySelector('.grid');
let resultVar = document.querySelector('h3');
let startButton = document.querySelector('.start-button');
let restartButton = document.querySelector('.restart-button');

let allDivs;
let alienInvaders = [];
let shooterPosition = 229;
let results = 0;

function createGridAliens(){

    let indexAttr = 0;

    // boucle for pour créer la grille
    for (i = 0; i < 240; i++) {
        if (indexAttr === 0) {
            // le premier de la ligne a l'attribut
            const bloc = document.createElement('div');
            bloc.setAttribute('data-left', 'true');
            container.appendChild(bloc);
            indexAttr++;
        } else if (indexAttr === 19) {
            // au dernier de la ligne recommencer en dessous
            const bloc = document.createElement('div');
            bloc.setAttribute('data-right', 'true');
            container.appendChild(bloc);
            indexAttr = 0;
        } else {
            // ceux du milieu de la ligne
            const bloc = document.createElement('div');
            container.appendChild(bloc);
            indexAttr++;
        }
    }

    // boucle for pour créer les aliens dans la grille
    for (i = 1; i < 53; i++) {
        if (i === 13) {
            // passer à la seconde ligne
            i = 21;
            alienInvaders.push(i);
        } else if (i === 33) {
            // passer à la troisième ligne
            i = 41;
            alienInvaders.push(i);
        } else {
            // aliens sur une ligne
            alienInvaders.push(i);
        }
    }

    // ajouter le style aux aliens
    allDivs = document.querySelectorAll('.grid div');

    alienInvaders.forEach(invader => {
        // les divs simples du tableau sont remplacées par les aliens
        allDivs[invader].classList.add('alien');
    })

    // positionner le tireur (229 = milieu, centré) et le définir avec la class shooter
    allDivs[shooterPosition].classList.add('shooter');
}

// faire démarrer le jeu
startButton.addEventListener('click', function() {
    createGridAliens();
    startButton.style.display = 'none';
    music.play();
});




// faire bouger le tireur en appuyant sur les flèches directionnelles
function moveShooter(e){
    // on supprime le tireur
    allDivs[shooterPosition].classList.remove('shooter');

    // on le fait bouger
    // si j'appuie sur 37 = flèche directionnelle gauche
    if (e.keyCode === 37) {
        // et si la position de mon tireur est > 220 (le bord gauche)
        if (shooterPosition > 220) {
            // alors je peux le déplacer vers la gauche
            shooterPosition -= 1;
        }
    }
    // même chose pour la droite
    if (e.keyCode === 39) {
        if (shooterPosition < 239) {
            shooterPosition +=1;
        }
    }

    // une fois déplacé, on redessine le tireur
    allDivs[shooterPosition].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);




// faire bouger les aliens automatiquement
let goDownRight = true;
let goDownLeft = true;
let direction = 1;

function moveAliens(){

    // les faire changer de ligne en arrivant aux bords
    for (let i = 0; i < alienInvaders.length; i++) {

        // pour le bord droit
        // si l'attribut de la div de l'alien en cours est égal à l'arrivée au bord
        if (allDivs[alienInvaders[i]].getAttribute('data-right') === 'true') {
            // et si la variable est true (là oui car elle est déclarée true)
            
            if (goDownRight) {
                // alors descente de 20 = la longeur d'une ligne
                direction = 20;
                // pour arrêter automatiquement la boucle for
                setTimeout(() => {
                    goDownRight = false;
                }, 50);
            } 
            // si la variable est à false, repartir en sens inverse avec -1
            else if (goDownRight === false) {
                direction = -1;
            }
        } 

        // pour le bord gauche
        else if (allDivs[alienInvaders[i]].getAttribute('data-left') === 'true') {
            if (goDownLeft) {
                direction = 20;
                setTimeout(() => {
                    goDownLeft = false;
                }, 50);
            } 
            else if (goDownLeft === false) {
                direction = 1;
            }
        }
    }

    // les faire bouger de gauche à droite avec 3 boucles for
    // même chose que pour le tireur : faire disparaître, faire bouger, faire réapparaître
    for (let i = 0; i < alienInvaders.length; i++) {
        allDivs[alienInvaders[i]].classList.remove('alien');
    }
    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }
    for (let i = 0; i < alienInvaders.length; i++) {
        allDivs[alienInvaders[i]].classList.add('alien');
    }

    // réinitialiser les variables de départ
    if (direction === 1) {
        goDownRight = true;
        goDownLeft = false;
    } else {
        goDownRight = false;
        goDownLeft = true;
    }

    // en cas de victoire des aliens s'ils touchent le vaisseau
    if (allDivs[shooterPosition].classList.contains('alien', 'shooter')) {
        resultVar.textContent = 'Nooooon, les aliens nous envahissent !';
        allDivs[shooterPosition].classList.add('boom');
        clearInterval(invaderId);  
        restartButton.style.display = "block"; 
        music.pause();
        looseSound.play();
    }

    // en cas de victoire des aliens s'ils dépassent le vaisseau
    for (let i = 0; i < alienInvaders.length; i++) {
        if (alien[i] > allDivs.length - 20) {
            resultVar.textContent = 'Nooooon, les aliens nous envahissent !';
            clearInterval(invaderId);
            restartButton.style.display = "block";
            music.pause();
            looseSound.play();
        }
    }
}

// stocker l'interval dans une variable pour pouvoir l'annuler ensuite
// rapidité des aliens
invaderId = setInterval(moveAliens, 400);




// le laser déclanché à la barre d'espace
document.addEventListener('keyup', shoot)

function shoot (e) {

    let laserId;
    // celui que l'on tire actuellement, donc lié à la position du tireur
    let laserActual = shooterPosition;

    function movingLaser(){
        // même technique de suppression, bouger, réapparition
        allDivs[laserActual].classList.remove('laser');
        laserActual -= 20;
        allDivs[laserActual].classList.add('laser');

        // détecter les collisions
        // si le laser est sur une div qui contient la class alien
        if (allDivs[laserActual].classList.contains('alien')) {
            // il arrête d'être un laser et un alien pour devenir boom
            allDivs[laserActual].classList.remove('laser');
            allDivs[laserActual].classList.remove('alien');
            allDivs[laserActual].classList.add('boom');
        
            // updater le tableau pour enlever les aliens disparus
            // le tableau retourné est celui qui a passé le filtre en étant différent de laser en cours
            alienInvaders = alienInvaders.filter(el => el !== laserActual);
            
            // enlever la class boom au bout de 250ms
            setTimeout(() => {
                allDivs[laserActual].classList.remove('boom');
            }, 250)

            clearInterval(laserId);

            // mettre à jour la variable de résultat à chaque alien tué
            results++;
            // condition en cas de victoire (36 aliens totaux)
            if (results === 36) {
                resultVar.textContent = 'Bravo! Grâce à toi, nous ne sommes pas envahis (cette fois-ci...)';
                clearInterval(invaderId);
                restartButton.style.display = "block";
                music.pause();
                winSound.play();
            } else {
                resultVar.textContent = `Score : ${results}`;
            }
        }

        // supprimer les laser qui dépassent le cadre pour ne pas faire buguer la page
        // si on arrive en haut (20)
        if (laserActual < 20) {
            // au bout de 100 ms, la class laser est enlevée à la div
            clearInterval(laserId);
            setTimeout(() => {
                allDivs[laserActual].classList.remove('laser');
            }, 100)
        }
    }

    // si la barre d'espace est appuyée, le tir est lancé depuis la position de la fusée
    if(e.keyCode === 32) {
        laserId = setInterval(() => {
            movingLaser();
        }, 100);
    }
}