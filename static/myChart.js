let ctx = null;
let chart = null;

let config = {
    // type은 차트 종류 지정
    type: 'line', // 라인 그래프

    // data는 차트에 출력될 전체 데이터 표현
    data: {
        // labels는 배열로 데이터의 레이블들
        labels: [],

        // datasets 배열로 이 차트에 그려질 모든 데이터 셋 표현, 그래프 1개만 있음
        datasets: [{
            label: '초음파 센서로부터 측정된 실시간 거리',
            backgroundColor: 'blue',
            borderColor: 'rgb(255, 99, 132)',
            data: [], // 각 레이블에 해당하는 데이터
            fill: false, // 채우지 않고 그리기
        }]
    },

    // 차트에 속성 지정
    options: {
        responsive: false, // 크기 조절 금지
        scales: { // x축과 y축 정보
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '시간(초)'
                },
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '거리(cm)'
                },
                // 시연을 위해 y축 범위를 작게 설정함.
                ticks: {
                    min: 0,
                    max: 30,
                },
            }]
        }
    }
};

let LABEL_SIZE = 20; // 차트에 그려지는 데이터의 개수
let tick = 0; // 도착한 데이터의 개수임. tick의 범위는 0에서 99까지만

function drawChart() {
    let canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("canvas 찾을 수 없음");
        return;
    }
    ctx = canvas.getContext('2d');
    chart = new Chart(ctx, config);
    init();
}

function init() { // chart.data.labels의 크기를 LABEL_SIZE로 만들고 0~19까지 레이블 붙이기
    for (let i = 0; i < LABEL_SIZE; i++) {
        chart.data.labels[i] = i;
    }
    chart.update();
}

function addChartData(value) {
    console.log("차트에 추가할 값:" + value);
    let n = chart.data.datasets[0].data.length; // 현재 데이터의 개수
    if (n < LABEL_SIZE) {
        chart.data.datasets[0].data.push(value);
    } else {
        chart.data.datasets[0].data.push(value);
        chart.data.datasets[0].data.shift();
        chart.data.labels.push(tick);
        chart.data.labels.shift();
    }
    tick++;
    tick %= 100;
    chart.update();
}

// 전역 스코프에 등록 (addCharData가 정의된 이후)
window.addCharData = addChartData;

function hideshow() { // 캔버스 보이기 숨기기
    let canvas = document.getElementById('canvas'); // canvas DOM 알아내기
    if (canvas.style.display == "none") // canvas 객체가 보이지 않는다면
        canvas.style.display = "inline-block"; // canvas 객체를 보이게 배치
    else
        canvas.style.display = "none"; // canvas 객체를 보이지 않게 배치
}
