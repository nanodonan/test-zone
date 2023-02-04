/**@type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas01")
const ctx = canvas.getContext("2d")

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 500

let placar = 16

let posAux = -1

const board = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 1, 1],
  [1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1],
  [0, 1, 1, 1, 0]
]

let square = [
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1]
]

let circle = [
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0]
]

/**
 * Classes
 */

class Quadrado {
  constructor({ x, y }) {
    this.x = x
    this.y = y
  }
  draw() {
    ctx.fillStyle = "black"
    ctx.strokeRect(this.x, this.y, 200, 100)
  }
}

class Bolinha {
  constructor({ x, y, tam, color }) {
    this.x = x
    this.y = y
    this.tam = tam
    this.color = color
  }
  draw() {
    ctx.fillStyle = this.color || "purple"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.tam, 0, 2 * Math.PI)
    ctx.fill()
  }
}


/**
 * Methods / functions
 */

const mostraGrid = ({ i, j, tile }) => {
  const quadrado = new Quadrado({
    x: j * tile,
    y: i * tile,
  })
  quadrado.draw()
}

const desenhaPino = ({ i, j, tile }) => {

  const colorsByNum = {
    0: "grey",
    1: "purple",
    2: "red"
  }

  const selectedColor = colorsByNum[board[i][j]]

  const pino = new Bolinha({
    x: j * tile + tile / 2,
    y: i * tile + tile / 2,
    tam: tile / 3,
    color: selectedColor
  })

  // bolinha roxa em cruz
  if (board[i][j] !== 0) {
    pino.draw()
  }
}

const desenharPecas = () => {
  const cols = board[0].length
  const tile = CANVAS_WIDTH / cols

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {

      // mostraGrid({ i, j, tile })

      desenhaPino({ i, j, tile })
    }
  }
}

const desenharTabuleiro = () => {
  const cols = square[0].length
  const tile = CANVAS_WIDTH / cols
  for (let i = 0; i < square.length; i++) {
    for (let j = 0; j < square[i].length; j++) {
      if (square[i][j] === 0) {
        const cor = "grey"
        const tabuleiro = new Bolinha({
          x: j * tile + tile / 2,
          y: i * tile + tile / 2,
          tam: tile / 5,
          color: cor
        })
        tabuleiro.draw()
      }
    }
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
}

function pegaPosicaoClicada(pos) {
  let resultadoX = -1
  let resultadoY = -1

  const range = {
    0: [0, 100],
    1: [100, 200],
    2: [200, 300],
    3: [300, 400],
    4: [400, 500]
  }
  for (const key of Object.keys(range)) {
    const min = range[key][0]
    const max = range[key][1]
    if (pos.y > min && pos.y < max) {
      resultadoX = key
    }
    if (pos.x > min && pos.x < max) {
      resultadoY = key
    }
  }

  return { x: resultadoX, y: resultadoY }
}

const atualizaPlacar = (pos = {}) => {
  let i = pos.x
  let j = pos.y
  if (i != undefined && j != undefined) {
    if (board[i][j] === 1) {
      placar -= 1
    }
  }
  document.getElementById("placar01").innerHTML = placar
}

const limpaCanvas = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  //desenharTabuleiro()
}
//X é linha Y é coluna 
let lastPos = { x: -1, y: -1 }
let listaClicks = []

const podeClicar = (pos = {}) => {
  if (lastPos.x === -1 || lastPos.y === -1) return false
  const distY = Math.abs(pos.x - lastPos.x)
  const distX = Math.abs(pos.y - lastPos.y)
  if (distX === 2 && distY === 2) return false

  const posFinalValida = board[pos.x][pos.y] === 0

  const posMeio = getPosMeio({ lastPos, posClicada: pos })
  console.log('POS MEIO', posMeio, verificaPosTemPeca(posMeio))

  const posMeioValida = verificaPosTemPeca(posMeio)

  // posicao final ta vazia
  if (posFinalValida && posMeioValida) {
    // eh um movimento valido
    if (distX === 2 && distY === 0) return true
    if (distY === 2 && distX === 0) return true
  }

  return false
}

const getPosMeio = ({ lastPos, posClicada }) => {
  const posInicio = { x: Number(lastPos.x), y: Number(lastPos.y) };
  const posFim = { x: Number(posClicada.x), y: Number(posClicada.y) };
  let posMeio = {}

  // mesma linha
  if (posInicio.x === posFim.x) {
    //direita
    if (posFim.y > posInicio.y) {
      posMeio = { x: posInicio.x, y: posFim.y - 1 }
    }
    // esquerda
    if (posFim.y < posInicio.y) {
      posMeio = { x: posInicio.x, y: posInicio.y - 1 }
    }
  }

  // mesma coluna
  if (posInicio.y === posFim.y) {
    // baixo
    if (posFim.x > posInicio.x) {
      posMeio = { x: posFim.x - 1, y: posInicio.y }
    }
    // cima
    if (posFim.x < posInicio.x) {
      posMeio = { x: posInicio.x - 1, y: posInicio.y }
    }
  }

  return posMeio;
}


const verificaPosTemPeca = (pos) => {
  if (!pos.hasOwnProperty('x')) {
    return false
  }
  return board[pos.x][pos.y] === 1
}

function primeiroClickInvalido(posClicada) {
  const isPrimeiraJogada = listaClicks.length === 1
  const posAtualVazia = board[posClicada.x][posClicada.y] === 0
  return isPrimeiraJogada && posAtualVazia
}

window.addEventListener("click", (e) => {
  if (e) {
    let pos = getMousePos(canvas, e)
    let posClicada = pegaPosicaoClicada(pos)

    listaClicks.push({
      l: posClicada.x,
      c: posClicada.y
    })
    const pode = podeClicar(posClicada)

    if (primeiroClickInvalido(posClicada)) {
      listaClicks = []
      return
    }
    
    // guarda valor antes da seleção
    posAux = board[posClicada.x][posClicada.y]
    
    // seleciona peça
    board[posClicada.x][posClicada.y] = 2

    if (pode) {
      const posMeio = getPosMeio({ lastPos, posClicada })

      // remove da ultima posicao
      board[lastPos.x][lastPos.y] = 0

      // remove do meio
      board[posMeio.x][posMeio.y] = 0

      board[posClicada.x][posClicada.y] = 1

      listaClicks = []
    }

    if (listaClicks.length === 2 && !pode) {
      setTimeout(() => {
        let item = listaClicks[0]
        let item2 = listaClicks[1]
        
        board[item.l][item.c] = 1 // purple
        if(posAux === 1){
          board[item2.l][item2.c] = 1
        }else if (posAux === 0){
          board[item2.l][item2.c] = 0
        }
        listaClicks = []

        // clear   
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        desenharTabuleiro()
        desenharPecas()

        lastPos = { x: -1, y: -1 }
      }, 2000)
    }

    lastPos = posClicada

    // clear   
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    desenharTabuleiro()
    desenharPecas()
  }
})


function main() {

  try {
    // start
    desenharTabuleiro()
    desenharPecas()

    // atualizaPlacar()
  } catch (err) {
    console.error("Deu Merda:", err)
  }
}
main()

