const { pistas, corredores, calcularPosicao, iniciarCorrida } = require('../src/corrida-maluca');

describe('Corrida Maluca', () => {
  it('Deve conseguir obter a pista corretamente', () => {
    const pista = pistas[0];
    
    expect(pista.nome).toBe('Himalaia');
  });

  it('Deve conseguir obter o corredor corretamente', () => {
    const corredor = corredores[0];

    expect(corredor.nome).toBe('Dick Vigarista');
  });

  it('Deve conseguir calcular o buff de posição de pista para 3 corredores', () => {
    const corredor = corredores[0];
    const pista = pistas[0];

    corredores[0].posicao = 6;

    const posicaoBuff = calcularPosicao(corredor, pista, 1);

    expect(posicaoBuff).toBe(7);  
  });

  it('Deve conseguir calcular a próxima posição corretamente se estiver sob o buff de um aliado', () => {
    const corredor = corredores[0];
    const aliado = corredores.find(c => c.nome === corredor.aliado);

    aliado.posicao = 4;  

    const pista = pistas[0];
    const posicaoComBuffAliado = calcularPosicao(corredor, pista, 1);

    expect(posicaoComBuffAliado).toBe(7); 
  });

  it('Deve conseguir calcular a próxima posição corretamente se estiver sob o debuff de um inimigo', () => {
    const pista = pistas[0];
    const corredor = corredores[0]; 
    const inimigo = corredores[2]; 

    corredor.posicao = 0;
    inimigo.posicao = 1;

    const rodada = 1;
    const novaPosicao = calcularPosicao(corredor, pista, rodada);

    expect(novaPosicao).toBe(4);
  });

  it('Deve conseguir completar uma corrida com um vencedor', () => {
    const vencedor = iniciarCorrida(pistas[0], corredores);

    expect(vencedor).toBeTruthy();
  });

  it('Deve impedir que corredor se mova negativamente mesmo se o calculo de velocidade seja negativo', () => {
    const corredor = corredores[0];
    const pista = pistas[0];

    corredor.velocidade = -1; 

    const posicao = calcularPosicao(corredor, pista, 1);

    expect(posicao).toBeGreaterThanOrEqual(0);
  });

  it('Deve impedir que o Dick Vigarista vença a corrida se estiver a uma rodada de ganhar', () => {
    const dickVigarista = corredores.find(c => c.nome === 'Dick Vigarista');

    dickVigarista.posicao = 29; 

    const vencedor = iniciarCorrida(pistas[0], corredores);

    expect(vencedor.nome).not.toBe('Dick Vigarista'); 
  });

  it('Deve conseguir criar corredor corretamente somente com aliado', () => {
    const corredor = corredores[0]; 
    const aliado = corredores.find((c) => c.nome === corredor.aliado);

    corredor.posicao = 5;
    aliado.posicao = 6; 

    const pista = pistas[0];
    const novaPosicao = calcularPosicao(corredor, pista, 1);

    expect(novaPosicao).toBe(corredor.posicao + corredor.velocidade + 1);
  });

  it('Deve conseguir calcular a vantagem de tipo pista corretamente', () => {
    const pista = pistas[0];
    const corredor = {
      id: 11,
      nome: 'Correrdor Teste',
      velocidade: 3,
      drift: 2,
      aceleracao: 4,
      vantagem: 'MONTANHA', 
      aliado: null,
      inimigo: null,
      posicao: 0,
    };
    const rodada = 1;
    const posicao = calcularPosicao(corredor, pista, rodada);

    expect(posicao).toBe(5);
  });

  it('Deve conseguir calcular o debuff de pista corretamente', () => {
    const pista = pistas[0]; 
    const corredor = corredores[0]; 
    corredor.posicao = 0;
    corredor.velocidade = 5;
  
    const novaPosicao = calcularPosicao(corredor, pista, 1);

    expect(novaPosicao).toBe(5);
  });

  it('Deve conseguir criar corredor corretamente somente com inimigo', () => {
    const novoCorredor = {
      id: 15,
      nome: 'Zeca Maluco',
      velocidade: 6,
      drift: 4,
      aceleracao: 3,
      vantagem: 'MONTANHA',
      aliado: null,
      inimigo: 'Dick Vigarista',
      posicao: 0,
    };

    expect(novoCorredor.nome).toBe('Zeca Maluco');
    expect(novoCorredor.inimigo).toBe('Dick Vigarista');
    expect(novoCorredor.aliado).toBeNull();
  });

  it('Deve conseguir criar corredor corretamente com aliado e inimigo', () => {
    const novoCorredor = {
      id: 15,
      nome: 'Professor Aéreo',
      velocidade: 6,
      drift: 3,
      aceleracao: 4,
      vantagem: 'AR',
      aliado: 'Sargento Bombarda',
      inimigo: 'Penélope Charmosa',
      posicao: 0,
    };
  
    expect(novoCorredor.nome).toBe('Professor Aéreo');
    expect(novoCorredor.aliado).toBe('Sargento Bombarda');
    expect(novoCorredor.inimigo).toBe('Penélope Charmosa');
    expect(novoCorredor.posicao).toBe(0);
    expect(novoCorredor.velocidade).toBe(6);
    expect(novoCorredor.drift).toBe(3);
    expect(novoCorredor.aceleracao).toBe(4);
    expect(novoCorredor.vantagem).toBe('AR');
  });

  it('Deve conseguir calcular as novas posições corretamente de uma rodada para a próxima', () => {
    const pista = pistas[0];

    const rodada1 = calcularPosicao(corredores[0], pista, 1);
    expect(rodada1).toBeGreaterThanOrEqual(0);

    const rodada2 = calcularPosicao(corredores[1], pista, 2);
    expect(rodada2).toBeGreaterThan(rodada1);

    const rodada3 = calcularPosicao(corredores[2], pista, 3);
    expect(rodada3).toBeGreaterThan(rodada2);

    const rodada4 = calcularPosicao(corredores[0], pista, 4);
    expect(rodada4).toBeGreaterThanOrEqual(0);
  });

});