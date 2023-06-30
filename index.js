var intervalId = window.setInterval(function(){
    lineBlink();
  }, 500);


function lineBlink() {
   if ($("#line").css("display") === "none") {
    $("#line").css({"display": "block"});
   } else {
        $("#line").css({"display": "none"});
   }
}


var max_text = 12

var show = []

// clear
$("#clear").on("click", function(){
    Clear();
})
function Clear () {
    show = [];
    updateScreen();
}


// buttons
$("button:not(#clear, #igual, #del)").on("click", function () {
    var key = this.innerText;
    pressShadow()

    if (key === ","){ 
        show.push(".");
        
    } else{
        show.push(this.innerText);
    }    
    updateScreen();
})


function pressShadow() {
    setInterval(function() {$("button").css({"box-shadow": "2px 2px 5px #131313"})}, 200);
    $("button:focus").css({"box-shadow": "none"})
}

// teclas
var allowed_keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/", "x", "+", "-", "=", ",", ".", "*", "Backspace", "Delete", "Enter"]

$(window).keyup(function(event){
    var key = event.key;
    for (var i in allowed_keys){
        if (key === allowed_keys[i]){
            switch (allowed_keys[i]) {
                case ",":
                    show.push(".");
                    updateScreen();
                    break
            
                case "Enter":
                    fazerConta();
                    break

                case "=":
                    fazerConta();
                    updateScreen();
                    break

                case "Backspace":
                    Del();
                    break

                case "Delete":
                    show = [];
                    updateScreen();
                    break

                case "*":
                    show.push("x");
                    updateScreen();
                    break

                case "/":
                    show.push("÷");
                    updateScreen();
                    break

                default:
                    show.push(allowed_keys[i])
                    updateScreen();
                    break
            }
        }
    }


    
})

// atualizar a tela
function updateScreen() {
    allowed_to_show = true;
    var show_string = "";
    for (var letter in show){
        show_string += show[letter];
        
    }

    $("#display-text").text(show_string);
    if (show_string.length > max_text) {
        alert("Número muito grande.");
        Del();
    }
}

// resultado
var invalid_last_simbols = ["+", "-", "x", "÷"];
$("#igual").on("click", function () {
    var last_element = show[show.length - 1];
    for (var i in invalid_last_simbols){
        if (invalid_last_simbols[i] === last_element){
            alert("Conta invalida");
            
        }
    }
})

var historico = []

// fazer conta
$("#igual").on("click", fazerConta)

function fazerConta () {
    var to_solve = "";
    for (ix in show) {
        if (show[ix] === "x") {
            to_solve += "*"
        } else if (show[ix] === "÷") {
            to_solve += "/"
        } else if (show[ix] === ",") {
            to_solve += "."
        } else {
            to_solve += show[ix];
        }
    }

    const exp = to_solve;
    const findResult = (exp = '') => {
        const digits = '0123456789.';
        const operators = ['+', '-', '*', '/', 'negate'];
        const legend = {
           '+': { pred: 2, func: (a, b) => { return a + b; }, assoc: "left" },
           '-': { pred: 2, func: (a, b) => { return a - b; }, assoc: "left" },
           '*': { pred: 3, func: (a, b) => { return a * b; }, assoc: "left" },
           '/': { pred: 3, func: (a, b) => {
           if (b != 0) { return a / b; } else { return 0; }
        }
        }, assoc: "left",
        'negate': { pred: 4, func: (a) => { return -1 * a; }, assoc: "right" }
     };
     exp = exp.replace(/\s/g, '');
     let operations = [];
     let outputQueue = [];
     let ind = 0;
     let str = '';
     while (ind < exp.length) {
        let ch = exp[ind];
        if (operators.includes(ch)) {
           if (str !== '') {
              outputQueue.push(new Number(str));
              str = '';
           }
           if (ch === '-') {
              if (ind == 0) {
                 ch = 'negate';
              } else {
                 let nextCh = exp[ind+1];
                 let prevCh = exp[ind-1];
                 if ((digits.includes(nextCh) || nextCh === '(' || nextCh === '-') &&
                    (operators.includes(prevCh) || exp[ind-1] === '(')) {
                       ch = 'negate';
                 }
              }
           }
           if (operations.length > 0) {
              let topOper = operations[operations.length - 1];
              while (operations.length > 0 && legend[topOper] &&
              ((legend[ch].assoc === 'left' && legend[ch].pred <= legend[topOper].pred) ||
              (legend[ch].assoc === 'right' && legend[ch].pred < legend[topOper].pred))) {
                 outputQueue.push(operations.pop());
                 topOper = operations[operations.length - 1];
              }
           }
           operations.push(ch);
        } else if (digits.includes(ch)) {
           str += ch
        } else if (ch === '(') {
           operations.push(ch);
        } else if (ch === ')') {
           if (str !== '') {
              outputQueue.push(new Number(str));
              str = '';
           }
           while (operations.length > 0 && operations[operations.length - 1] !== '(') {
              outputQueue.push(operations.pop());
           }
           if (operations.length > 0) { operations.pop(); }
        }
        ind++;
     }
     if (str !== '') { outputQueue.push(new Number(str)); }
        outputQueue = outputQueue.concat(operations.reverse())
        let res = [];
        while (outputQueue.length > 0) {
           let ch = outputQueue.shift();
           if (operators.includes(ch)) {
              let num1, num2, subResult;
              if (ch === 'negate') {
                 res.push(legend[ch].func(res.pop()));
              } else {
                 let [num2, num1] = [res.pop(), res.pop()];
                 res.push(legend[ch].func(num1, num2));
              }
           } else {
              res.push(ch);
           }
        }
        return res.pop().valueOf();
     };

    var resultado = findResult(exp);
    
    var resultado_str = resultado.toString()
    if (resultado_str.length > max_text){
        resultado = ("≅ "+ resultado.toFixed(3))

    }
    show = [];

    show.push(resultado);
    updateScreen();
    updateHistorico(resultado)
}

// del
$("#del").on("click", function(){
    Del();
})

function Del () {
    show.pop(show[show.length - 1]);
    updateScreen();
}

//historico
$("#historico").css({"display": "none"});
var historico_is_open = false
$("#historico-button").on("click", function(){
    if (historico_is_open) {
        
        $("#historico").css({"display": "none"});
        historico_is_open = false;
        
    } else {
        
        $("#historico").css({"display": "flex"});
        historico_is_open = true;
        
    }
})


var li_text = []
function updateHistorico(resultado) {
    li_text.push(resultado);
    for (var i in li_text){
        $("li:eq(" + i + ")").text(li_text[i]);
    }
    if (li_text.length > 5){
        li_text.shift();
    }
    
}


$("#ul-historico > li").on("click", function(){
    show = [];
    show.push(this.innerText);
    updateScreen();
    $("#historico").css({"display": "none"});
    })