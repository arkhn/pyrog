const config = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  globals: {},
}

const unitTests = Object.assign(
  {
    displayName: 'Unit Tests',
    testRegex: '.*\\.test\\.ts$',
  },
  config,
)

module.exports = {
  projects: [unitTests],
}
