/**@type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas01")
const ctx = canvas.getContext("2d")

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 500

let placar = 16

const board = [
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
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
  const cor = board[i][j] === 1 ? "purple" : "red"

  const pino = new Bolinha({
    x: j * tile + tile / 2,
    y: i * tile + tile / 2,
    tam: tile / 3,
    color: cor
  })

  // bolinha roxa
  if (board[i][j] !== 0) {
    pino.draw()
  }
}

const desenharMatriz = () => {
  const cols = board[0].length
  const tile = CANVAS_WIDTH / cols

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {

      // mostraGrid({ i, j, tile })

      desenhaPino({ i, j, tile, cor: { asdf: true } })
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

  if (board[pos.x][pos.y] === 0) {
    if (distX === 2 && distY === 0) return true
    if (distY === 2 && distX === 0) return true
  }

  return false
}

window.addEventListener("click", (e) => {
  if (e) {
    let pos = getMousePos(canvas, e)
    let posClicada = pegaPosicaoClicada(pos)
    listaClicks.push(posClicada)
    console.log('listaClicks', listaClicks)

    const pode = podeClicar(posClicada)
    console.log("PodeClicar: ", pode)

    // seleciona peça
    board[posClicada.x][posClicada.y] = 2

    if (pode) {
      // remove da ultima posicao
      board[lastPos.x][lastPos.y] = 0

      board[posClicada.x][posClicada.y] = 1

      listaClicks = []
    }

    //console.log("lista clicks: ", listaClicks)

    if (listaClicks.length === 2 && !pode) {
      setTimeout(() => {
        listaClicks.forEach((item) => {
          board[item.x][item.y] = 1 // purple
        })
        listaClicks = []
        desenharMatriz()

        lastPos = { x: -1, y: -1 }
      }, 2000)
    }

    lastPos = posClicada

    // clear   
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    desenharTabuleiro()
    desenharMatriz()
  }
})


function main() {

  try {
    // start
    desenharTabuleiro()
    desenharMatriz()

    // atualizaPlacar()
  } catch (err) {
    console.error("Deu Merda:", err)
  }
}
main()

