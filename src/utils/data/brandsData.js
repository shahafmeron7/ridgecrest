const BambooHR_PID = 679050
const Justworks_PID = 679647

const BambooHR_SRC =
  "https://assets.trafficpointltd.com/app/uploads/sites/148/2022/07/31121653/bamboohr_l.svg";
const Justworks_SRC =
  "https://assets.sonary.com/wp-content/uploads/2024/05/08113650/justworks_l_medium-01.svg";
const prosIcon =
  "https://assets.sonary.com/wp-content/uploads/2024/01/18084718/Icon-Name.svg";
const consIcon =
  "https://assets.sonary.com/wp-content/uploads/2024/01/18084759/Icon-Name-1.svg";
export const brandsCards = [
  {
    src: BambooHR_SRC,
    alt: "BambooHR Logo",
    pid: BambooHR_PID,
    pros_cons: {
      Pros: {
        icon: prosIcon,
        list: [
          "Flexible pay schedules",
          "One system for employees",
          "Handles all tax filing requirements",
        ],
      },

      Cons: {
        icon: consIcon,
        list: ["No expense management app"],
      },
    },
  },
  {
    src: Justworks_SRC,
    alt: "Justworks Logo",
    pid: Justworks_PID,
    pros_cons: {
      Pros: {
        icon: prosIcon,
        list: [
          "Straightforward pricing model",
          "24/7 customer support",
          "Automatic deductions for benefits",
        ],
      },

      Cons: {
        icon: consIcon,
        list: [
         "Base plan doesn't include time tracking"
        ],
      },
    },
  },
];
