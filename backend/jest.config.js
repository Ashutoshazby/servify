export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  collectCoverageFrom: ["controllers/**/*.js", "routes/**/*.js", "middleware/**/*.js"],
  testTimeout: 30000,
};
