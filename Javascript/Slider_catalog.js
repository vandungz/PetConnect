let list=document.querySelector('.slider .list');
let items=document.querySelectorAll('.slider .list .item');
let dots=document.querySelectorAll('.slider .dots li');
let prev=document.getElementById('prev');
let next=document.getElementById('next');

let active=0;
let lengthItems=items.length-1;

next.onclick=function(){
  if(active+1>lengthItems){
    active=0;
  }else{
    active=active+1;
  }
  reloadSlider();
}

prev.onclick=function(){
  if(active-1<0){
    active=lengthItems;
  }else{
    active=active-1;
  }
  reloadSlider();
}
function reloadSlider(){
  let checkLeft=items[active].offsetLeft;
  list.style.left=-checkLeft+'px';
  let lastActiveDot=document.querySelector('.slider .dots li.active');
  lastActiveDot.classList.remove('active');
  dots[active].classList.add('active');
}
dots.forEach((li,key)=>{
li.addEventListener('click',function(){
  active=key;
  reloadSlider();
})
})

let list2=document.querySelector('.slider2 .list2');
let items2=document.querySelectorAll('.slider2 .list2 .item2');
let dots2=document.querySelectorAll('.slider2 .dots2 li');
let prev2=document.getElementById('prev2');
let next2=document.getElementById('next2');

let active2=0;
let lengthItems2=items2.length-1;

next2.onclick=function(){
  if(active2+1>lengthItems2){
    active2=0;
  }else{
    active2=active2+1;
  }
  reloadSlider2();
}

prev2.onclick=function(){
  if(active2-1<0){
    active2=lengthItems2;
  }else{
    active2=active2-1;
  }
  reloadSlider2();
}
function reloadSlider2(){
  let checkLeft2=items2[active2].offsetLeft;
  list2.style.left=-checkLeft2+'px';
  let lastActiveDot2=document.querySelector('.slider2 .dots2 li.active2');
  lastActiveDot2.classList.remove('active2');
  dots2[active2].classList.add('active2');
}
dots2.forEach((li,key)=>{
li.addEventListener('click',function(){
  active2=key;
  reloadSlider2();
})
})


let list3=document.querySelector('.slider3 .list3');
let items3=document.querySelectorAll('.slider3 .list3 .item3');
let dots3=document.querySelectorAll('.slider3 .dots3 li');
let prev3=document.getElementById('prev3');
let next3=document.getElementById('next3');

let active3=0;
let lengthItems3=items3.length-1;

next3.onclick=function(){
  if(active3+1>lengthItems3){
    active3=0;
  }else{
    active3=active3+1;
  }
  reloadSlider3();
}

prev3.onclick=function(){
  if(active3-1<0){
    active3=lengthItems3;
  }else{
    active3=active3-1;
  }
  reloadSlider3();
}
function reloadSlider3(){
  let checkLeft3=items3[active3].offsetLeft;
  list3.style.left=-checkLeft3+'px';
  let lastActiveDot3=document.querySelector('.slider3 .dots3 li.active3');
  lastActiveDot3.classList.remove('active3');
  dots3[active3].classList.add('active3');
}
dots3.forEach((li,key)=>{
li.addEventListener('click',function(){
  active3=key;
  reloadSlider3();
})
})

let list4=document.querySelector('.slider4 .list4');
let items4=document.querySelectorAll('.slider4 .list4 .item4');
let dots4=document.querySelectorAll('.slider4 .dots4 li');
let prev4=document.getElementById('prev4');
let next4=document.getElementById('next4');

let active4=0;
let lengthItems4=items4.length-1;

next4.onclick=function(){
  if(active4+1>lengthItems4){
    active4=0;
  }else{
    active4=active4+1;
  }
  reloadSlider4();
}

prev4.onclick=function(){
  if(active4-1<0){
    active4=lengthItems4;
  }else{
    active4=active4-1;
  }
  reloadSlider4();
}
function reloadSlider4(){
  let checkLeft4=items4[active4].offsetLeft;
  list4.style.left=-checkLeft4+'px';
  let lastActiveDot4=document.querySelector('.slider4 .dots4 li.active4');
  lastActiveDot4.classList.remove('active4');
  dots4[active4].classList.add('active4');
}
dots4.forEach((li,key)=>{
li.addEventListener('click',function(){
  active4=key;
  reloadSlider4();
})
})

let list5=document.querySelector('.slider5 .list5');
let items5=document.querySelectorAll('.slider5 .list5 .item5');
let dots5=document.querySelectorAll('.slider5 .dots5 li');
let prev5=document.getElementById('prev5');
let next5=document.getElementById('next5');

let active5=0;
let lengthItems5=items5.length-1;

next5.onclick=function(){
  if(active5+1>lengthItems5){
    active5=0;
  }else{
    active5=active5+1;
  }
  reloadSlider5();
}

