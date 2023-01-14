
/*



/*
let offset_x
let offset_y

let get_offset = ()=>{
 let canvas_offsets = canvas.getBoundingClientRect()
 offset_x = canvas_offsets.left
 offset_y = canvas_offsets.top

}

get_offset()
window.onscroll = ()=>{ get_offset()}
window.onresize = ()=>{get_offset()}
canvas.onresize = ()=>{get_offset()}

let shapes = []const atualizaPlacar = ()=>{
 for (let i = 0; i < circle.length; i++) {
   for (let j = 0; j < circle[i].length; j++) {
     if(circle[i][j] === 1){
       teste += 1
     }
     
   }
   
 }
 document.getElementById("placar01").innerHTML = teste
}
shapes.push({ x: 150, y: 300, width: 100, height: 100, color: "red" })
//shapes.push({ x: 400, y: 200, width: 100, height: 100, color: "blue" })
let current_shape_index = null
let is_dragging = false
let startX
let startY

let is_mouse_in_shape = (x, y, shape) => {
 let shape_left = shape.x
 let shape_right = shape.x + shape.width
 let shape_top = shape.y
 let shape_bottom = shape.y + shape.height

 if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
   return true
 }
 return false
}

let mouse_down = (event) => {
 event.preventDefault()
 startX = parseInt(event.clientX - offset_x)
 startY = parseInt(event.clientY - offset_y)
 let i = 0
 for (let shape of shapes) {
   if (is_mouse_in_shape(startX, startY, shape)) {
     current_shape_index = i
     is_dragging = true
     return
   } else {

   }
   i++
 }
}

let mouse_up = (event) => {
 if (!is_dragging) {
   return
 }
 event.preventDefault()
 is_dragging = false
}


let mouse_out = (event) => {
 if (!is_dragging) {
   return
 }
 event.preventDefault()
 is_dragging = false
}

let mouse_move = (event) => {
 if (!is_dragging) {
   return
 } else {
   event.preventDefault()
   let mouseX = parseInt(event.clientX - offset_x)
   let mouseY = parseInt(event.clientY - offset_y)

   let dx = mouseX - startX
   let dy = mouseY - startY

   let current_shape = shapes[current_shape_index]
   current_shape.x += dx
   current_shape.y += dy

   draw_shapes()

   startX = mouseX
   startY = mouseY

 }

}

canvas.onmousedown = mouse_down
canvas.onmouseup = mouse_up
canvas.onmouseout = mouse_out
canvas.onmousemove = mouse_move
canvas.onmousedown = mouse_down



let draw_shapes = () => {
 ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
 for (let shape of shapes) {
   ctx.fillStyle = shape.color
   ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
 }
}
draw_shapes()

*/

