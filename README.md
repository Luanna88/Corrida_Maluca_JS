# TCC - Corrida Maluca

Como pudemos ver no decorrer dos vídeos e exercícios o Javascript consegue ser uma linguagem bem doida também, e para fechar o módulo com chave de ouro nada melhor do que desenvolvermos um aplicação da Corrida Maluca.

A corrida consistirá dos seguintes casos de uso:

- Seleção de Pista
- Seleção de Corredores
- Realização da Corrida
- Aliado/Inimigo

### Seleção de Pista

Teremos alguns tipos de pista, na aplicação, ela deve ser selecionado antes da corrida iniciar, para buscar as pista faremos uma chamada GET para o seguinte endereço:

[***Pistas***](https://gustavobuttenbender.github.io/gus.github/corrida-maluca/pistas.json)

Exemplo do objeto de pista:

```jsx
{
  id: 1,
	nome: 'Himalaia', 
	tipo: 'MONTANHA',
	descricao: 'Uma montanha nevada, os corredores devem dar uma volta inteira nela, como existe muita neve eles terão dificuldade em enxergar',
	tamanho: 30,
	debuff: -2,
	posicoesBuffs: [6, 17]
}
```

Entendendo o objeto:

*nome*: Nome da pista

*tipo*: Tipo da pista, todos os corredores tem tem vantagem em algum tipo de pista

*descricao*: Uma breve descrição do que é a corrida

*tamanho*: Tamanho da pista

debuff: Debuff que aquela pista sempre vai dar nos atributos do corredor.

posicoesBuffs: Posições nas pistas onde pode ou não conter um buff de velocidade

### Seleção de Corredores

Podemos selecionar os corredores que estarão na corrida, os corredores vão ser os personagens padrão do corrida maluca e podem ser obtidos fazendo uma chamada GET nesse endereço:

[***Personagens***](https://gustavobuttenbender.github.io/gus.github/corrida-maluca/personagens.json)

Exemplo do objeto do corredor:

```jsx
{
  id: 1,
	nome: 'Dick Vigarista',
	velocidade: 5,
	drift: 2, 
	aceleracao: 4,
	vantagem: 'CIRCUITO'
}
```

Entendendo o objeto:

nome: Nome do corredor

velocidade: O quanto o carro corre normalmente em uma pista

drift: O quanto o carro corre nas curvas

acelecarao: O quanto o carro corre nas 3 primeiras rodadas

vantagem: O tipo de terreno no qual o carro possui vantagem

### Realizar Corrida

Para iniciar uma corrida necessitaremos de uma pista e de um array de corredores, o tamanho da corrida será o tamanho da pista.

Para um carro andar, na maior parte do tempo será usado o atributo velocidade, ao não que esteja ocorrendo as seguintes situações:

- 3 primeiras rodadas: Usar aceleração
- Curva (a cada 4 rodadas): Usar drift

Carros com vantagem de terreno ganham +2 nos atributos.

Observação: O corredor Dick Vigarista se estiver a uma rodada de ganhar NÃO pode mais andar, pois vai parar para fazer trapaça

Observação: Se o corredor tiver a velocidade total em 0 ou menos, ele não andará naquela rodada.

### Aliado/Inimigo

Cada corredor poderá escolher outro corredor para ser seu aliado ou inimigo, isso ocorrerá no inicio da corrida. Um corredor pode ter apenas 1 aliado e 1 inimigo

- Um corredor que tiver duas casas de distância pra mais ou pra menos de seu aliado, ganha 1 ponto de velocidade total
- Um corredor que tiver duas casas de distância pra mais ou pra menos de seu inimigo, perde 1 ponto de velocidade total

**Teste de mesa:** 

```jsx
// Pista

{
  id: 1,
	nome: 'Himalaia', 
	tipo: 'MONTANHA',
	descricao: 'Uma montanha nevada, os corredores devem dar uma volta inteira nela, como existe muita neve eles terão dificuldade em enxergar',
	tamanho: 30,
	debuff: -1,
	posicoesBuffs: [6, 17]
}
```

```jsx
// Corredores

{
  id: 1,
	nome: 'Dick Vigarista',
	velocidade: 5,
	drift: 2,
	aceleracao: 4,
	vantagem: 'CIRCUITO',
	aliado: 'Penélope Charmosa',
	inimigo: 'Peter Perfeito',
},
{
  id: 6,
	nome: "Penélope Charmosa",
	velocidade: 4,
	drift: 3,
	aceleracao: 5,
	vantagem: 'CIDADE',
	aliado: 'Irmãos Rocha',
	inimigo: 'Professor Aéreo',
},
{
  id: 10,
	nome: "Peter Perfeito",
	velocidade: 7,
	drift: 1,
	aceleracao: 2,
	vantagem: 'CIRCUITO',
	aliado: 'Barão Vermelho',
	inimigo: 'Sargento Bombarda',
},
```
---

**Dick:**

Primeira Rodada:  3/30 (aceleração(4) - debuff da pista(1) + buff aliado(1) - buff inimigo(1))

Segunda Rodada: 6/30 (aceleração(4) - debuff da pista(1) + buff aliado(1) - buff inimigo(1))

Terceira Rodada:  11/30 (aceleração(4) - debuff da pista(1) + buff posiçao-pista (1) + buff aliado(1))

Quarta Rodada: 13/30 (drift(2) - debuff da pista(1) + buff aliado(1))

Quinta Rodada: 18/30 (velocidade(5) - debuff da pista(1) + buff aliado(1))

Sexta Rodada: 23/30 (velocidade(5) - debuff da pista(1) + buff aliado(1))

---

**Penelópe:**

Primeira Rodada:  4/30 (aceleração(5) - debuff da pista(1))

Segunda Rodada: 8/30 (aceleração(5) - debuff da pista(1))

Terceira Rodada:  12/30 (aceleração(5) - debuff da pista(1))

Quarta Rodada: 14/30 (drift(3) - debuff da pista(1))

Quinta Rodada 17/30 (velocidade(4) - debuff da pista(1))

Sexta Rodada: 21/30 (velocidade(4) - debuff da pista(1) + buff posicao-pista(1))

---

**Peter Perfeito:**

Primeira Rodada:  1/30 (aceleração(2) - debuff da pista(1))

Segunda Rodada: 2/30 (aceleração(2) - debuff da pista(1))

Terceira Rodada:  3/30 (aceleração(2) - debuff da pista(1))

Quarta Rodada: 3/30 (drift(1) - debuff da pista(1))

Quinta Rodada 9/30 (velocidade(7) - debuff da pista(1))

Sexta Rodada: 17/30 (velocidade(7) - debuff da pista(1) + buff posicao-pista(2))

---

# Boa corrida!