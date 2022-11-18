const championsGrid = document.getElementById('champions-grid');
const defaultRoleIcons = Array.from(
  document.querySelectorAll('.lane-container > img'),
).map((img) => img.src);
const pickedChampionsAside = document.getElementById('picked-champions');

const clickState = {
  id: null,
  lastClicked: null,
};

const lastClickedNodes = {
  champion: null,
  lane: null,
};

const saveToLocalStorage = (innerHTML) => {
  localStorage.setItem('selected-champions-dirty', innerHTML);
};

const clearSelections = () => {
  lastClickedNodes.champion?.children[0].classList.remove('selected-champion');
  lastClickedNodes.lane?.classList.remove('selected-lane');

  clickState.id = null;
  clickState.lastClicked = null;

  lastClickedNodes.champion = null;
  lastClickedNodes.lane = null;
};

const forEachNode = (nodes, callback) => {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    callback(node, i);
  }
};

const setSelectedLaneCss = (laneContainer) => {
  lastClickedNodes.lane?.classList.remove('selected-lane');

  laneContainer.classList.add('selected-lane');
  lastClickedNodes.lane = laneContainer;
};

const handdleLaneClick = (laneIndex, laneContainer) => {
  if (clickState.lastClicked === 'lane' || clickState.lastClicked === null) {
    clickState.id = laneIndex;
    clickState.lastClicked = 'lane';
    setSelectedLaneCss(laneContainer);
    return;
  }

  laneContainer.children[0].src = `http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${clickState.id}.png`;
  clearSelections();
  saveToLocalStorage(pickedChampionsAside.innerHTML);
};

const removeChampionFromLane = (laneIndex, laneContainer) => {
  laneContainer.children[0].src = defaultRoleIcons[laneIndex];
  clearSelections();
  saveToLocalStorage(pickedChampionsAside.innerHTML);
};

const setupLanesEventListeners = () => {
  const laneContainers = document.querySelectorAll('.lane-container');

  forEachNode(laneContainers, (laneContainer, i) => {
    laneContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      handdleLaneClick(i, laneContainer);
    });

    laneContainer.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeChampionFromLane(i, laneContainer);
    });
  });
};

const setSelectedChampionCss = (championContainer) => {
  lastClickedNodes.champion?.children[0].classList.remove('selected-champion');

  championContainer.children[0].classList.add('selected-champion');
  lastClickedNodes.champion = championContainer;
};

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

  lastClickedNodes.lane.children[0].src = `http://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/${champIndex}.png`;
  clearSelections();
  saveToLocalStorage(pickedChampionsAside.innerHTML);
};

const fetchChampions = async () => {
  const res = await fetch(
    'http://ddragon.leagueoflegends.com/cdn/12.22.1/data/en_US/champion.json',
  );
  const parsedRes = await res.json();
  return parsedRes.data;
};

const buildAndAppendChampionEl = (champion) => {
  const championDiv = document.createElement('div');
  const championImg = document.createElement('img');
  const championName = document.createElement('h2');
  const championAdd = document.createElement('span');
  const championTitle = document.createElement('p');

  championDiv.appendChild(championImg);
  championDiv.appendChild(championAdd);
  championDiv.appendChild(championName);
  championDiv.appendChild(championTitle);

  championImg.src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;
  championAdd.innerText = '+';
  championName.innerText = champion.name;
  championTitle.innerText = champion.title;

  championsGrid.appendChild(championDiv);

  championDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    handdleChampClick(champion.id, championDiv);
  });
};

const populateGrid = async () => {
  const champions = await fetchChampions();
  const championsArr = Object.values(champions);

  championsArr.forEach(buildAndAppendChampionEl);
};

const loadSavedChampions = () => {
  const savedChampionsInnerHTML = localStorage.getItem(
    'selected-champions-dirty',
  );
  if (!savedChampionsInnerHTML) return;

  pickedChampionsAside.innerHTML = savedChampionsInnerHTML;
};

loadSavedChampions();
populateGrid();
setupLanesEventListeners();

document.querySelector('body').addEventListener('click', () => {
  clearSelections();
});
document.querySelector('body').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  clearSelections();
});
