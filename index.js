//  Get elements
const root = document.getElementById("root");

// Reference data
const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const daysIn2020 = 366;
let currentDate = 0,
  currentMonthInNum = 0;
const colors = ["#4ba52d", "#2da59a", "#d0970a", "#d0380a"];

// Get dimensions
const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

// Api call
const fetchEventDataApi = () => {
  return fetch("https://api.github.com/gists/0d0d27c90dc232fda591f4733b303c79")
    .then((res) => res.json())
    .then((res) => JSON.parse(res?.files["events.json"]?.content || "[]"));
};

// Logics
const dateGenerator = (priorDay, month) => {
  const completeMonths = ["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"];
  const oneDayLessMonths = ["Apr", "Jun", "Sep", "Nov"];
  const exceptionalMonths = ["Feb"];
  let upto = 31;

  if (oneDayLessMonths.includes(month)) {
    upto = 30;
  }
  if (exceptionalMonths.includes(month)) {
    upto = 29;
  }
  if (priorDay < upto) {
    return priorDay + 1;
  } else {
    currentMonthInNum = currentMonthInNum + 1;
    return 1;
  }
};

const output2DigitNumInStr = (num) =>
  String(num).length < 2 ? "0" + num : String(num);

const eventColorGenerator = (text) => {
  if (text.includes("Meeting")) {
    return colors[0];
  } else if (text.includes("Standup")) {
    return colors[1];
  } else if (text.includes("Holiday")) {
    return colors[2];
  }
};

//  Ui settings
const appendDivToRootWithId = (index, addExtraAttributes = () => {}) => {
  const div = document.createElement("div");
  div.setAttribute("id", index);
  addExtraAttributes(div);
  root.appendChild(div);
};

const appendDivToEleWithId = (ele, id, addExtraAttributes = () => {}) => {
  const div = document.createElement("div");
  div.setAttribute("id", id);
  addExtraAttributes(div);
  ele.appendChild(div);
};

const createUIGrid = (index) => {
  appendDivToRootWithId(index, (ele) => {
    ele.setAttribute("class", "grid");
    const size = (vw - weeks.length) / weeks.length + "px";
    ele.style.width = size;
    ele.style.height = size;
    appendDivToEleWithId(
      ele,
      `2020-${output2DigitNumInStr(
        currentMonthInNum + 1
      )}-${output2DigitNumInStr(currentDate)}`,
      (element) => {
        element.setAttribute("class", "innerChild");
        appendDivToEleWithId(element, "date", (dateEle) => {
          dateEle.textContent = currentDate;
        });
      }
    );
  });
};

const generateCalenderGridUI = () => {
  Array(daysIn2020)
    .fill("-")
    .forEach((_, i) => {
      currentDate = dateGenerator(currentDate, months[currentMonthInNum]);
      createUIGrid(i);
    });
};

const addEventsToUi = (calEvent) => {
  const eventDateEle = document.getElementById(calEvent.date);
  calEvent.events.forEach((event) => {
    appendDivToEleWithId(eventDateEle, event?.name, (currEle) => {
      currEle.textContent = event?.name;
      currEle.setAttribute("class", "events");
      currEle.style.backgroundColor = eventColorGenerator(event?.name);
    });
  });
};

(() => {
  fetchEventDataApi().then((eventsData) => {
    console.log(eventsData);
    generateCalenderGridUI();
    eventsData.forEach((event) => {
      addEventsToUi(event);
    });
  });
})();
