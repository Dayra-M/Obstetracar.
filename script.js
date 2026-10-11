const rounds = [
 {name:"Básica", time:35, questions:[
  {q:"¿Cuánto dura aproximadamente un embarazo a término?",a:["28–32 semanas","37–42 semanas","20–24 semanas","44–48 semanas"],c:1,e:"El embarazo a término se sitúa alrededor de las 37 a 42 semanas, según la clasificación utilizada."},
  {q:"¿Qué instrumento se usa para auscultar la frecuencia cardiaca fetal en la atención habitual?",a:["Estetoscopio de Pinard o Doppler fetal","Otoscopio","Glucómetro","Espéculo"],c:0,e:"El Pinard o el Doppler fetal permiten auscultar la frecuencia cardiaca fetal."},
  {q:"¿Qué hormona detectan habitualmente las pruebas de embarazo?",a:["Insulina","hCG","Prolactina","Oxitocina"],c:1,e:"Las pruebas detectan la gonadotropina coriónica humana (hCG)."},
  {q:"¿Cuál es una señal de alarma durante el embarazo?",a:["Hambre antes del almuerzo","Sangrado vaginal","Sueño después de comer","Aumento gradual del abdomen"],c:1,e:"El sangrado vaginal requiere valoración sanitaria, especialmente durante el embarazo."},
  {q:"¿Qué órgano conecta a la madre y al feto para el intercambio de sustancias?",a:["Placenta","Vesícula","Apéndice","Tiroides"],c:0,e:"La placenta participa en el intercambio de gases, nutrientes y productos de desecho."}
 ]},
 {name:"Media",time:30,questions:[
  {q:"¿Cuál es el propósito principal del partograma?",a:["Calcular el peso materno","Vigilar la evolución del trabajo de parto","Diagnosticar anemia","Determinar el grupo sanguíneo"],c:1,e:"Permite registrar y vigilar la evolución del trabajo de parto y el estado materno-fetal."},
  {q:"¿Qué estructura se evalúa para estimar la dilatación cervical?",a:["Cuello uterino","Fondo gástrico","Vejiga","Ovario"],c:0,e:"La dilatación se refiere a la apertura del cuello uterino."},
  {q:"¿Qué significa la presentación cefálica?",a:["El feto se presenta con las nalgas","La cabeza fetal se orienta hacia la pelvis","El feto está transversal siempre","La placenta cubre el cuello uterino"],c:1,e:"En la presentación cefálica, la cabeza fetal es la parte que se presenta hacia la pelvis."},
  {q:"¿Qué parámetro se controla para valorar el bienestar fetal durante el trabajo de parto?",a:["Frecuencia cardiaca fetal","Color de ojos maternos","Talla del padre","Grupo de alimentos favorito"],c:0,e:"La frecuencia cardiaca fetal es uno de los parámetros importantes de vigilancia."},
  {q:"¿Qué vitamina se recomienda antes de la concepción y al inicio del embarazo para reducir defectos del tubo neural?",a:["Vitamina C únicamente","Ácido fólico","Vitamina K únicamente","Vitamina D en dosis altas para todas"],c:1,e:"El ácido fólico, según las recomendaciones sanitarias, reduce el riesgo de defectos del tubo neural."}
 ]},
 {name:"Difícil",time:25,questions:[
  {q:"Gestante con hipertensión grave y signos de preeclampsia: ¿qué fármaco se usa para prevenir o tratar convulsiones?",a:["Sulfato de magnesio","Amoxicilina","Hierro oral","Loratadina"],c:0,e:"El sulfato de magnesio se utiliza para la prevención y el tratamiento de convulsiones eclámpticas, bajo protocolo y vigilancia."},
  {q:"¿Qué hallazgo define principalmente la hemorragia posparto?",a:["Pérdida sanguínea excesiva tras el nacimiento, evaluada clínicamente","Cualquier sudoración","Hambre durante el puerperio","Dolor leve de espalda"],c:0,e:"La hemorragia posparto se reconoce por la pérdida excesiva de sangre y el estado clínico; los criterios exactos dependen de la guía."},
  {q:"En una gestante con sospecha de prolapso del cordón umbilical, ¿qué prioridad corresponde?",a:["Esperar en casa","Solicitar atención obstétrica urgente y activar el protocolo","Indicar ejercicio","Retrasar la evaluación"],c:1,e:"Es una emergencia obstétrica que requiere actuación inmediata del equipo entrenado."},
  {q:"¿Qué anticuerpo se relaciona con la prevención de la aloinmunización Rh en gestantes Rh negativas no sensibilizadas?",a:["Inmunoglobulina anti-D","IgE anti-A","Insulina","Albúmina"],c:0,e:"La inmunoglobulina anti-D se indica en situaciones definidas por los protocolos para prevenir la sensibilización Rh."},
  {q:"¿Qué caracteriza a la atonía uterina posparto?",a:["El útero no se contrae adecuadamente y puede producir hemorragia","Contracción uterina sostenida normal","Aumento normal del apetito","Dilatación cervical antes del parto"],c:0,e:"La falta de contracción uterina adecuada es una causa importante de hemorragia posparto."}
 ]}
];
let round=0, qi=0, timeLeft=90, speed=60, score=0, progress=0, lane=1, running=false, timer=null, obstacleTimer=null, obstacles=[], answered=false, playerName="";
const $=id=>document.getElementById(id);
const lanePositions=[28,50,72];
function updateHUD(){ $("time").textContent=Math.max(0,Math.ceil(timeLeft))+" s";$("speed").textContent=Math.round(speed)+" km/h";$("score").textContent=score;$("progress").textContent=Math.min(100,Math.floor(progress))+"%"; }
function setLane(){ $("playerCar").style.left=`calc(${lanePositions[lane]}% - 21px)`; }
function startGame(){
 playerName=$("playerName").value.trim(); round=0;qi=0;timeLeft=90;speed=60;score=0;progress=0;lane=1;obstacles=[];running=true;
 $("start").classList.add("hide");$("ending").classList.add("hide");$("game").classList.remove("hide");$("obstacles").innerHTML="";setLane();updateHUD();showQuestion();updateRound();
 clearInterval(timer);clearInterval(obstacleTimer);
 timer=setInterval(()=>{if(!running)return;timeLeft-=1;progress+=speed/600;if(progress>=100){winGame();return}if(timeLeft<=0){loseGame()}updateHUD()},1000);
 obstacleTimer=setInterval(spawnObstacle,1250);
}
function updateRound(){for(let i=0;i<3;i++)$("round"+i).classList.toggle("active",i===round);$("trackRound").textContent=`Ronda ${rounds[round].name.toLowerCase()}`;}
function showQuestion(){
 answered=false;const q=rounds[round].questions[qi];$("question").textContent=q.q;$("answers").innerHTML="";$("feedback").textContent="";$("questionCount").textContent=`Ronda ${round+1} · Pregunta ${qi+1} de ${rounds[round].questions.length}`;
 q.a.forEach((a,i)=>{const b=document.createElement("button");b.textContent=String.fromCharCode(65+i)+". "+a;b.onclick=()=>answer(i);$("answers").appendChild(b)});
}
function answer(i){
 if(answered||!running)return;answered=true;const q=rounds[round].questions[qi];[...$("answers").children].forEach((b,j)=>{b.disabled=true;if(j===q.c)b.classList.add("good")});
 if(i===q.c){speed=Math.min(145,speed+16);score+=100*(round+1);timeLeft=Math.min(100,timeLeft+2);$("feedback").textContent="✅ ¡Correcto! + velocidad y +2 s. "+q.e;$("trackMsg").textContent="¡Excelente! ¡Acelera hacia el hospital!";}
 else{speed=Math.max(28,speed-13);timeLeft=Math.max(0,timeLeft-5);$("feedback").textContent="❌ No exactamente. − velocidad y −5 s. "+q.e;$("trackMsg").textContent="¡Cuidado! Baja la velocidad y sigue concentrada.";}
 updateHUD();
 setTimeout(()=>{if(!running)return;qi++;if(qi>=rounds[round].questions.length){round++;qi=0;if(round>=3){progress=Math.max(progress,100);winGame();return}timeLeft=Math.min(100,timeLeft+8);speed=Math.min(145,speed+8);updateRound()}showQuestion()},2600);
}
function spawnObstacle(){
 if(!running)return;const el=document.createElement("div");el.className="car obstacle";const l=Math.floor(Math.random()*3);el.style.left=`calc(${lanePositions[l]}% - 21px)`;el.style.top="-75px";$("obstacles").appendChild(el);
 const ob={el,lane:l,y:-75,hit:false};obstacles.push(ob);
}
function animate(){
 if(running){
  const track=$("track").getBoundingClientRect();const playerTop=track.height-84;
  obstacles=obstacles.filter(o=>{o.y+=2.4+speed/35;o.el.style.top=o.y+"px";if(!o.hit&&o.lane===lane&&o.y>playerTop-45&&o.y<playerTop+42){o.hit=true;speed=Math.max(25,speed-18);timeLeft=Math.max(0,timeLeft-7);score=Math.max(0,score-50);$("trackMsg").textContent="💥 ¡Choque! −7 segundos. ¡Retoma la ruta!";o.el.remove();updateHUD();return false}if(o.y>track.height+5){o.el.remove();return false}return true});
 }
 requestAnimationFrame(animate);
}
function end(title,text){running=false;clearInterval(timer);clearInterval(obstacleTimer);$("game").classList.add("hide");$("ending").classList.remove("hide");$("endTitle").textContent=title;$("endText").textContent=text;$("endScore").textContent=`Puntaje final: ${score} · Progreso: ${Math.min(100,Math.floor(progress))}%`;}
function winGame(){progress=100;updateHUD();end("🏥 ¡Llegaste al hospital!",`${playerName?playerName+", ":""}¡Misión completada! Superaste las tres rondas y llegaste a tiempo. ¡Buen trabajo, futura obstetra!`);}
function loseGame(){end("⏰ ¡Se acabó el tiempo!",`${playerName?playerName+", ":""}la misión terminó antes de llegar al hospital. Repasa las preguntas y vuelve a intentarlo.`);}
$("startBtn").onclick=startGame;$("againBtn").onclick=()=>{$("ending").classList.add("hide");$("start").classList.remove("hide")};
$("leftBtn").onclick=()=>{if(running){lane=Math.max(0,lane-1);setLane()}};
$("rightBtn").onclick=()=>{if(running){lane=Math.min(2,lane+1);setLane()}};
document.addEventListener("keydown",e=>{if(!running)return;if(e.key==="ArrowLeft"){lane=Math.max(0,lane-1);setLane()}if(e.key==="ArrowRight"){lane=Math.min(2,lane+1);setLane()}});
animate();
  
