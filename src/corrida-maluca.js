export function setarAliadoEInimigo(personagem, aliado, inimigo){
  personagem.aliado = aliado
  personagem.inimigo = inimigo
}

export function calculoBuffsEDebuffs(pista, personagens){
  let debuff = pista.debuff
  let buff = 2

  for(let i = 0; i < personagens.length; i++){
      personagens[i].velocidade = (personagens[i].velocidade + debuff)
      personagens[i].drift = (personagens[i].drift + debuff)
      personagens[i].aceleracao = (personagens[i].aceleracao + debuff)
      personagens[i].posicao = 0
      personagens[i].checkpoint = 0

      if(personagens[i].vantagem === pista.tipo){
          personagens[i].velocidade = (personagens[i].velocidade + buff)
          personagens[i].drift = (personagens[i].drift + buff)
          personagens[i].aceleracao = (personagens[i].aceleracao + buff)
      }
  }
  return personagens
}

export function calcularAliadoEInimigo(personagem, personagens){
  for(let i = 0; i < personagens.length; i++){
      if(personagem.aliado == personagens[i].nome){
          if(personagens[i].posicao - personagem.posicao <= 2 && personagens[i].posicao - personagem.posicao >= -2){
              personagem.velocidade +=1
              personagem.drift +=1
              personagem.aceleracao +=1
              personagem.buffAliado = 'Ativo'
          }
      }

      if( personagem.inimigo == personagens[i].nome){
          if(personagens[i].posicao - personagem.posicao <= 2 && personagens[i].posicao - personagem.posicao >= -2){
              personagem.velocidade += -1
              personagem.drift += -1
              personagem.aceleracao += -1
              personagem.debuffInimigo = 'Ativo'
          }
      }
  }
  return personagem
}

export function resetAliadoEInimigo(personagem){
  if(personagem.debuffInimigo === 'Ativo'){

      if(personagem.velocidade <= 0){
          personagem.velocidade = 0
      }else{
          personagem.velocidade += 1
      }
      if(personagem.drift <= 0){
          personagem.drift = 0
      }else{
      personagem.drift += 1
      }
      if(personagem.aceleracao <= 0){
          personagem.aceleracao = 0
      }else{
          personagem.aceleracao += 1
      }
      personagem.debuffInimigo = 'Desativado'
  }
  
  if(personagem.buffAliado === 'Ativo'){
      if(personagem.velocidade <= 0){
          personagem.velocidade = 0
      }else{
          personagem.velocidade += -1
      }
      if(personagem.drift <= 0){
          personagem.drift = 0
      }else{
          personagem.drift += -1
      }
      if(personagem.aceleracao <= 0){

          personagem.aceleracao = 0
      }else{
          
          personagem.aceleracao += -1
      }
      personagem.buffAliado = 'Desativado'
  }
  return personagem
}

export function prevencaoAtributos(personagens){
  if(personagens.velocidade < 0){
      personagens.velocidade = 0
  }
  if(personagens.drift < 0){
      personagens.drift = 0
  }
  if(personagens.aceleracao < 0){
      personagens.aceleracao = 0
  }
  return personagens
}

export function bloquearDickVigarista(pista, personagens){
  if(personagens.nome === 'Dick Vigarista' && personagens.posicao >= pista.tamanho){
      personagens.posicao = pista.tamanho - 1
      personagens.velocidade = 0
      personagens.drift = 0
      personagens.aceleracao = 0
  }
  return personagens

}

export function buffsPosicaoPista(pista, personagem ,personagens){
  for(let i = 0; i < pista.posicoesBuffs.length; i++){
      if(personagem.checkpoint == i){
          if(personagem.posicao >= pista.posicoesBuffs[i]){
              personagem.checkpoint += 1
              for(let j = 0; j < personagens.length; j++){
                  if(personagem.nome != personagens[j].nome){
                      if(personagens[j].posicao < pista.posicoesBuffs[i]){
                          personagens[j].velocidade += 1
                          personagens[j].drift += 1
                          personagens[j].aceleracao += 1
                    }
                  }
              }
          }
      }
  }
  return personagens

}
export function corrida(pista, personagens){

  let rodada = 0
  let indiceWhile = true
  let rodadaDrift = 0
  
  calculoBuffsEDebuffs(pista, personagens)

  while(indiceWhile){

      for(let i = 0; i < personagens.length; i++){   
          
          if(rodada <= 3){
              calcularAliadoEInimigo(personagens[i], personagens)
              prevencaoAtributos(personagens[i])
              personagens[i].posicao += personagens[i].aceleracao
              resetAliadoEInimigo(personagens[i])
              buffsPosicaoPista(pista, personagens[i], personagens)
              bloquearDickVigarista(pista, personagens[i])
          }
          else if(rodadaDrift === 4){
              calcularAliadoEInimigo(personagens[i], personagens)
              prevencaoAtributos(personagens[i])
              personagens[i].posicao += personagens[i].drift
              resetAliadoEInimigo(personagens[i])
              buffsPosicaoPista(pista, personagens[i], personagens)
              bloquearDickVigarista(pista, personagens[i])
          }
          else {
              calcularAliadoEInimigo(personagens[i], personagens)
              prevencaoAtributos(personagens[i])
              personagens[i].posicao += personagens[i].velocidade
              resetAliadoEInimigo(personagens[i])
              buffsPosicaoPista(pista, personagens[i], personagens)
              bloquearDickVigarista(pista, personagens[i])
          }

          if(personagens[i].posicao >= pista.tamanho){
              personagens[i].posicao = pista.tamanho
              personagens[i].status = 'Ganhador'

              indiceWhile = false

              return personagens
          }   
      }
      if(rodadaDrift === 4){
          rodadaDrift = 0
      }
      rodada += 1
      rodadaDrift += 1
  }
}
