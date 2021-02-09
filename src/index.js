const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function drawCard() {
  let cards = [];
  for (let i = 0; i < 4; i++) {
    let card = Math.floor(Math.random() * 52 + 4);
    while (cards.includes(card)) {
      card = Math.floor(Math.random() * 52 + 4);
    }
    cards[cards.length] = card;
  }
  return {
    user: [cards[0], cards[1]],
    com: [cards[2], cards[3]],
  };
}

async function main() {
  let totalChip = 0;
  await play(0);
  process.exit(0)
}

function genCardDict() {
  let dict = {};
  for (let i = 1; i < 14; i++) {
    if (i === 11) {
      dict[i] = "Jack";
    } else if (i === 12) {
      dict[i] = "Queen";
    } else if (i === 13) {
      dict[i] = "King";
    } else {
      dict[i] = i.toString();
    }
  }
  return dict;
}

const cardFenchDict = {
  0: "Clubs",
  1: "Diamonds",
  2: "Hearts",
  3: "Spades",
};

const cardDict = genCardDict();

const idenCard = (card) => {
  const cardPoint = Math.floor(card / 4);
  const cardFench = card % 4;
  return {
    cardPoint: cardPoint > 9 ? 0 : cardPoint,
    cardFench,
    cardName: cardFenchDict[cardFench] + "-" + cardDict[cardPoint],
  };
};

function winnerIs(userCards, comCards) {
  let userPoint = userCards[0].cardPoint + userCards[1].cardPoint
  userPoint = userPoint%10
  let comPoint = comCards[0].cardPoint + comCards[1].cardPoint
  comPoint = comPoint%10
  if (userPoint > comPoint) {
    const multi = userCards[0].cardFench == userCards[1].cardFench || userCards[0].cardName == userCards[1].cardName ? 2 : 1
    return {
      winner: 'user',
      multi: multi
    }
  } if (userPoint === comPoint) {
    return {
      winner: 'draw',
      multi: 1
    }
  }
  else {
    const multi = comCards[0].cardFench == comCards[1].cardFench || comCards[0].cardName == comCards[1].cardName ? 2 : 1
    return {
      winner: 'com',
      multi: multi
    }
  }
}

async function play(chip) {
  while (true) {
    const bet = await new Promise((resolve, reject) => {
      rl.question("Please put your Bet \n", function (bet) {
        resolve(parseInt(bet));
      });
    });
    const { user, com } = drawCard();
    const userCards = user.map((card) => idenCard(card));
    const comCards = com.map((card) => idenCard(card));
    console.log(`You got ${userCards[0].cardName}, ${userCards[1].cardName}`)
    console.log(`The dealer got ${comCards[0].cardName}, ${comCards[1].cardName}`)
    const { winner, multi } = winnerIs(userCards, comCards)
    if (winner == 'user') {
      console.log('You won!!!, received', bet, ' chips')
      chip = chip + bet
    }
    else if (winner == 'draw') {
      console.log('You draw!!!')
    }
    else {
      console.log('You lose!!!, loose', bet, ' chips')
      chip = chip - bet
    }
    const wantContinue = await new Promise((resolve, reject) => {
      rl.question("Wanna play more (Yes/No) \n", function (play) {
        resolve(play);
      });
    });
    if (wantContinue==="No") break;
  }
  console.log("You got total ", chip, " chips")
}

main();
