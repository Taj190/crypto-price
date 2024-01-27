let responseData;
let originalData;

async function getResponse() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    responseData = await response.json();
    originalData = [...responseData];
    displayResult();

  } catch (error) {
    console.error('Error fetching menu:', error.message);
  }
}

function displayResult() {
  let table = document.getElementById('table');
  table.innerHTML = '';

  if (responseData.length === 0) {
    table.innerHTML = `<p>Result not found</p>`;
    return;
  }

  let headerRow = `<tr class="header-row">
    <th></th>
    <th>Coin</th>
    <th></th>
    <th>Price</th>
    <th>Max Supply</th>
    <th>Gain/Loss</th>
    <th>Market Cap</th>
  </tr>`;

  let rows = responseData.map(data => {
    let high24h = data.high_24h;
    let currentPrice = data.current_price;
    let percentage = ((high24h - currentPrice) / high24h * 100).toFixed(1);
    let changeClass = percentage < 0 ? 'down' : 'up';
    return `<tr class="table-row">
      <td><img src ="${data.image}" height="60px" width="60px"></td>
      <td>${data.name}</td>
      <td>${data.symbol}</td>
      <td>${data.current_price}</td>
      <td>${data.max_supply}</td>
      <td class="${changeClass}">${percentage}%</td>
      <td>${data.market_cap}</td>
    </tr>
    <tr><td colspan="7"><hr></td></tr>`;
  });

  table.innerHTML = headerRow + rows.join('');
}

function marketCapSort() {
  responseData.sort((a, b) => b.market_cap - a.market_cap);
  displayResult();
}

function percentageSort() {
  responseData.sort((a, b) => {
    let percentageA = ((a.high_24h - a.current_price) / a.high_24h * 100);
    let percentageB = ((b.high_24h - b.current_price) / b.high_24h * 100);
    return percentageB - percentageA;
  });
  displayResult();
}

function searchCoins(query) {
  responseData = originalData.filter(data =>
    data.name.toLowerCase().includes(query.toLowerCase()) ||
    data.symbol.toLowerCase().includes(query.toLowerCase())
  );
  displayResult();
}

function hideAllCoins() {
  let allCoins = document.querySelectorAll('.table-row');
  allCoins.forEach((coin) => {
    coin.style.display = 'none';
  });
}

getResponse();

let marketCap = document.getElementById('mkt_cap');
marketCap.addEventListener('click', () => {
  marketCapSort();
});

let percentageButton = document.getElementById('percentage');
percentageButton.addEventListener('click', () => {
  percentageSort();
});

let searchInput = document.getElementById('searchInput');
let back = document.createElement('button');
back.classList.add('back-btn')
back.innerText='Back';
document.body.appendChild(back);
back.addEventListener('click', ()=>{
  document.querySelector('.back-btn').style.display ='none'
  displayResult()
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    let query = searchInput.value.toLowerCase();
    searchCoins(query);
  }
  document.querySelector('.back-btn').style.display ='block'
});




