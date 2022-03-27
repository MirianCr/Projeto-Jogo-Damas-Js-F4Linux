function criarTabuleiro(){
    return ( '#,p,#,p,#,p,#,p,'
            +'p,#,p,#,p,#,p,#,'  
            +'#,p,#,p,#,p,#,p,' 
            +' ,#, ,#, ,#, ,#,' 
            +'#, ,#, ,#, ,#, ,' 
            +'b,#,b,#,b,#,b,#,'
            +'#,b,#,b,#,b,#,b,' 
            +'b,#,b,#,b,#,b,#').split(',')

}

//console.table(criarTabuleiro().length) //array de 64 elementos

//O método slice() retorna uma cópia de parte de um array a partir de um subarray criado entre as posições início e fim (fim não é necessário) de um array original. O Array original não é modificado.

//============================================================================================
//criar tabela a partir de um tabuleiro
function imprimirTabuleiro(tabuleiro){
    let tabela = [];


//de 8 em 8 pra colocar em vetor separado
    for(let i = 0; i < 64; i += 8){
        tabela.push(tabuleiro.slice(i, i+8));//cria copia do vetor, mas so um pedaço(fatia) do 0 ate i+8 = divide de 64 para 8 vetores de 8 posiçoes. cada linha é um vetor
    }
     console.table(tabela);
}
//console.table(imprimirTabuleiro(criarTabuleiro))



//funcao pro usuario escolher uma posição. pegar linha x coluna e transforma indice do tabuleiro // lxc=linha por coluna
function lxcParaIndex(lxc){
    if(lxc !== null){ //verifica se lxc existe
        let lc = lxc.split('x').map(Number)//vetor de 2 numeros .map = transformar de strings pra numeros ou parseint
        let l = lc[0],
            c = lc[1];

        if (0 <= l && l < 8 && 0 <= c && c < 8){
            return l * 8 + c;
        }
    }
    return null;
}

//processo inverso:indice para lxc
function indexParaLxc(index){
    if(index <0 || index >=64){
        return null;
    }

    let l = Math.floor(index/8), //linha -- floor= piso -  deixa só numero inteiro
        c = index % 8;           //coluna

    return l + 'x' + c;
}
//============================================================================================
//funcao para escolher a peça
function escolherPeça(tabuleiro, cor){
    let index;

    do{
    let lxc = prompt("Escolha a posição lxc de uma peça " + cor);
    index = lxcParaIndex(lxc);
    } while (index === null || tabuleiro[index].toLowerCase() !==cor[0])//lowercase pra letra ser minuscula caso de dama

    return index;
}
//============================================================================================
//escolher a casa vazia
function escolherLxCDestino(tabuleiro){
    let index;

    do{
        let lxc = prompt("Escolha uma casa vazia");
        index = lxcParaIndex(lxc);
    }while (index ===null || tabuleiro[index] !== ' ');

    return index;
}
//==========================================================================================
//função pra movimentar a peça
function mover(tabuleiro, indexOrigem, indexDestino){
    let peca = tabuleiro[indexOrigem];
    let diferenca = indexDestino - indexOrigem;

    if (diferenca % 7 !== 0 && diferenca % 9 !== 0){
        return {ok: false, msg:"Movimento não diagonal invalido"};
    }
    if(['p', 'b'].includes(peca)){
        return moverComum(tabuleiro, indexOrigem, indexDestino, peca, diferenca);

    }else{
        return moverDama(tabuleiro, indexOrigem, indexDestino, peca, diferenca);

    }
}
//peça comum esquerda ou direita na diagonal
function moverComum(tabuleiro, indexOrigem, indexDestino, peca, diferenca){
    let direcao = diferenca % 7 === 0 ? 7 : 9;
    let numCasas = diferenca / direcao;

    if (numCasas < 0) {
        numCasas = -numCasas;
        direcao = -direcao;
    }

    if(numCasas === 1 ){
        if(peca === 'p' && indexDestino > indexOrigem ||
           peca === 'b' && indexDestino < indexOrigem)
    {           
        tabuleiro[indexOrigem] = ' ';
        tabuleiro[indexDestino] = peca;
        return {ok: true, capturas: 0};
    }

    else{
        return {ok: false, msg: 'movimento para tras invalido'};
    }
}
else if(numCasas ===2){
    let indexCaptura = indexOrigem + direcao;
    let pecaCapturada = tabuleiro[indexCaptura].toLowerCase();

    if(peca === 'b' && pecaCapturada === 'p' ||
       peca === 'p' && pecaCapturada === 'b')
    {
        tabuleiro[indexOrigem] = ' ';
        tabuleiro[indexCaptura] = ' ';
        tabuleiro[indexDestino] = peca;
        return {ok: true, capturas: 1}
    }
    else {
        return{ok: false, msg: "Nenhuma peça para capturar"}
    }
 }
 else{
     return{ok: false, msg: "Movimento longo invalido"}
 }
}