/* 



const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")


const canvas2 = document.getElementById("canvas2")
const ctx2 = canvas2.getContext("2d")

const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600

const tabuleiro = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

const pontosX = [70, 250, 430]
const pontosY = [70, 250, 430]

let jogador = 2
let primeiraJogada = true

function verificaVelha() {
    let deuVelha = false
    let control = 0
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 0) {
                control = -1
            }
        }
    }
    if (control === 0) {
        deuVelha = true;
    }
    return deuVelha;
}

class Bolinha {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    draw() {
        ctx.strokeStyle = "blue"
        ctx.beginPath();
        ctx.arc(this.x + 50, this.y + 50, 55, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Xis {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.length = 100
    }
    draw() {
        ctx.strokeStyle = "red"
        drawLine({ x1: this.x, y1: this.y, x2: this.x + this.length, y2: this.y + this.length })
        drawLine({ x1: this.x, y1: this.y + this.length, x2: this.x + this.length, y2: this.y })
    }
}

function drawLine(line) {
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(line.x1, line.y1)
    ctx.lineTo(line.x2, line.y2)
    ctx.stroke()
}

const linhas = [
    {
        x1: CANVAS_WIDTH / 3,
        y1: 20,
        x2: CANVAS_WIDTH / 3,
        y2: CANVAS_HEIGHT - 20
    },
    {
        x1: CANVAS_WIDTH - (CANVAS_WIDTH / 3),
        y1: 20,
        x2: CANVAS_WIDTH - (CANVAS_WIDTH / 3),
        y2: CANVAS_HEIGHT - 20
    },
    {
        x1: 20,
        y1: CANVAS_HEIGHT / 3,
        x2: CANVAS_WIDTH - 20,
        y2: CANVAS_HEIGHT / 3
    },
    {
        x1: 20,
        y1: CANVAS_HEIGHT - (CANVAS_HEIGHT / 3),
        x2: CANVAS_WIDTH - 20,
        y2: CANVAS_HEIGHT - (CANVAS_HEIGHT / 3)
    }
]


function desenhaTabuleiro() {
    ctx.strokeStyle = "black"
    //desenhando o tabuleiro
    linhas.forEach(line => { drawLine(line) })
}
desenhaTabuleiro()

window.addEventListener("click", (e) => { 
    atualizaPlacar()  
    primeiraJogada = false
    const pos = getMousePos(canvas, e)
    const posTab = pegaPosicaoClicada(pos)
    updateTabuleiro()
 //const podeJogar = verificaJogadaPermitida(posTab)
    //if (podeJogar) {
        if (jogador === 1) {
            const xis = new Xis(pontosX[posTab.y], pontosY[posTab.x])
            xis.draw()
            jogador = 2
        } else {
            const bolinha = new Bolinha(pontosX[posTab.y], pontosY[posTab.x])
            bolinha.draw()
            jogador = 1
        }
  //  }
   
    const resultado = verificaGanhador(jogador)
    if (resultado) {
        ctx2.clearRect(0, 0, 400, 200)
        ctx2.fillStyle = "black"
        ctx2.font = "bold 45px arial"
        ctx2.fillText("VENCEDOR   ", 10, 40)
        ctx2.fillText("JOGADOR:   ", 10, 100)
        if (jogador === 1) {
            ctx2.fillStyle = "red"S
            ctx2.font = "bold 60px arial"
            ctx2.fillText("X", 252, 102)
        } else {
          
            ctx2.fillStyle = "blue"
            ctx2.font = "bold 60px arial"
            ctx2.fillText("O", 252, 102)
        }
    }

   
    
})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function updateTabuleiro(pos) {
    const posTab = pegaPosicaoClicada(pos)
    if (posTab.x != -1 && posTab.y != -1) {
        if (tabuleiro[posTab.x][posTab.y] === 0) {
            tabuleiro[posTab.x][posTab.y] = jogador
        }
    }
}

function pegaPosicaoClicada(pos) {
    let resultadoX = -1
    let resultadoY = -1

    const range = {
        0: [0, 200],
        1: [200, 400],
        2: [400, 600]
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

function pegarColuna(index) {
    return tabuleiro.map(item => item[index])
}

function verificaGanhador(player = 2) {
    let resultado = false

    //verificar linha
    for (let i = 0; i < tabuleiro.length; i++) {
        const linha = tabuleiro[i];
        const ganhouLinha = linha.every((item) => item === player)
        if (ganhouLinha) {
            ctx.strokeStyle = "green"
            drawLine({ x1: 0, y1: pontosY[i] + 50, x2: CANVAS_WIDTH, y2: pontosY[i] + 50 })
            return true
        }
    }

    //verificar coluna
    for (let i = 0; i < tabuleiro[0].length; i++) {
        const coluna = pegarColuna(i)
        const ganhouColuna = coluna.every((item) => item === player)
        if (ganhouColuna) {
            ctx.strokeStyle = "green"
            drawLine({ x1: pontosX[i] + 50, y1: 0, x2: pontosX[i] + 50, y2: CANVAS_HEIGHT })
            return true
        }
    }

    //verificar diagonais
    const diagonal1 = [tabuleiro[0][0], tabuleiro[1][1], tabuleiro[2][2]]
    const diagonal2 = [tabuleiro[0][2], tabuleiro[1][1], tabuleiro[2][0]]
    const gannhouDiagonal1 = diagonal1.every(item => item === player)
    const gannhouDiagonal2 = diagonal2.every(item => item === player)

    if (gannhouDiagonal1) {
        ctx.strokeStyle = "green"
        drawLine({ x1: 0, y1: 0, x2: CANVAS_WIDTH, y2: CANVAS_HEIGHT })
        return true
    } else if (gannhouDiagonal2) {
        ctx.strokeStyle = "green"
        drawLine({ x1: CANVAS_WIDTH, y1: 0, x2: 0, y2: CANVAS_HEIGHT })
        return true
    }
    //verificar velha
    const superVelha = verificaVelha()
    if (!resultado && superVelha) {
        ctx2.clearRect(0, 0, 400, 200)
        ctx2.fillStyle = "black"
        ctx2.font = "bold 70px arial"
        ctx2.fillText("VELHA!!", 10, 100)
    } else
        return resultado
}

function reiniciar() {
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            tabuleiro[i][j] = 0
        }
    }
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    desenhaTabuleiro()
}

function atualizaPlacar() {
    ctx2.clearRect(0, 0, 400, 200)
    ctx2.fillStyle = "black"
    ctx2.font = "45px arial"
    ctx2.fillText("PRÓXIMO:   ", 5, 75)
    if (primeiraJogada) {
        ctx2.fillStyle = "blue"
        ctx2.font = "bold 60px arial"
        ctx2.fillText("O", 240, 77)
    } else if (jogador === 2) {
        ctx2.fillStyle = "red"
        ctx2.font = "bold 60px arial"
        ctx2.fillText("X", 240, 77)
    } else {
        ctx2.fillStyle = "blue"
        ctx2.font = "bold 60px arial"
        ctx2.fillText("O", 240, 77)
    }
}
atualizaPlacar()

function verificaJogadaPermitida(pos) {
    if (pos.x === -1 || pos.y === -1) {
        return false
    } else {
        if (tabuleiro[pos.x][pos.y] === 0) {
            return true
        }
        else {
            return false
        }
    }
}
*/