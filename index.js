const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth-60;
canvas.height = 400;

let start_background_color = "white";
let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0,0,canvas.width,canvas.height);

//variables
let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

let restore_array = []
let index = -1

let X = 0;
let Y = 0;

function change_color(element){
    draw_color = element.style.background;
}

canvas.addEventListener("mousedown",start,false);
canvas.addEventListener("mousemove",draw,false);

canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

//resize listner
window.addEventListener(
    "resize",
    () => {
        var ctx = canvas.getContext("2d")
        
        ctx.canvas.width = window.innerWidth - 60;
      
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        context.putImageData(restore_array[index],0 ,0);
    },
    false
  );


function start(event){
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop);
    X = event.clientX;
    Y = event.clientY;
    draw(event);
    event.preventDefault();
}

// continous line drawing func
function draw(event){
    if (is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event){
    if (is_drawing){ 
        context.stroke();
        context.closePath();
    }
    event.preventDefault();

    //mouse go outside the canvas
    if (event.type != 'mouseout'){
        restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
        index += 1;
    }
    else {
        if (is_drawing) {
            restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
            index += 1;
        }
    }
    is_drawing = false;
}

function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.width);

    restore_array = [];
    index = -1;
}

function undo_last(){
    if (index <= 0) {
        clear_canvas();
    }else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index],0 ,0);
    }
}



function saveAs(){
    var image = canvas.toDataURL("image/jpg")
    var a = document.getElementById("download")
    a.href = image
}