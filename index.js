/**@type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas01")
const ctx = canvas.getContext("2d")

const gameOverElement = document.querySelector(".game-over")
const restartBtnElement = document.querySelector(".restartBtn")

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 500

let itensRestantes = 4

let posAux = -1

let gameOver = false

const board2 = [
  [3, 1, 1, 1, 3],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1],
  [3, 1, 1, 1, 3]
]
let board = [
  [3, 1, 0, 0, 3],
  [0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [3, 0, 0, 0, 3]
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
  if ((board[i][j] !== 3) && (board[i][j] !== 0)) {
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

const atualizaPlacar = () => {
  document.getElementById("placar01").innerHTML = itensRestantes
}

const limpaCanvas = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  //desenharTabuleiro()
}
//X ?? linha Y ?? coluna 
let lastPos = { x: -1, y: -1 }
let listaClicks = []

const podeFazerJogada = (pos = {}) => {
  if (lastPos.x === -1 || lastPos.y === -1) return false
  const distY = Math.abs(pos.x - lastPos.x)
  const distX = Math.abs(pos.y - lastPos.y)
  if (distX === 2 && distY === 2) return false

  const posFinalValida = (board[pos.x][pos.y] === 0) && (board[pos.x][pos.y] !== 3)

  const posMeio = getPosMeio({ lastPos, posClicada: pos })

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

function isValidClick(posClicada) {

  //verifica click em posi????o invalida fora do tabuleiro
  if (posClicada.x === -1 || posClicada.y === -1) return false

  //verifica click em posi????o invalida dentro do tabuleiro
  if (board[posClicada.x][posClicada.y] === 3) return false



  return true
}


window.addEventListener("click", (e) => {
  if (e) {
    let pos = getMousePos(canvas, e)
    let posClicada = pegaPosicaoClicada(pos)

    if (!isValidClick(posClicada)) return

    listaClicks.push({
      l: posClicada.x,
      c: posClicada.y
    })

    if (listaClicks.length >= 3) return

    const pode = podeFazerJogada(posClicada)


    if (primeiroClickInvalido(posClicada)) {
      listaClicks = []
      return
    }

    // guarda valor antes da sele????o
    posAux = board[posClicada.x][posClicada.y]

    // seleciona pe??a
    board[posClicada.x][posClicada.y] = 2

    if (pode) {
      const posMeio = getPosMeio({ lastPos, posClicada })

      // remove da ultima posicao
      board[lastPos.x][lastPos.y] = 0

      // remove do meio
      board[posMeio.x][posMeio.y] = 0

      board[posClicada.x][posClicada.y] = 1

      listaClicks = []
      itensRestantes--
      const aindaPodeJogar = verificaPossivelJogada()

      if (!aindaPodeJogar) {
        if (itensRestantes === 1) {
          gameOverElement.textContent = "WINNER"
          gameOverElement.classList.add('win')
        } else {
          gameOver = true
          gameOverElement.textContent = "GAME OVER"
        }
        restartBtnElement.style.display = 'flex'
      }
    }

    if (listaClicks.length === 2 && !pode) {
      setTimeout(() => {
        let item = listaClicks[0]
        let item2 = listaClicks[1]

        board[item.l][item.c] = 1 // purple
        if (posAux === 1) {
          board[item2.l][item2.c] = 1
        } else if (posAux === 0) {
          board[item2.l][item2.c] = 0//verificar esquerda
          //verificar cima
          //verificar baixo

        }
        else if (posAux === 3) {
          board[item2.l][item2.c] = 3

        }
        listaClicks = []

        // clear   
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        desenharTabuleiro()
        desenharPecas()
        atualizaPlacar()

        lastPos = { x: -1, y: -1 }
      }, 2000)
    }

    lastPos = posClicada

    // clear   
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    desenharTabuleiro()
    desenharPecas()
    atualizaPlacar()
    //verificaPossivelJogada()
  }
})


function verificaJogadaPorPeca(pos = {}) {
  //Direita
  if (pos.c < 3) {
    if (board[pos.l][pos.c + 2] === 0) {
      if (board[pos.l][pos.c + 1] === 1) {
        return true
      }
    }
  }
  //Esquerda
  if (pos.c > 1) {
    if (board[pos.l][pos.c - 2] === 0) {
      if (board[pos.l][pos.c - 1] === 1) {
        return true
      }
    }
  }
  //Cima
  if (pos.l > 1) {
    if (board[pos.l - 2][pos.c] === 0) {
      if (board[pos.l - 1][pos.c] === 1) {
        return true
      }
    }
  }
  //Baixo
  if (pos.l < 3) {
    if (board[pos.l + 2][pos.c] === 0) {
      if (board[pos.l + 1][pos.c] === 1) {
        return true
      }
    }
  }
  return false
}

function verificaPossivelJogada() {
  let aindaPodeJogar = false
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 1 || board[i][j] === 2) {
        aindaPodeJogar = verificaJogadaPorPeca({ l: i, c: j })
        if (aindaPodeJogar) break
      }
    }
    if (aindaPodeJogar) break
  }
  return aindaPodeJogar
}

function restart() {
  window.location.reload()

  // board = [...board2]
  // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // desenharTabuleiro()
  // desenharPecas()
  // itensRestantes = 20
  // atualizaPlacar()
  //location.reload()

}


function main() {
  try {

    // start
    desenharTabuleiro()
    desenharPecas()
    atualizaPlacar()

    // atualizaPlacar()
  } catch (err) {
    console.error("Deu Merda:", err)
  }
}
main()

