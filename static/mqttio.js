let client = null; // mqtt 클라이언트의 역할을 하는 Client 변수를 가리키는 전역변수
let connectionFlag = false; // 연결 상태이면 true

// 사용자 랜덤 생성
const CLIENT_ID = "client-" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);

function connect() { // 브로커에 접속하는 함수
    if (connectionFlag == true)
        return; // 현재 연결 상태이므로 다시 연결하지 않음

    // 사용자가 입력한 브로커의 IP 주소와 포트 번호 알아내기
    let broker = document.getElementById("broker").value; // 브로커의 ip주소
    let port = 9001; // mosquitto를 웹소켓으로 접속할 포트 번호

    // id가 message인 DIV 객체에 포트 번호 출력
    document.getElementById("messages").innerHTML += '<span>브로커에 접속 : 포트 ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>사용자 ID : ' + CLIENT_ID + '</span><br/>';

    // mqtt 메시지 전송 기능을 모두 가진 paho client 객체 생성
    client = new Paho.MQTT.Client(broker, Number(port), CLIENT_ID);

    // client 객체에 콜백 함수 등록 및 연결
    client.onConnectionLost = onConnectionLost; // 접속끊김 시 onConnectionLost()
    client.onMessageArrived = onMessageArrived; // 메시지 도착 시 onMessageArrived()

    // client 객체에게 브로커에 접속 지시
    client.connect({
        onSuccess: onConnect // 브로커로부터 접속 응답 시, onConnect()
    });
}

// 브로커로의 접속이 성공할 때 호출되는 함수
function onConnect() {
    document.getElementById("messages").innerHTML += '<span>connected</span><br/>';
    connectionFlag = true; // 연결 상태로 설정
}

function subscribe(topic) {
    if (connectionFlag != true) { // 연결되지 않은 경우
        alert("연결되지 않았음");
        return false;
    }
    // 구독 신청하였음을 <div> 영역에 출력
    document.getElementById("messages").innerHTML += '<span>구독신청 : 토픽 ' + topic + '</span><br/>';
    client.subscribe(topic); // 브로커에 구독 신청
    return true;
}

function publish(topic, msg) {
    if (connectionFlag != true) { // 연결되지 않은 경우
        alert("연결되지 않았음");
        return false;
    }
    client.send(topic, msg, 0, false);
    return true;
}

function unsubscribe(topic) {
    if (connectionFlag != true)
        return; // 연결되지 않은 경우

    // 구독 신청 취소를 div 영역에 출력
    document.getElementById("messages").innerHTML += '<span>구독신청취소 : 토픽 ' + topic + '</span><br/>';
    client.unsubscribe(topic, null); // 브로커에 구독 신청 취소
}

// 접속이 끊어졌을 때 호출되는 함수
function onConnectionLost(responseObject) { // responseObject는 응답 패킷
    document.getElementById("messages").innerHTML += '<span>오류 : 접속 끊어짐</span><br/>';
    if (responseObject.errorCode != 0) {
        document.getElementById("messages").innerHTML += '<span>오류 : ' + responseObject.errorMessage + '</span><br/>';
    }
    connectionFlag = false; // 연결 되지 않은 상태로 설정
}

// 메시지가 도착할 때 호출되는 함수
function onMessageArrived(msg) { // 매개변수 msg는 도착한 mqtt메시지를 담고있는 객체
    console.log("onMessageArrived : " + msg.payloadString);
    // addCharData 함수가 정의되어 있는지 확인
    if (typeof addCharData === "function") {
        addCharData(parseFloat(msg.payloadString));
    } else {
        console.error("addCharData 함수가 정의되지 않았습니다.");
    }
}

// disconnection 버튼이 선택되었을 때 호출되는 함수
function disconnect() {
    if (connectionFlag == false)
        return; // 연결되지 않은 상태이면 그냥 리턴

    // 켜진 led 끄기
    if (document.getElementById("ledOn").checked == true) {
        client.send('led', "0", 0, false); // led를 끄도록 메시지 전송
        document.getElementById("ledOff").checked = true;
    }
    client.disconnect(); // 브로커와 접속 해제
    document.getElementById("messages").innerHTML += '<span>연결종료</span><br/>';
    connectionFlag = false; // 연결되지 않은 상태로 설정
}
