import time
import paho.mqtt.client as mqtt
import circuit

# 초음파 센서 핀 설정
TRIG_PIN = 20  # GPIO 핀 번호
ECHO_PIN = 16  # GPIO 핀 번호

ip = "localhost"  # 현재 이 브로커는 이 컴퓨터에 설치되어 있음

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.connect(ip, 1883)  # 브로커에 연결
client.loop_start()       # 메시지 루프를 실행하는 스레드 생성

# 병렬적으로 초음파 센서로부터 거리 읽기 및 전송
try:
    while True:
        # 초음파 센서로부터 거리 읽기
        distance = circuit.measure_distance(TRIG_PIN, ECHO_PIN)

        if distance < 20:  # 거리가 20cm 내이면
            circuit.controlLED(1)  # LED를 켠다
        else:
            circuit.controlLED(0)  # LED를 끈다

        client.publish("ultrasonic", distance)  # 토픽으로 거리 전송
        time.sleep(0.00001)

except KeyboardInterrupt:
    print("프로그램 종료")

finally:
    client.loop_stop()  # 메시지 루프를 실행하는 스레드 종료
    client.disconnect()
