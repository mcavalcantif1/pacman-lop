/* ------------------------------LABIRINTO ------------------------------------
   Define os pontos na matriz 2D onde cada elemento serÃ¡ exibido inicialmente 
   0: BARREIRAS (paredes vermelhas, que delimitam o jogo) 
   1: COMIDA (bolinhas brancas que sÃ£o comidas pelo Pac-Man)
   2: OPEN
   3: CEREJA (cereja que rende 20 pontos ao Pac-Man)
   4: FANTASMAS (inimigos do Pac-Man)
   5: PACMAN
  ------------------------------------------------------------------------------
*/
const LABIRINTO = [
  "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
  "0,3,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,3,0",
  "0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0",
  "0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0",
  "0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0",
  "0,1,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1,0",
  "0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0",
  "0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0",
  "0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0",
  "0,3,0,0,1,1,0,1,0,0,0,1,0,0,1,1,0,0,1,0",
  "0,1,0,0,1,1,0,1,0,4,3,1,1,0,1,1,0,0,3,0",
  "0,1,1,1,1,1,1,1,0,1,1,3,1,0,1,1,1,1,1,0",
  "0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,1,0,0,1,0",
  "0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0",
  "0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0",
  "0,1,1,1,1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,0",
  "0,1,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,1,0",
  "0,1,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,1,0",
  "0,3,5,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,3,0",
  "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
];

var labirinto = [];
var fantasmas = [];

var pacman;
// VariÃ¡vel que contabiliza os pontos
var pontos; 
// VariÃ¡vel responsÃ¡vel por armazenar a pontuaÃ§Ã£o final
var pontosfinais;

function setup() {
  // CriaÃ§Ã£o do canvas onde serÃ¡ exibido o jogo
  createCanvas(500, 535);
  // InicializaÃ§Ã£o do contador dos pontos
  pontos = 0;
  // Chamada da funÃ§Ã£o responsÃ¡vel por exibir o labirinto
  labirinto = construirLabirinto();
}

function draw() {
  // Preenche o plano de fundo com a cor preta
  background(0);

	drawHUD(); // field & pontos

	// Atualiza a quantidade de fantasmas definidos e os exibe na tela
  for (var j = 0; j < fantasmas.length; j++) {
    fantasmas[j].update();
    fantasmas[j].draw();
  }

	//Atualiza a posiÃ§Ã£o do Pac-Man e o exibe na tela 
	pacman.update();
	pacman.draw();
  // Chama a funÃ§Ã£o para verificar quais setas estÃ£o sendo pressionadas no teclado e mudar o posicionamento do Pac-Man
  handleInput(); 
}

/**
 *	handles user input
 */
function handleInput() {
  // Se a seta para cima Ã© pressionada, o Pac-Man irÃ¡ se mover em uma posiÃ§Ã£o para cima 
  if (keyIsDown(UP_ARROW)) {
    pacman.move(0, -1, true);
  // Se a seta para baixo Ã© pressionada, o Pac-Man irÃ¡ se mover em uma posiÃ§Ã£o para baixo   
  } else if (keyIsDown(DOWN_ARROW)) {
    pacman.move(0, 1, true);
  // Se a seta para esquerda Ã© pressionada, o Pac-Man irÃ¡ se mover em uma posiÃ§Ã£o para a esquerda   
  } else if (keyIsDown(LEFT_ARROW)) {
    pacman.move(-1, 0, true);
  // Se a seta para direita Ã© pressionada, o Pac-Man irÃ¡ se mover em uma posiÃ§Ã£o para a direita
  } else if (keyIsDown(RIGHT_ARROW)) {
    pacman.move(1, 0, true);
  }
}

//FunÃ§Ã£o responsÃ¡vel por desenhar todos os elementos do jogo menos os fantasmas e o Pac-Man
function drawHUD() {

	// Percorre o tamanho do labirinto e verifica se o elemento Ã© diferente do fantasma e pacman
  // Se for desenha o elemento que foi informado para aquela posiÃ§Ã£o do vetor
	for (var i = 0; i < labirinto.length; i++) {
		if (labirinto[i].intact) {
			if (labirinto[i].tipo != "FANTASMA" && labirinto[i].tipo != "PACMAN")
				labirinto[i].draw();
		}
	}

}

