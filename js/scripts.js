/**
 * Created by Jackson on 7/26/16.
 */

var deck = createDeck();
var hit = 3;
var dealerHit = 3;
var dealt = false;
var wins = 0;
var topCard = 4;

var playerHand = [];
var dealerHand = [];

var bet = 0;
var cash = 300;

$(document).ready(function(){
    $('.chip').each(function(){
        if(Number($(this).attr('chipValue')) > cash){
            $(this).removeClass('btn-success');
            $(this).addClass('btn-danger');
        }
    });

    $('.chip').click(function(){
        var val = Number($(this).attr('chipValue'));

        if(val <= cash){
            bet += val;
            cash -= val;

            $('.cash').html(cash);
            $('.bet').html(bet);
        }

        $('.chip').each(function(){
            if(Number($(this).attr('chipValue')) > cash){
                $(this).removeClass('btn-success');
                $(this).addClass('btn-danger');
            }
        });
    });

    $('.deal').click(function(){
        $('.chip').prop('disabled', true);

        if(!dealt){
            dealt = true;
            shuffle();

            playerHand.push(deck[0]);
            playerHand.push(deck[2]);
            placeCard('player', '1', deck[0]);
            placeCard('player', '2', deck[2]);

            dealerHand.push(deck[1]);
            dealerHand.push(deck[3]);
            placeCard('dealer', '1', deck[1]);

            calculateTotal(playerHand, 'player');
            calculateTotal(dealerHand, 'dealer');

            if(calculateTotal(playerHand, 'player') > 21){
                lose()
            }else if(calculateTotal(dealerHand, 'dealer') > 21){
                win()
            }else if(calculateTotal(playerHand, 'player') == 21){
                win()
            }else if(calculateTotal(dealerHand, 'dealer') == 21){
                lose()
            }
        }
    });

    $('.hit').click(function(){
        if(hit < 7 && dealt){
            placeCard('player', hit, deck[topCard]);
            playerHand.push(deck[topCard]);
            calculateTotal(playerHand, 'player');

            if(calculateTotal(playerHand, 'player') > 21){
                lose()
            }else if(calculateTotal(playerHand, 'player') == 21){
                win()
            }else if(calculateTotal(dealerHand, 'dealer') == 21){
                lose();
            }

            topCard++;
            hit++;
        }
    });

    $('.stand').click(function(){
        placeCard('dealer', '2', deck[3]);
        while(calculateTotal(dealerHand, 'dealer') < 17){
            if(dealerHit < 7){
                placeCard('dealer', dealerHit, deck[topCard]);
                dealerHand.push(deck[topCard]);
                calculateTotal(dealerHand, 'dealer');

                topCard++;
                hit++;
            }
        }

        if(calculateTotal(playerHand, 'player') > 21){
            lose()
        }else{
            if(calculateTotal(playerHand, 'player') > calculateTotal(dealerHand, 'dealer')){
                win()
            }else if(calculateTotal(playerHand, 'player') == calculateTotal(dealerHand, 'dealer')) {
                if(playerHand.length >= dealerHand.length){
                    lose()
                }else{
                    win()
                }
            }else{
                if(calculateTotal(dealerHand, 'dealer') > 21){
                    win()
                }else{
                    lose()
                }
            }
        }
    });

    $('.reset').click(function(){
        reset();
        $('.chip').each(function(){
            if(Number($(this).attr('chipValue')) < cash){
                $(this).removeClass('btn-danger');

                switch(Number($(this).attr('chipValue'))){
                    case 1:
                        $(this).addClass('btn-default');
                        break;
                    case 5:
                        $(this).addClass('btn-info');
                        break;
                    case 10:
                        $(this).addClass('btn-primary');
                        break;
                    case 50:
                        $(this).addClass('btn-warning');
                        break;
                    case 100:
                        $(this).addClass('btn-success');
                        break;
                }
            }
        });
    });
});

function placeCard(who, where, card){
    var suit = card.substring(card.length - 1);
    var number = card.slice(0, -1);

    switch(suit){
        case "D":
            suit = "diamonds";
            break;
        case "H":
            suit = "hearts";
            break;
        case "C":
            suit = "clubs";
            break;
        case "S":
            suit = "spades";
            break;
    }

    switch(number){
        case "K":
            number = "king";
            break;
        case "Q":
            number = "queen";
            break;
        case "J":
            number = "jack";
            break;
        case "A":
            number = "ace";
            break;
    }

    $('.' + who + '-deck .' + where).css({
        'background-image': 'url(assets/' + number + '_of_' + suit + '.png)',
        'background-size': '100% 100%',
        'transition': 'all 1s'
    });
}

function createDeck(){
    var suits = ["S", "D", "H", "C"];
    var cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var deck = [];

    for(var i = 0; i < suits.length; i++){
        for(var j = 0; j < cards.length; j++){
            deck.push(cards[j] + suits[i]);
        }
    }

    return deck;
}

function shuffle(){
    for(var i = 1; i < 1000; i++){
        var card1 = Math.floor(Math.random() * deck.length);
        var card2 = Math.floor(Math.random() * deck.length);
        var temp = deck[card1];
        deck[card1] = deck[card2];
        deck[card2] = temp;
    }
}

function calculateTotal(hand, turn){
    var total = 0;
    for(var i = 0; i < hand.length; i++){
        if(total + 11 > 21 && hand[i].slice(0, -1) === "A"){
            total += Number(hand[i].slice(0, -1).replace("A", "1"));
        }else{
            total += Number(hand[i].slice(0, -1).replace(/J|Q|K/gi, "10").replace("A", "11"));
        }

        console.log(total);
    }


    $('.' + turn + '-number').html(total);
    return total;
}

function reset(){
    deck = createDeck();
    playerHand = [];
    dealerHand = [];
    dealt = false;
    hit = 3;
    dealerHit = 3;

    for(var i = 1; i < 7; i++){
        $('.' + i).css('background-image', '');
    }

    calculateTotal(playerHand, 'player');
    calculateTotal(dealerHand, 'dealer');
    $('.hit').prop('disabled', false);
    $('.deal').prop('disabled', false);
    $('.stand').prop('disabled', false);

    $('.chip').prop('disabled', false);
}

function gameOver(){
    $('.hit').prop('disabled', true);
    $('.deal').prop('disabled', true);
    $('.stand').prop('disabled', true);
}

function win(){
    alert("You win!");
    wins++;
    $('.wins').html(wins);
    gameOver();
    cash = cash + (bet * 2);
    bet = 0;
    $('.cash').html(cash);
    $('.bet').html(0);
}

function lose(){
    alert("You lose!");
    gameOver();
    bet = 0;
    $('.bet').html(0);
}