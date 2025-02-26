// totalFloors에 불러오는 층 수는 넣어주시면 됩니다.
const totalFloors = [
  "B2",
  "B1",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
];

// cuurentFloor에 현재 층수를 넣어주시면 됩니다다
let currentFloor = "B1";
// destinationFloor에 도착지를 넣어주시면 됩니다다
let destinationFloor = "B2";

const floorsContainer = document.getElementById("floors");
const floorsWrapper = document.getElementById("floors-container");
const upArrow = document.getElementById("up-arrow");
const downArrow = document.getElementById("down-arrow");
const currentFloorInfo = document.querySelector(".current-floor-info");
const destinationFloorInfo = document.querySelector(".destination-floor-info");

// 배열을 정렬합니다.
function sortFloors(floors) {
  return floors.sort((a, b) => {
    const aVal =
      typeof a === "string" && a.startsWith("B")
        ? -parseInt(a.slice(1))
        : parseInt(a);
    const bVal =
      typeof b === "string" && b.startsWith("B")
        ? -parseInt(b.slice(1))
        : parseInt(b);
    return bVal - aVal;
  });
}
// floors에 층수를 나열합니다
function renderFloors() {
  floorsContainer.innerHTML = "";
  const sortedFloors = sortFloors([...totalFloors]);

  sortedFloors.forEach((floor, index) => {
    const floorDiv = document.createElement("div");
    floorDiv.classList.add("floor");
    floorDiv.textContent = `${floor}`;
    floorDiv.style.height = "30px";
    floorDiv.style.minHeight = "30px";

    if (index === 0) {
      floorDiv.classList.add("first");
    }
    if (index === sortedFloors.length - 1) {
      floorDiv.classList.add("last");
    }

    if (floor === currentFloor) {
      floorDiv.classList.add("active");
    }
    if (floor === destinationFloor) {
      floorDiv.classList.add("clicked");
    }

    floorsContainer.appendChild(floorDiv);
  });

  // 모든 층(floor) 요소 가져오기
  const floorElements = document.querySelectorAll(".floor");

  // 각 층에 클릭 이벤트 추가
  floorElements.forEach((floorElement) => {
    floorElement.addEventListener("click", () => {
      // 기존에 click 클래스가 있는 요소에서 제거
      document
        .querySelectorAll(".floor.click")
        .forEach((el) => el.classList.remove("click"));

      // 현재 클릭한 요소에 click 클래스 추가
      floorElement.classList.add("click");
      console.log("Clicked floor:", floorElement.textContent);
    });
  });

  updateArrows();
  updateFloorVisibility();
}

// 최상층 또는 최하층에 도착 시 toggle로 적용시켰십니다.
function updateArrows() {
  const scrollTop = floorsContainer.scrollTop;
  const scrollHeight = floorsContainer.scrollHeight;
  const clientHeight = floorsContainer.clientHeight;

  const isContentAbove = scrollTop > 0;
  const isContentBelow = scrollTop + clientHeight < scrollHeight - 1;

  upArrow.classList.toggle("show", isContentAbove);
  downArrow.classList.toggle("show", isContentBelow);
}

