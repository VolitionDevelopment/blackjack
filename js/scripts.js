/**
 * Created by Jackson on 7/26/16.
 */

var deck = createDeck();
var hit = 3;
var dealerHit = 3;
var wins = 0;
var topCard = 4;

var playerHand = [];
var splitHand = [];
var dealerHand = [];

var bet = 0;
var cash = 300;

var hitHand = 'player';

$(document).ready(function(){
    $('.chip').each(function(){
        if(Number($(this).attr('chipValue')) > cash){
            $(this).removeClass('btn-success');
            $(this).addClass('btn-danger');
        }
    });

    $('.split').click(function(){
        $('.splitRow').removeClass('hidden');

        $('.player-deck .' + 2).css('background-image', '');
        placeCard('split', 1, deck[2]);
        $('.split').attr('disabled', true);

        splitHand[0] = playerHand[1];
        playerHand.splice(1, 1);

        console.log(playerHand);
        console.log(splitHand);

        calculateTotal(playerHand, 'player');
        calculateTotal(splitHand, 'split');


        hit--;

    });

    $('.chip').click(function(){
        var val = Number($(this).attr('chipValue'));

        if(val <= cash){
            bet += val;
            cash -= val;

            $('.cash').html(cash);
            $('.bet').html(bet);
        }

        $('.deal').prop('disabled', false);

        $('.chip').each(function(){
            if(Number($(this).attr('chipValue')) > cash){
                $(this).removeClass('btn-success');
                $(this).addClass('btn-danger');
            }
        });
    });

    $('.deal').click(function(){
        $('.chip').prop('disabled', true);
        $('.deal').prop('disabled', true);
        $('.hit').prop('disabled', false);
        $('.stand').prop('disabled', false);

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

        if(deck[0].slice(0, -1) == deck[2].slice(0, -1)){
            $('.split').attr('disabled', false);
        }

        if(calculateTotal(playerHand, 'player') > 21){
            lose()
        }else if(calculateTotal(dealerHand, 'dealer') > 21){
            win()
        }else if(calculateTotal(playerHand, 'player') == 21){
            win()
        }else if(calculateTotal(dealerHand, 'dealer') == 21){
            lose()
        }
    });

    $('.hit').click(function(){
        placeCard(hitHand, hit, deck[topCard]);

        if(hitHand === 'player'){
            playerHand.push(deck[topCard]);
        }else{
            splitHand.push(deck[topCard]);
        }
        calculateTotal(playerHand, 'player');
        calculateTotal(splitHand, 'split');

        if(calculateTotal(playerHand, 'player') > 21){
            if(hitHand == 'player'){
                hitHand = 'split';
            }else{
                lose();
            }
        }else if(calculateTotal(playerHand, 'player') == 21){
            if(hitHand == 'player'){
                hitHand = 'split';
            }else{
                win();
            }
        }else if(calculateTotal(dealerHand, 'dealer') == 21){
            if(hitHand == 'player'){
                hitHand = 'split';
            }else{
                lose();
            }
        }

        topCard++;
        hit++;
    });

    $('.stand').click(function(){
        placeCard('dealer', '2', deck[3]);
        if(hitHand == 'split'){
            while(calculateTotal(dealerHand, 'dealer') < 17){
                if(dealerHit < 7){
                    placeCard('dealer', dealerHit, deck[topCard]);
                    dealerHand.push(deck[topCard]);
                    calculateTotal(dealerHand, 'dealer');

                    topCard++;
                    hit++;
                }
            }
        }

        if(calculateTotal(playerHand, hitHand) > 21){
            if(hitHand == 'player'){
                hitHand = 'split';
            }else{
                lose();
            }
        }else{
            if(calculateTotal(playerHand, hitHand) > calculateTotal(dealerHand, 'dealer')){
                if(hitHand == 'player'){
                    hitHand = 'split';
                }else{
                    win();
                }
            }else if(calculateTotal(playerHand, hitHand) == calculateTotal(dealerHand, 'dealer')) {
                if(playerHand.length >= dealerHand.length){
                    if(hitHand == 'player'){
                        hitHand = 'split';
                    }else{
                        lose();
                    }
                }else{
                    if(hitHand == 'player'){
                        hitHand = 'split';
                    }else{
                        win();
                    }
                }
            }else{
                if(calculateTotal(dealerHand, 'dealer') > 21){
                    if(hitHand == 'player'){
                        hitHand = 'split';
                    }else{
                        win();
                    }
                }else{
                    if(hitHand == 'player'){
                        hitHand = 'split';
                    }else{
                        lose();
                    }
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

    deck[0] = "7H";
    deck[2] = "7D";
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
    hit = 3;
    dealerHit = 3;

    for(var i = 1; i < 7; i++){
        $('.' + i).css('background-image', '');
    }

    calculateTotal(playerHand, 'player');
    calculateTotal(dealerHand, 'dealer');

    $('.chip').prop('disabled', false);
    $('.splitRow').addClass('hidden');
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