prev5.onclick=function(){
  if(active5-1<0){
    active5=lengthItems5;
  }else{
    active5=active5-1;
  }
  reloadSlider5();
}
function reloadSlider5(){
  let checkLeft5=items5[active5].offsetLeft;
  list5.style.left=-checkLeft5+'px';
  let lastActiveDot5=document.querySelector('.slider5 .dots5 li.active5');
  lastActiveDot5.classList.remove('active5');
  dots5[active5].classList.add('active5');
}
dots5.forEach((li,key)=>{
li.addEventListener('click',function(){
  active5=key;
  reloadSlider5();
})
})

let list6=document.querySelector('.slider6 .list6');
let items6=document.querySelectorAll('.slider6 .list6 .item6');
let dots6=document.querySelectorAll('.slider6 .dots6 li');
let prev6=document.getElementById('prev6');
let next6=document.getElementById('next6');

let active6=0;
let lengthItems6=items6.length-1;

next6.onclick=function(){
  if(active6+1>lengthItems6){
    active6=0;
  }else{
    active6=active6+1;
  }
  reloadSlider6();
}

prev6.onclick=function(){
  if(active6-1<0){
    active6=lengthItems6;
  }else{
    active6=active6-1;
  }
  reloadSlider6();
}
function reloadSlider6(){
  let checkLeft6=items6[active6].offsetLeft;
  list6.style.left=-checkLeft6+'px';
  let lastActiveDot6=document.querySelector('.slider6 .dots6 li.active6');
  lastActiveDot6.classList.remove('active6');
  dots6[active6].classList.add('active6');
}
dots6.forEach((li,key)=>{
li.addEventListener('click',function(){
  active6=key;
  reloadSlider6();
})
})

let list7=document.querySelector('.slider7 .list7');
let items7=document.querySelectorAll('.slider7 .list7 .item7');
let dots7=document.querySelectorAll('.slider7 .dots7 li');
let prev7=document.getElementById('prev7');
let next7=document.getElementById('next7');

let active7=0;
let lengthItems7=items7.length-1;

next7.onclick=function(){
  if(active7+1>lengthItems7){
    active7=0;
  }else{
    active7=active7+1;
  }
  reloadSlider7();
}

prev7.onclick=function(){
  if(active7-1<0){
    active7=lengthItems7;
  }else{
    active7=active7-1;
  }
  reloadSlider7();
}
function reloadSlider7(){
  let checkLeft7=items7[active7].offsetLeft;
  list7.style.left=-checkLeft7+'px';
  let lastActiveDot7=document.querySelector('.slider7 .dots7 li.active7');
  lastActiveDot7.classList.remove('active7');
  dots7[active7].classList.add('active7');
}
dots7.forEach((li,key)=>{
li.addEventListener('click',function(){
  active7=key;
  reloadSlider7();
})
})

let list8=document.querySelector('.slider8 .list8');
let items8=document.querySelectorAll('.slider8 .list8 .item8');
let dots8=document.querySelectorAll('.slider8 .dots8 li');
let prev8=document.getElementById('prev8');
let next8=document.getElementById('next8');

let active8=0;
let lengthItems8=items8.length-1;

next8.onclick=function(){
  if(active8+1>lengthItems8){
    active8=0;
  }else{
    active8=active8+1;
  }
  reloadSlider8();
}

prev8.onclick=function(){
  if(active8-1<0){
    active8=lengthItems8;
  }else{
    active8=active8-1;
  }
  reloadSlider8();
}
function reloadSlider8(){
  let checkLeft8=items8[active8].offsetLeft;
  list8.style.left=-checkLeft8+'px';
  let lastActiveDot8=document.querySelector('.slider8 .dots8 li.active8');
  lastActiveDot8.classList.remove('active8');
  dots8[active8].classList.add('active8');
}
dots8.forEach((li,key)=>{
li.addEventListener('click',function(){
  active8=key;
  reloadSlider8();
})
})

let list9=document.querySelector('.slider9 .list9');
let items9=document.querySelectorAll('.slider9 .list9 .item9');
let dots9=document.querySelectorAll('.slider9 .dots9 li');
let prev9=document.getElementById('prev9');
let next9=document.getElementById('next9');

let active9=0;
let lengthItems9=items9.length-1;

next9.onclick=function(){
  if(active9+1>lengthItems9){
    active9=0;
  }else{
    active9=active9+1;
  }
  reloadSlider9();
}

prev9.onclick=function(){
  if(active9-1<0){
    active9=lengthItems9;
  }else{
    active9=active9-1;
  }
  reloadSlider9();
}
function reloadSlider9(){
  let checkLeft9=items9[active9].offsetLeft;
  list9.style.left=-checkLeft9+'px';
  let lastActiveDot9=document.querySelector('.slider9 .dots9 li.active9');
  lastActiveDot9.classList.remove('active9');
  dots9[active9].classList.add('active9');
}
dots9.forEach((li,key)=>{
li.addEventListener('click',function(){
  active9=key;
  reloadSlider9();
})
})