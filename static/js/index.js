var socket = io();
var currentUser;

/* 접속 되었을 때 실행 */
socket.on('connect', function(){
    // var input = document.getElementById("test");
    // input.value = '접속 됨';
    /* 이름을 입력받고 */
    var name = prompt("반갑습니다!", '');

    /* 이름이 빈 칸인 경우 */
    if(!name){
        name = '익명';
    }
    currentUser = name;

    /* 서버에 새로운 유저가 왔다고 알림 */
    socket.emit('newUser', name);
})

socket.on('update', function(data){
    console.log(`${data.name} : ${data.message}`);
    
    var ul = document.getElementById("chat_msgs");

    if(data.type == 'disconnect'){
        var li = document.createElement("li");
        var div = document.createElement("div");
        div.className = "system_message";
        div.style.backgroundColor = "red";
        div.innerHTML = data.message;
        li.appendChild(div);
        ul.appendChild(li);
    }
    else if(data.type == 'connect'){
        var li = document.createElement("li");
        var div = document.createElement("div");
        div.className = "system_message";
        div.innerHTML = data.message;
        li.appendChild(div);
        ul.appendChild(li);
    }
    else if(data.type == 'message'){
        var li = document.createElement("li");
        li.className = "incoming-message message";

        var i = document.createElement("i");
        i.id = "profile_img";
        i.className = "far fa-user-circle";

        var div = document.createElement("div");
        div.className = "message__content";

        var span1 = document.createElement("span");
        span1.id = "msg_author";
        span1.className = "message__author";
        span1.innerHTML = data.name;

        var span2 = document.createElement("span");
        span2.id = "incoming_msg";
        span2.className = "message__bubble";
        span2.innerHTML = data.message;

        div.appendChild(span1);
        div.appendChild(span2);
        li.appendChild(i);
        li.appendChild(div);
        ul.appendChild(li);
    }
})

/* 메시지 전송 함수 */
function send(){
    // 입력되어있는 데이터 가져오기
    var message = document.getElementById("chat_write").value;

    // 가져왔으니 데이터 빈 값으로 변경
    document.getElementById("chat_write").value = '';

    var ul = document.getElementById("chat_msgs");
    var li = document.createElement("li");
    li.className = "sent-message message";

    var div = document.createElement("div");
    div.className = "message__content";

    var span = document.createElement("span");
    span.id = "sent_msg";
    span.className = "message__bubble";
    span.innerHTML = message;

    div.appendChild(span);
    li.appendChild(div);
    ul.appendChild(li);

    // 서버로 데이터와 함께 'send' 이벤트 전달 
    socket.emit('message', {type : 'message', message : message});
}

/* 시계 코드 */
function clock() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var nowDate = date.getDate();
    var day = date.getDay();
    var week = ['일', '월', '화', '수', '목', '금', '토'];

    var dateStr = year + "년 " + month + "월 " + nowDate + "일 " + week[day] + "요일"; 

    document.getElementById("chat_timestamp").innerHTML = dateStr;

    var hours = date.getHours();
    var minutes = date.getMinutes();

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    var clockStr = hours + ":" + minutes;

    document.getElementById("status-bar_clock").innerHTML = clockStr;
    console.log("현재시간 : " + clockStr);
}

function init() {
    clock();
    setInterval(clock, 1000);
}