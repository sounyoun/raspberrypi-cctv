import time
import RPi.GPIO as GPIO
import cv2

# GPIO 핀 설정
trig = 20  # GPIO20
echo = 16  # GPIO16
led1 = 6   # GPIO6
led2 = 5   # GPIO5

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT)
GPIO.setup(echo, GPIO.IN)
GPIO.setup(led1, GPIO.OUT)
GPIO.setup(led2, GPIO.OUT)

# LED를 켜고 끄는 함수
def controlLED(on_off):
    GPIO.output(led1, on_off)
    GPIO.output(led2, on_off)

# 초음파 센서를 제어하여 거리 측정 함수
def measure_distance(trig, echo):
    time.sleep(0.2)              # 센서 준비 시간
    GPIO.output(trig, True)      # 초음파 발사 시작
    time.sleep(0.00001)          # 10μs 유지
    GPIO.output(trig, False)     # 초음파 발사 종료

    while GPIO.input(echo) == 0:
        pulse_start = time.time()

    while GPIO.input(echo) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17000  # cm 계산
    return round(distance, 2)          # 소수점 2자리로 반올림 

# GPIO 핀 설정
trig = 20 # GPIO20
echo = 16 # GPIO16
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT) # GPIO20 핀을 출력으로 설정
GPIO.setup(echo, GPIO.IN) # GPIO16 핀을 입력으로 설정

# LED 핀 설정
led1 = 6 # GPIO6
led2 = 5 # GPIO5
GPIO.setup(led1, GPIO.OUT)
GPIO.setup(led2, GPIO.OUT)