//FunÃ§Ã£o responsÃ¡vel por gerar o labirinto
function construirLabirinto() {
  // Vetor que serÃ¡ retornado no final
  var f = []; 
  // Identifica o fantasma em questÃ£o
  var idFantasma = 0; 

  // Percorre o tamanho do labirinto
  for (var i = 0; i < LABIRINTO.length; i++) { 
    // Declara a variÃ¡vel linha como o valor separado por vÃ­rgula
    var row = LABIRINTO[i].split(",");
    // Para cada coluna percorrida serÃ¡ identificado o tipo de acordo com os elementos do jogo
    for (var j = 0; j < row.length; j++) { 
      var tipo = TIPOS[row[j]];
      // O elemento serÃ¡ identificado pelo seu posicionamento nos eixos i e j, bem como pelo seu tipo
      var tile = new Tile(j, i, tipo, -1);

      // Para lidar com as 
      switch (tipo) {
        // Caso o elemento seja o Pac-Man ele serÃ¡ identificado por "pacman"
        case "PACMAN":
          pacman = tile;
          // O valor serÃ¡ adicionado ao vetor responsÃ¡vel por gerar o labirinto
          f.push(new Tile(j, i, "OPEN"));
          break;
        // Caso seja um fantasma 
        case "FANTASMA":
          // Define a agressividade do fantasma, se ele serÃ¡ mais ativo ou passivo
					var comportamento = (idFantasma % 2); 
          // Adiciona o fantasma ao labirinto
          fantasmas.push(new Tile(j, i, tipo, comportamento));
          f.push(new Tile(j, i, "OPEN"));
          // Incrementa o id do fantasma
          idFantasma++;
          break;

        //Caso seja uma barreira, simplesmente a adiciona ao campo
        case "BARREIRA":
          f.push(tile);
          break;

        // Se for uma cereja, a adiciona ao campo e incrementa 20 pontos a sua pontuaÃ§Ã£o, de modo a calcular a pontuaÃ§Ã£o mÃ¡xima final  
        case "CEREJA":
          pontosfinais += 20; 
          f.push(tile);
          break;

        // Caso seja a comida, a adiciona ao campo e incrementa em 1 a sua pontuaÃ§Ã£o 
        case "COMIDA":
          pontosfinais++; // worth 1 point
          f.push(tile);
          break;
      }

    }
  }
  // Por fim retorna o vetor com todos os elementos
  return f;
}

/* ----------------------------- ESPECIFICAÃ‡Ã•ES DOS ELEMENTOS E POSICIONAMENTOS --------------------------- */

// Define os tipos dos elementos que poderÃ£o ser encontrados no jogo
const TIPOS = [
  "BARREIRA",
  "COMIDA",
  "OPEN",
  "CEREJA",
  "FANTASMA",
  "PACMAN"
];


// Especifica a velocidade dos elementos que se movem no jogo
const TILE_SPEED = 0.2; 

// DimensÃµes do labirinto 20x20
const DIMENSOES = 20; 

// Tamanho de cada elemento
const TAMANHO = 25; 
const METADE_TAMANHO = TAMANHO / 2;
const UMTERCO_TAMANHO = TAMANHO / 3;
const UMQUARTO_TAMANHO = TAMANHO / 4;


// FunÃ§Ã£o responsÃ¡vel por lidar com as movimentaÃ§Ãµes no jogo e outras especificaÃ§Ãµes
function Tile(x, y, tipo, comportamento) {

  // InicializaÃ§Ã£o dos objetos
  this.x = x;
  this.y = y;
  this.tipo = tipo;

  this.destination = (-1, -1);
  this.moving = false;

  this.intact = true;

  this.speed = 0.2;

  this.comportamento = comportamento; 
}



