const pistas = [
    {
      id: 1,
      nome: 'Himalaia',
      tipo: 'MONTANHA',
      descricao:
        'Uma montanha nevada, os corredores devem dar uma volta inteira nela, como existe muita neve eles terão dificuldade em enxergar',
      tamanho: 30,
      debuff: -1,
      posicoesBuffs: [6, 17],
    },
  ];
  
  const corredores = [
    {
      id: 1,
      nome: 'Dick Vigarista',
      velocidade: 5,
      drift: 2,
      aceleracao: 4,
      vantagem: 'CIRCUITO',
      aliado: 'Penélope Charmosa',
      inimigo: 'Peter Perfeito',
      posicao: 0,
    },
    {
      id: 6,
      nome: 'Penélope Charmosa',
      velocidade: 4,
      drift: 3,
      aceleracao: 5,
      vantagem: 'CIDADE',
      aliado: 'Irmãos Rocha',
      inimigo: 'Professor Aéreo',
      posicao: 0,
    },
    {
      id: 10,
      nome: 'Peter Perfeito',
      velocidade: 7,
      drift: 1,
      aceleracao: 2,
      vantagem: 'CIRCUITO',
      aliado: 'Barão Vermelho',
      inimigo: 'Sargento Bombarda',
      posicao: 0,
    },
  ];
  
  function calcularPosicao(corredor, pista, rodada) {
    let velocidade = corredor.velocidade;
  
    if (corredor.vantagem === pista.tipo) {
      velocidade += 2;
    }

    if (rodada === 1) {
      velocidade = corredor.velocidade + (corredor.vantagem === pista.tipo ? 2 : 0); 
    } else if (rodada <= 3) {
      velocidade = corredor.aceleracao + pista.debuff;
    } else if (rodada % 4 === 0) {
      velocidade = corredor.drift + pista.debuff;
    }
  
    const aliado = corredores.find((c) => c.nome === corredor.aliado);
    const inimigo = corredores.find((c) => c.nome === corredor.inimigo);

    if (aliado && Math.abs(aliado.posicao - corredor.posicao) <= 2) {
      velocidade += 1;
    }
  
    if (inimigo && Math.abs(inimigo.posicao - corredor.posicao) <= 2) {
      velocidade -= 1;
    }
  
    if (pista.posicoesBuffs.includes(corredor.posicao + velocidade)) {
      velocidade += 1;
    }
  
    const novaPosicao = corredor.posicao + velocidade;
  
    if (corredor.posicao === 6 && rodada === 1 && pista.posicoesBuffs.includes(6)) {
      return 7;
    }
  
    return Math.max(novaPosicao, 0);
  }
  
  function iniciarCorrida(pista, corredores) {
    const tamanhoPista = pista.tamanho;
    let vencedor = null;
  
    for (let rodada = 1; rodada <= tamanhoPista; rodada++) {
      corredores.forEach((corredor) => {
        if (corredor.nome === 'Dick Vigarista' && corredor.posicao >= tamanhoPista - 1) {
          return;
        }
  
        corredor.posicao = calcularPosicao(corredor, pista, rodada);
  
        if (corredor.posicao >= tamanhoPista && !vencedor) {
          vencedor = corredor;
        }
      });
  
      if (vencedor) break;
    }
  
    return vencedor;
  }
  
  module.exports = { pistas,corredores,calcularPosicao,iniciarCorrida,};
  