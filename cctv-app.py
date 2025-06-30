from flask import Flask, render_template, request, Response
import os
import cv2

app = Flask(__name__)

# 브라우저에게, 캐시에 저장된 자바스크립트 파일의 수명을 0으로 설정하여
# 캐시에 저장된 파일을 사용하지 않도록 지시
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/')
def index():
    return render_template('cctv.html')

@app.route("/video_feed")
def video_feed():
    def gen_frames():
        camera = cv2.VideoCapture(0, cv2.CAP_V4L)  # 요청마다 객체 생성
        if not camera.isOpened():  # 카메라 초기화 안되면
            print("카메라 초기화 실패")
            return
        while True:
            success, frame = camera.read()  # 카메라로부터 이미지를 읽어옴
            if not success:
                print("프레임을 읽지 못했습니다.")
                break
            else:
                # 브라우저가 이해할 수 있게 JPEG같은 표준형식으로 변환
                ret, buffer = cv2.imencode('.jpg', frame)
                if not ret:
                    print("이미지 인코딩 실패")
                    continue
                frame = buffer.tobytes()
                # yield는 데이터를 스트리밍 방식으로 클라이언트에게 보냄
                # content-type은 프레임 데이터의 타입을 jpeg로 지정
                # frame은 인코딩된 프레임 데이터
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        camera.release()

    # Response는 gen_frames()의 결과를 스트리밍 형태로 전달
    # mimetype은 응답 데이터가 스트리밍 형식임을 지정
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
