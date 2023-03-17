//adapted from hmasamur-tchandar repo
const mock1 = [
    ["Charlie", "and", "Caroline", "so", "slay."]
]

const mock2 = [
    ["Ariana", "Demi", "Taylor", "Miley", "Mariah"],
    ["Britney", "Gaga", "Beyonce", "Rihanna", "Selena!"],
];

const mock3 = [
    ["Nicki", "Cardi", "Megan"],
    ["Usher", "Tim", "Rosalia"],
    ["Shakira", "Bad", "Bunny"],
    ["New", "Watson", "Fun"],
];

const mockEmpty = [[]];

const searchShakira = [
    ["Shakira", "Bad", "Bunny"]
];

const searchCharlie = [["Charlie", "and", "Caroline", "so", "slay."]];


const searchAriana = [
    ["Ariana", "Demi", "Taylor", "Miley", "Mariah"]
]

const fileMap = new Map([
  ["mock1", mock1],
  ["mock2", mock2],
  ["mock3", mock3],
  ["mockEmpty", mockEmpty]
]);

const resultMap = new Map([
    ["Shakira", searchShakira],
    ["Ariana", searchAriana],
    ["Charlie", searchCharlie]
])

export { mock1, mock2, mock3, mockEmpty, searchShakira, searchCharlie, searchAriana, fileMap, resultMap}