# Introdução

Nesse repositório é possível encontrar 3 branches: **main**, **neat-method** e **dirty-method**.

Na branch **main**, o código da página funciona como esperado:
- Clicar em um personagem e depois clicar em um dos quadrados posicionados a direita, ou o contrário, faz o personagem aparecer no quadrado clicado;
- Clicar com o botão direito, em um quadrado da direita que contém um personagem,  faz desaparecer o personagem do quadrado;
- Ao atualizar a página as alterações são perdidas;

Nas branches **neat-method** (a branch publicada no pages) e **dirty-method**, as alterações são salvas no `localStorage` das formas descritas abaixo;

# Método bonito (neat-method)

## Passo 1

Criar a estrutura que vai armazenar as dados;

```js
const selectedChampions = Array(5)
  .fill()
  .map(() => ({ id: null }));
```

## Passo 2

Encontrar onde no código esses dados escritas

```js
const handdleLaneClick = (laneIndex, laneContainer) => {
  if (clickState.lastClicked === 'lane' || clickState.lastClicked === null) {
    clickState.id = laneIndex;
    clickState.lastClicked = 'lane';
    setSelectedLaneCss(laneContainer);
    return;
  }

  // Decidi colocar aqui para escrever
  selectedChampions[laneIndex].id = clickState.id;
  laneContainer.children[0].src = `http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${clickState.id}.png`;
  clearSelections();
};
```

```js
const handdleChampClick = (champIndex, championContainer) => {
  if (
    clickState.lastClicked === 'champion' ||
    clickState.lastClicked === null
  ) {
    clickState.id = champIndex;
    clickState.lastClicked = 'champion';
    setSelectedChampionCss(championContainer);
    return;
  }

  // Coloquei aqui similar a anterior
  selectedChampions[clickState.id].id = champIndex;
  lastClickedNodes.lane.children[0].src = `http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${champIndex}.png`;
  clearSelections();
};
```

```js
const removeChampionFromLane = (laneIndex, laneContainer) => {
  // E dedici colocar aqui para remover
  selectedChampions[laneIndex].id = null;
  laneContainer.children[0].src = defaultRoleIcons[laneIndex];
  clearSelections();
};
```

## Passo 3

Encontrar onde no código os dados serão salvos no localStorage;

```js
// Essa é a função que executa o save
const saveToLocalStorage = () => {
  localStorage.setItem(
    'selected-champions-neat',
    JSON.stringify(selectedChampions),
  );
};
```

Nesse código essa função é chamada logo abaixo das linhas criadas no passo 2;

## Passo 4

Criar a função que vai carregar os dados no HTML;

```js
const loadSavedChampions = async () => {
  const savedChampionsJson = localStorage.getItem('selected-champions-neat');
  if (!savedChampionsJson) return;

  const savedChampions = JSON.parse(savedChampionsJson);
  selectedChampions = [...savedChampions];

  forEachNode(laneContainers, (laneContainer, i) => {
    const champIndex = savedChampions[i].id;
    if (!champIndex) return;

    laneContainer.children[0].src = `http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${champIndex}.png`;
  });
};
```

# Método bagunça (dirty-method)

## Passo 1

Criar a função que vai salvar o innerHTML no localStorage;

```js
const saveToLocalStorage = (innerHTML) => {
  localStorage.setItem('selected-champions-dirty', innerHTML);
};
```

## Passo 2

Nos locais de save, que são iguais aos anteriores, passar o innerHTML do elemento que contem todas as divs que queremos salvar;

```js
const handdleLaneClick = (laneIndex, laneContainer) => {
  if (clickState.lastClicked === 'lane' || clickState.lastClicked === null) {
    clickState.id = laneIndex;
    clickState.lastClicked = 'lane';
    setSelectedLaneCss(laneContainer);
    return;
  }

  laneContainer.children[0].src = `http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${clickState.id}.png`;
  clearSelections();
  
  // Por exemplo, aqui
  saveToLocalStorage(pickedChampionsAside.innerHTML);
};
```

## Passo 3

Criar a função que vai carregar o innerHTML na página;

```js
const loadSavedChampions = () => {
  const savedChampionsInnerHTML = localStorage.getItem(
    'selected-champions-dirty',
  );
  if (!savedChampionsInnerHTML) return;

  pickedChampionsAside.innerHTML = savedChampionsInnerHTML;
};
```

>Nesse caso também foi necessário alterar o código levemente para garantir que os eventListeners funcionassem da forma correta;
>
>Como o node está sendo recriado ao alterar o innerHTML, qualquer eventListener que é executado antes da alteração é perdido