Tile.prototype.update = function() {

  // Se ainda nÃ£o houver se movido a funÃ§Ã£o nÃ£o retornarÃ¡ nada
  if (!this.intact) 
    return;

  // Se o fantasma estiver se movendo
  if (this.moving) {

    // Passa dentro da funÃ§Ã£o de movimentaÃ§Ã£o a posiÃ§Ã£o atual, a posiÃ§Ã£o desejada e a velocidade
    this.x = lerp(this.x, this.destination.x, this.speed);
    this.y = lerp(this.y, this.destination.y, this.speed);

    // Calcula a distÃ¢ncia entre os fantasmas e o pacman
    var distanceX = Math.abs(this.x - this.destination.x);
    var distanceY = Math.abs(this.y - this.destination.y);

    // Se a distÃ¢ncia for menor do que 0.1, arredonda a posiÃ§Ã£o 
    if (distanceX < 0.1 && distanceY < 0.1) { 
      this.x = this.destination.x;
      this.y = this.destination.y;

      // Finaliza o movimento
      this.moving = false; 
    }
  }

  // Se o tipo do elemento for o pacman
  if (this.tipo == "PACMAN") { 

    // Calcula qual serÃ¡ a posiÃ§Ã£o do elemento para o qual o pacman se move
    var destinationTile = getTile(Math.floor(this.x), Math.floor(this.y));

    if (destinationTile.intact) {
      // Verifica o tipo do elemento
      switch (destinationTile.tipo) {
        // Se for comida, incrementa a pontuaÃ§Ã£o em 1 ponto
        case "COMIDA":
          pontos++; 
          // Altera o estado do elemento, de modo que ele desapareÃ§a
          destinationTile.intact = false;
          break;

        // Caso seja a cereja
        case "CEREJA":
          // Incrementa a pontuaÃ§Ã£o em 20
          pontos += 10; 
          // Altera o estado do elemento
          destinationTile.intact = false;
          break;
      }
    }

  

  // SenÃ£o, verifica se o tipo do elemento Ã© fantasma     
  } else if (this.tipo == "FANTASMA") {
    
    // Deixa sua velocidade um pouco mais lenta do que a do Pac-Man
    this.speed = 0.1;
    // Calcula a distÃ¢ncia entre ele e o pacman
    var distance = dist(pacman.x, pacman.y, this.x, this.y);
    // Se a distÃ¢ncia for menor do que 0.3, o Pac-Man foi tocado pelo fantasma e morreu
    if (distance < 0.3) 
      // Chama a funÃ§Ã£o de fim de jogo e informa false porque o jogador perdeu
      endGame(false);
    // Caso esteja se movendo retorna vazio para impedir de realizar outros movimentos ao mesmo tempo
    if (this.moving) 
      return;

    // Movimentos possÃ­veis
    var possibleMoves = [
      getTile(this.x - 1, this.y),  // Movimenta para esquerda
      getTile(this.x + 1, this.y),  // Movimenta para a direita
      getTile(this.x, this.y - 1),  // Movimenta para cima
      getTile(this.x, this.y + 1),  // Movimenta para baixo
    ];

    // Verifica as movimentaÃ§Ãµes possÃ­veis com base na distÃ¢ncia 
    possibleMoves.sort(function (a, b) {
      var aD = dist(a.x, a.y, pacman.x, pacman.y);
      var bD = dist(b.x, b.y, pacman.x, pacman.y);
      return aD - bD;
    });


  }
};

// FunÃ§Ã£o responsÃ¡vel por especificar o tamanho, cor e forma de cada um dos elementos do jogo
Tile.prototype.draw = function() {

  switch (this.tipo) {

    case "BARREIRA":
      strokeWeight(5);
      stroke(0);
      fill("#120A8F");
      rect(this.x * TAMANHO, this.y * TAMANHO, TAMANHO, TAMANHO);
      break;

    case "COMIDA":
      ellipseMode(CORNER);
      noStroke();
      fill(199);
      ellipse(this.x * TAMANHO + UMTERCO_TAMANHO, this.y * TAMANHO + UMTERCO_TAMANHO, UMTERCO_TAMANHO);
      break;

    case "CEREJA":
      ellipseMode(CORNER);
      noStroke();
      fill("#993399");
      ellipse(this.x * TAMANHO + UMQUARTO_TAMANHO, this.y * TAMANHO + UMQUARTO_TAMANHO, METADE_TAMANHO);
      break;

    case "FANTASMA":
      fill("#FF0000");
      stroke(0);
      strokeWeight(1);

      beginShape();
      vertex(this.x * TAMANHO + METADE_TAMANHO, this.y * TAMANHO + UMQUARTO_TAMANHO);
      vertex(this.x * TAMANHO + UMQUARTO_TAMANHO, this.y * TAMANHO + (UMQUARTO_TAMANHO * 3));
      vertex(this.x * TAMANHO + (UMQUARTO_TAMANHO * 3), this.y * TAMANHO + (UMQUARTO_TAMANHO * 3));
      endShape(CLOSE);
      break;

    case "PACMAN":

      ellipseMode(CORNER);
      stroke("#FFFF00");
      strokeWeight(5);
      fill("#FFFF33");
      ellipse(this.x * TAMANHO + UMQUARTO_TAMANHO, this.y * TAMANHO + UMQUARTO_TAMANHO, METADE_TAMANHO);
      break;

  }

};


// FunÃ§Ã£o responsÃ¡vel por verificar se a movimentaÃ§Ã£o desejada Ã© vÃ¡lida ou nÃ£o

Tile.prototype.move = function(x, y, relative) {

  var destinationX, destinationY;

  if (relative) {

    destinationX = this.x + x;
    destinationY = this.y + y;
  } else {

    destinationX = x;
    destinationY = y;
  }

  if (this.moving) 
    return false;

  var destinationTile = getTile(destinationX, destinationY);

  var tipo = destinationTile.tipo;

  if ((tipo == "BARREIRA" && this.tipo != "BARREIRA") ||  // Barreiras nÃ£o podem se mover
      (tipo == "FANTASMA" && this.tipo == "FANTASMA"))    // Move os fantasmas
    return false;

  this.moving = true; // ComeÃ§a o movimento e atualiza na tela a posiÃ§Ã£o
  this.destination = createVector(destinationX, destinationY);

  return true;
};


// FunÃ§Ã£o responsÃ¡vel por retornar as coordenadas em x e y
function getTile(x, y) {

  return labirinto[y * DIMENSOES + x];
}