// 최상층 최하층과 반정도를 계싼해서 +15 -15씩을 넣은겁니다.
function isElementFullyVisible(element, container) {
  if (!element) return false;

  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return (
    elementRect.top + 30 >= containerRect.top &&
    elementRect.bottom - 30 <= containerRect.bottom
  );
}
// 엘리먼트의 위치값을 구하고 그 위치값이 container보다 높거나 낮아지면 문구가 나오도록 하는겁니다.
function updateFloorVisibility() {
  const currentFloorElement = document.querySelector(".floor.active");
  const destinationFloorElement = document.querySelector(".floor.clicked");
  const containerRect = floorsContainer.getBoundingClientRect();

  // 현재층 정보 업데이트
  if (currentFloorElement) {
    const currentElementRect = currentFloorElement.getBoundingClientRect();
    const isCurrentFloorVisible = isElementFullyVisible(
      currentFloorElement,
      floorsContainer
    );

    if (!isCurrentFloorVisible) {
      currentFloorInfo.classList.add("show-info");
      currentFloorInfo.textContent = `현재층`;
      document.querySelector(".active").classList.add("none");

      // 컨테이너 상단보다 위에 있는지 확인
      if (currentElementRect.bottom < containerRect.top) {
        // 상단에서 사라진 경우
        currentFloorInfo.style.top = "2px";
        currentFloorInfo.style.bottom = "unset";
      } else if (currentElementRect.top > containerRect.bottom) {
        // 하단에서 사라진 경우
        currentFloorInfo.style.bottom = "2px";
        currentFloorInfo.style.top = "unset";
      }
    } else {
      document.querySelector(".active").classList.remove("none");
      currentFloorInfo.classList.remove("show-info");
    }
  }

  // 도착지 정보 업데이트
  if (destinationFloorElement) {
    const destinationElementRect =
      destinationFloorElement.getBoundingClientRect();
    const isDestinationFloorVisible = isElementFullyVisible(
      destinationFloorElement,
      floorsContainer
    );

    if (!isDestinationFloorVisible) {
      destinationFloorInfo.classList.add("show-info");
      destinationFloorInfo.textContent = `도착지`;
      document.querySelector(".clicked").classList.add("none");

      // 컨테이너 상단보다 위에 있는지 확인
      if (destinationElementRect.bottom < containerRect.top) {
        // 상단에서 사라진 경우
        destinationFloorInfo.style.top = "2px";
        destinationFloorInfo.style.bottom = "unset";
      } else if (destinationElementRect.top > containerRect.bottom) {
        // 하단에서 사라진 경우
        destinationFloorInfo.style.bottom = "2px";
        destinationFloorInfo.style.top = "unset";
      }
    } else {
      destinationFloorInfo.classList.remove("show-info");
      document.querySelector(".clicked").classList.remove("none");
    }
  } else {
    destinationFloorInfo.classList.remove("show-info");
  }

  // 현재층과 도착지가 모두 보이지 않을 때 위치 조정
  if (
    currentFloorElement &&
    destinationFloorElement &&
    !isElementFullyVisible(currentFloorElement, floorsContainer) &&
    !isElementFullyVisible(destinationFloorElement, floorsContainer)
  ) {
    const currentElementRect = currentFloorElement.getBoundingClientRect();
    const destinationElementRect =
      destinationFloorElement.getBoundingClientRect();

    // 두 요소가 모두 상단에 있는 경우
    if (
      currentElementRect.top < containerRect.top &&
      destinationElementRect.top < containerRect.top
    ) {
      // 위치 조정 (더 위에 있는 요소가 2px, 다른 요소는 27px)
      if (currentElementRect.bottom < destinationElementRect.bottom) {
        currentFloorInfo.style.top = "2px";
        destinationFloorInfo.style.top = "27px";
      } else {
        destinationFloorInfo.style.top = "2px";
        currentFloorInfo.style.top = "27px";
      }
      currentFloorInfo.style.bottom = "unset";
      destinationFloorInfo.style.bottom = "unset";
    }
    // 두 요소가 모두 하단에 있는 경우
    else if (
      currentElementRect.bottom > containerRect.bottom &&
      destinationElementRect.bottom > containerRect.bottom
    ) {
      // 위치 조정 (더 아래에 있는 요소가 2px, 다른 요소는 27px)
      if (currentElementRect.top > destinationElementRect.top) {
        currentFloorInfo.style.bottom = "2px";
        destinationFloorInfo.style.bottom = "27px";
      } else {
        destinationFloorInfo.style.bottom = "2px";
        currentFloorInfo.style.bottom = "27px";
      }
      currentFloorInfo.style.top = "unset";
      destinationFloorInfo.style.top = "unset";
    }
    // 하나는 상단에서 사라지고, 하나는 하단에서 사라진 경우
    else if (
      currentElementRect.top < containerRect.top &&
      destinationElementRect.bottom > containerRect.bottom
    ) {
      currentFloorInfo.style.top = "2px";
      currentFloorInfo.style.bottom = "unset";
      destinationFloorInfo.style.bottom = "2px";
      destinationFloorInfo.style.top = "unset";
    } else if (
      destinationElementRect.top < containerRect.top &&
      currentElementRect.bottom > containerRect.bottom
    ) {
      destinationFloorInfo.style.top = "2px";
      destinationFloorInfo.style.bottom = "unset";
      currentFloorInfo.style.bottom = "2px";
      currentFloorInfo.style.top = "unset";
    }
  }
}

floorsContainer.addEventListener("scroll", () => {
  updateArrows();
  updateFloorVisibility();
});

upArrow.addEventListener("click", () => {
  floorsContainer.scrollBy({
    top: -150,
    behavior: "smooth",
  });
});

downArrow.addEventListener("click", () => {
  floorsContainer.scrollBy({
    top: 150,
    behavior: "smooth",
  });
});

renderFloors();

window.addEventListener("resize", () => {
  updateArrows();
  updateFloorVisibility();
});
document.addEventListener("DOMContentLoaded", function () {
  const upArrow = document.getElementById("up-arrow");
  const downArrow = document.getElementById("down-arrow");

  function animateArrow(arrow, image1, image2) {
    arrow.classList.add("active"); // 투명도 애니메이션 적용
    setTimeout(() => {
      arrow.style.backgroundImage = `url(${image2})`;
    }, 300); // **0.3초 후 이미지 변경**

    setTimeout(() => {
      arrow.style.backgroundImage = `url(${image1})`;
      arrow.classList.remove("active"); // 원래 상태로 복귀
    }, 1500);
  }

  upArrow.addEventListener("mousedown", function () {
    animateArrow(upArrow, "up_2.png", "up.png");
  });

  downArrow.addEventListener("mousedown", function () {
    animateArrow(downArrow, "down_2.png", "down.png");
  });
});
