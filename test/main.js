// totalFloors에 불러오는 층 수는 넣어주시면 됩니다.
const totalFloors = ["B2", "B1", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// cuurentFloor에 현재 층수를 넣어주시면 됩니다다
let currentFloor = 10;
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
    elementRect.top + 15 >= containerRect.top &&
    elementRect.bottom - 15 <= containerRect.bottom
  );
}
// 엘리먼트의 위치값을 구하고 그 위치값이 container보다 높거나 낮아지면 문구가 나오도록 하는겁니다.
function updateFloorVisibility() {
  const containerRect = floorsContainer.getBoundingClientRect();
  const currentFloorElement = document.querySelector(".floor.active");
  const destinationFloorElement = document.querySelector(".floor.clicked");

  // 현재층 정보 업데이트
  if (currentFloorElement) {
    const isCurrentFloorVisible = isElementFullyVisible(
      currentFloorElement,
      floorsContainer
    );
    const elementRect = currentFloorElement.getBoundingClientRect();

    if (!isCurrentFloorVisible) {
      currentFloorInfo.classList.add("show-info");
      currentFloorInfo.textContent = `현재층`;
      document.querySelector(".active").classList.add("none");
      if (elementRect.top < containerRect.top) {
        currentFloorInfo.style.top = "-22px";
        currentFloorInfo.style.bottom = "unset";
      } else {
        currentFloorInfo.style.bottom = "-22px";
        currentFloorInfo.style.top = "unset";
      }
    } else {
      document.querySelector(".active").classList.remove("none");
      currentFloorInfo.classList.remove("show-info");
    }
  }

  // 도착지 정보 업데이트
  if (destinationFloorElement) {
    const isDestinationFloorVisible = isElementFullyVisible(
      destinationFloorElement,
      floorsContainer
    );
    const elementRect = destinationFloorElement.getBoundingClientRect();

    if (!isDestinationFloorVisible) {
      destinationFloorInfo.classList.add("show-info");
      destinationFloorInfo.textContent = `도착지`;
      document.querySelector(".clicked").classList.add("none");
      if (elementRect.top < containerRect.top) {
        destinationFloorInfo.style.top = "5px";
        destinationFloorInfo.style.bottom = "unset";
      } else {
        destinationFloorInfo.style.bottom = "5px";
        destinationFloorInfo.style.top = "unset";
      }
    } else {
      destinationFloorInfo.classList.remove("show-info");
      document.querySelector(".clicked").classList.remove("none");
    }
  } else {
    destinationFloorInfo.classList.remove("show-info");
  }
}

floorsContainer.addEventListener("scroll", () => {
  updateArrows();
  updateFloorVisibility();
});

upArrow.addEventListener("click", () => {
  floorsContainer.scrollBy({
    top: -32,
    behavior: "smooth",
  });
});

downArrow.addEventListener("click", () => {
  floorsContainer.scrollBy({
    top: 32,
    behavior: "smooth",
  });
});

renderFloors();

window.addEventListener("resize", () => {
  updateArrows();
  updateFloorVisibility();
});
