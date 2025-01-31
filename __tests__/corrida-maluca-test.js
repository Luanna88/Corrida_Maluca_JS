import axios from 'axios'
import { corrida, calculoBuffsEDebuffs, calcularAliadoEInimigo, resetAliadoEInimigo, prevencaoAtributos, bloquearDickVigarista, setarAliadoEInimigo } from '../src/corrida-metodo'

let listaPistas
let listaPistasData
let listaPersonagens
let listaPersonagensData

beforeEach(async () => {
  listaPistas = await axios.get('https://gustavobuttenbender.github.io/gus.github/corrida-maluca/pistas.json')
  listaPistasData = listaPistas.data
  listaPersonagens = await axios.get('https://gustavobuttenbender.github.io/gus.github/corrida-maluca/personagens.json')
  listaPersonagensData = listaPersonagens.data

})

describe('Testes obrigatorios', () => {
  it('Deve conseguir obter a pista corretamente', () => {
    let pistaSelecionada = listaPistasData[0]

    const resposta = pistaSelecionada
    const resultadoEsperado = {
      id: 1,
      nome: 'Himalaia',
      tipo: 'MONTANHA',
      descricao: 'Uma montanha nevada, os corredores devem dar uma volta inteira nela, como existe muita neve eles terão dificuldade em enxergar',
      tamanho: 30,
      debuff: -2,
      posicoesBuffs: [ 6, 17 ]
    }
    expect(resposta).toEqual(resultadoEsperado)

  });

  it('Deve conseguir obter o corredor corretamente', () => {
    let personagensSelecionados = [listaPersonagensData[0], listaPersonagensData[1]]

    const resposta = personagensSelecionados
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 5,
        drift: 2,
        aceleracao: 4,
        vantagem: 'CIRCUITO'
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA'
      }
    ]
    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir calcular a vantagem de tipo pista corretamente', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagensSelecionados = [listaPersonagensData[0], listaPersonagensData[1]]

    const resposta = calculoBuffsEDebuffs(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 3,
        drift: 0,
        aceleracao: 2,
        vantagem: 'CIRCUITO',
        posicao: 0,
        checkpoint: 0
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 0,
        checkpoint: 0
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir calcular o debuff de pista corretamente', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagensSelecionados = [listaPersonagensData[0], listaPersonagensData[1]]

    const resposta = calculoBuffsEDebuffs(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 3,
        drift: 0,
        aceleracao: 2,
        vantagem: 'CIRCUITO',
        posicao: 0,
        checkpoint: 0
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 0,
        checkpoint: 0
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir calcular o buff de posição de pista para 3 corredores', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]   
    let personagem3 = listaPersonagensData[2] 

    let personagensSelecionados = [personagem1, personagem2, personagem3]

    const resposta = corrida(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 5,
        drift: 2,
        aceleracao: 4,
        vantagem: 'CIRCUITO',
        posicao: 27,
        checkpoint: 2
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      },
      {
        id: 3,
        nome: 'Irmãos Pavor',
        velocidade: 6,
        drift: 4,
        aceleracao: 5,
        vantagem: 'DESERTO',
        posicao: 28,
        checkpoint: 2
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir calcular a próxima posição corretamente se estiver sob o buff de um aliado', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]

    setarAliadoEInimigo(personagem1, 'Irmãos Rocha', 'teste')
    
    let personagensSelecionados = [personagem1, personagem2]

    const resposta = corrida(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 4,
        drift: 1,
        aceleracao: 3,
        vantagem: 'CIRCUITO',
        aliado: 'Irmãos Rocha',
        inimigo: 'teste',
        posicao: 20,
        checkpoint: 2,
        buffAliado: 'Desativado'
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 6,
        drift: 3,
        aceleracao: 4,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      }
    ]
    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir calcular a próxima posição corretamente se estiver sob o debuff de um inimigo', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]

    setarAliadoEInimigo(personagem1, 'teste', 'Irmãos Rocha')

    let personagensSelecionados = [personagem1, personagem2]

    const resposta = corrida(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 5,
        drift: 2,
        aceleracao: 4,
        vantagem: 'CIRCUITO',
        aliado: 'teste',
        inimigo: 'Irmãos Rocha',
        posicao: 25,
        checkpoint: 2,
        debuffInimigo: 'Desativado'
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir completar uma corrida com um vencedor', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]
    
    let personagensSelecionados = [personagem1, personagem2]

    const resposta = corrida(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 5,
        drift: 2,
        aceleracao: 4,
        vantagem: 'CIRCUITO',
        posicao: 27,
        checkpoint: 2
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir criar corredor corretamente somente com aliado', () => {
    let personagem1 = listaPersonagensData[0]

    setarAliadoEInimigo(personagem1, 'Irmãos Rocha', 'Não Possui')

    const resposta = personagem1
    const resultadoEsperado = {
      id: 1,
      nome: 'Dick Vigarista',
      velocidade: 5,
      drift: 2,
      aceleracao: 4,
      vantagem: 'CIRCUITO',
      aliado: 'Irmãos Rocha',
      inimigo: 'Não Possui'
    }

    expect(resposta).toEqual(resultadoEsperado)
  });
  
  it('Deve conseguir criar corredor corretamente somente com inimigo', () => {
    let personagem1 = listaPersonagensData[0]
    
    setarAliadoEInimigo(personagem1, 'Não Possui', 'Irmãos Rocha')

    const resposta = personagem1
    const resultadoEsperado = {
      id: 1,
      nome: 'Dick Vigarista',
      velocidade: 5,
      drift: 2,
      aceleracao: 4,
      vantagem: 'CIRCUITO',
      aliado: 'Não Possui',
      inimigo: 'Irmãos Rocha'
    }
    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir criar corredor corretamente com aliado e inimigo', () => {
    let personagem1 = listaPersonagensData[0]
    
    setarAliadoEInimigo(personagem1, 'Irmãos Pavor', 'Irmãos Rocha')

    const resposta = personagem1
    const resultadoEsperado = {
      id: 1,
      nome: 'Dick Vigarista',
      velocidade: 5,
      drift: 2,
      aceleracao: 4,
      vantagem: 'CIRCUITO',
      aliado: 'Irmãos Pavor',
      inimigo: 'Irmãos Rocha'
    }

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve conseguir calcular as novas posições corretamente de uma rodada para a próxima', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]
    

    let personagensSelecionados = [personagem1, personagem2]

    const resposta = corrida(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 5,
        drift: 2,
        aceleracao: 4,
        vantagem: 'CIRCUITO',
        posicao: 27,
        checkpoint: 2
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)
  });

  it('Deve impedir que corredor se mova negativamente mesmo se o calculo de velocidade seja negativo', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]
    let personagensSelecionados = [personagem1, personagem2]

    personagem1.velocidade = -15

    const resposta = corrida(pistaSelecionada, personagensSelecionados)
    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 2,
        drift: 2,
        aceleracao: 4,
        vantagem: 'CIRCUITO',
        posicao: 18,
        checkpoint: 2
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      }
    ]

    expect(resposta).toEqual(resultadoEsperado)

  });

  it('Deve impedir que o Dick Vigarista vença a corrida se estiver a uma rodada de ganhar', () => {
    let pistaSelecionada = listaPistasData[0]
    let personagem1 = listaPersonagensData[0]
    let personagem2 = listaPersonagensData[1]
    
    let personagensSelecionados = [personagem1, personagem2]

    personagem2.velocidade = -15

    const resposta = corrida(pistaSelecionada, personagensSelecionados)

    const resultadoEsperado = [
      {
        id: 1,
        nome: 'Dick Vigarista',
        velocidade: 0,
        drift: 0,
        aceleracao: 0,
        vantagem: 'CIRCUITO',
        posicao: 29,
        checkpoint: 2
      },
      {
        id: 2,
        nome: 'Irmãos Rocha',
        velocidade: 1,
        drift: 3,
        aceleracao: 4,
        vantagem: 'MONTANHA',
        posicao: 30,
        checkpoint: 2,
        status: 'Ganhador'
      }
    ]
    expect(resposta).toEqual(resultadoEsperado)
  });
})
