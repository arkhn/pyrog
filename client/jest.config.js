// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  modulePaths: ["<rootDir>/"],
  setupFiles: ["<rootDir>/test/setup.js"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(js|jsx)?$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(css|scss|less|sass)?$": "<rootDir>/test/styleMock.js",
    "^.+\\.(gql|graphql)?$": "jest-transform-graphql",
    "^.+\\.(svg)?$": "<rootDir>/test/styleMock.js"
  },
  transformIgnorePatterns: ["/node_modules/"]
};
