let speedData = [];
let timeLabels = [];
const maxDataPoints = 30;

const ctx = document.getElementById("speedChart").getContext("2d");
const speedChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: timeLabels,
        datasets: [{
            label: "인터넷 속도 (Mbps)",
            data: speedData,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            borderWidth: 2,
            tension: 0.3,
        }],
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "시간"
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Mbps"
                }
            }
        }
    }
});

async function measureSpeed() {
    const testFile = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"; // 작은 파일 사용
    const fileSize = 250 * 1024; // 약 250KB
    const startTime = performance.now();
    try {
        const response = await fetch(testFile, { cache: "no-store" });
        const endTime = performance.now();
        if (!response.ok) throw new Error("파일을 가져올 수 없습니다.");
        const timeTaken = (endTime - startTime) / 1000; // 초 단위 변환
        const speedMbps = (fileSize / timeTaken / 1024 / 1024 * 8).toFixed(2); // Mbps 변환
        document.querySelector(".speed").textContent = `${speedMbps} Mbps`;
        updateChart(parseFloat(speedMbps));
    } catch (error) {
        console.error("인터넷 속도 측정 오류:", error);
        document.querySelector(".speed").textContent = "측정 실패";
        updateChart(0);
    }
}

function updateChart(speed) {
    const now = new Date().toLocaleTimeString();
    if (speedData.length >= maxDataPoints) {
        speedData.shift();
        timeLabels.shift();
    }
    speedData.push(speed);
    timeLabels.push(now);
    speedChart.update();
}

function updateSpeed() {
    measureSpeed();
}

updateSpeed();
setInterval(updateSpeed, 1000);