//movimento das damas
function moverDama(tabuleiro, indexOrigem, indexDestino, peca, diferenca){
    let direcao = diferenca % 7 === 0 ? 7 : 9;
    let numCasas = diferenca / direcao;

    if (numCasas < 0) {
        numCasas = -numCasas;
        direcao = -direcao;
    }
    let adversario = peca === "B" ? 'P' : "B";

    let seguidas = 0;
    let capturas = [];

    for(let i = indexOrigem + direcao; i !== indexDestino; i += direcao){
        if(tabuleiro[i]. toUpperCase() === peca){
            return{ok: false, msg: "Peças da mesma cor no caminho"}
        }
        else if (tabuleiro[i].toUpperCase() === adversario){
            capturas.push(i);
            seguidas += 1;
        }
        else {
            seguidas = 0;
        }

        if(seguidas > 1){
            return{ok: false, msg:"Duas ou mais peças seguidas no caminho"}
        }
    }
    for (let i of capturas){
        tabuleiro[i] = ' ';
    }
        tabuleiro[indexOrigem] = ' ';
        tabuleiro[indexDestino] = peca;

        return {ok: true, capturas: capturas.length};
    }

//========================================================================================

function promoverPecas(tabuleiro){
    let linhaInicio, linhaFim;

    linhaInicio = 1;
    linhaFim = 7;
    for(let i = linhaInicio; i <=linhaFim; i +=2){
        if(tabuleiro[i] === 'b'){
            tabuleiro[i] = 'B';
        }
    }

    linhaInicio = 7*8;
    linhaFim = linhaInicio + 7;
    for(let i = linhaInicio; i <= linhaFim; i +=2){
        if(tabuleiro[i] === 'p'){
            tabuleiro[i] = 'P';
        }
    }
}
//============================================================================================
function jogar(){
    let tabuleiro = criarTabuleiro();
    let turno = ['branca', 'preta'];
    let pecas = {brancas: 4*3, pretas: 4*3};

    while(pecas.brancas > 0 && pecas.pretas > 0){
        imprimirTabuleiro(tabuleiro);

        let indexOrigem = escolherPeça(tabuleiro, turno[0]);
        let indexDestino = escolherLxCDestino(tabuleiro);

        let r = mover (tabuleiro, indexOrigem, indexDestino);
        if (r.ok){
            pecas[turno[1] + 's'] -= r.capturas;
            turno.push(turno.shift());
            promoverPecas(tabuleiro);
        }
        else {
            alert(r.msg)
        }
    }
    imprimirTabuleiro(tabuleiro);
    console.table(pecas)

}


/*
const jogo = {
    pecas: {
        brancas:12,
        pretas:12
    },
    tabuleiro: [
        ['p', '#', 'p', '#','p','#','p','#'],
        ['#', 'p', '#', 'p','#','p','#','p'],
        ['p', '#', 'p', '#','p','#','p','#'],
        ['#', ' ', '#', ' ','#',' ','#', ' '],
        [' ', '#', ' ','#',' ','#', ' ','#'],
        ['#', 'b', '#', 'b','#','b','#','b'],
        ['b', '#', 'b', '#','b','#','b','#'],
        ['#', 'b', '#', 'b','#','b','#','b']

    ]
}
//console.table(jogo.tabuleiro);

//let pecasBrancas = [jogo.tabuleiro[7]]
//console.table(pecasBrancas.length)

console.table(jogo.tabuleiro.join('\n')+'\n\n');
//avancar 2 b
jogo.tabuleiro[7][1] = jogo.tabuleiro[6][1]; //7 1 =b
jogo.tabuleiro[6][1] ='b';
console.table(jogo.tabuleiro.join('\n'));

//pra qundo a pessoa tentar ir pro lado errado
function retornaB (){
    if (jogo.tabuleiro[7][1] === jogo.tabuleiro[7][0]){
        return jogo.tabuleiro[7][1]
    }
}*/
