# Fhirball client

## Introduction

This is a react-redux-based client for Fhirball. It is built using Webpack.
You can start the app by running `npm start`, which will basically build a webpack bundle and serve it on a specified port.


## Installation

Simply clone the repo and run

```
npm install
npm start
```

## Code organisation

## Webpack

The Webpack config file is located at `./webpack.config.js`. It mainly calls two files: `./src/index.html` and `./src/application/app.tsx` which are the root files to all other files of the application.

### Redux
Redux is used to manage the application's state.
* All Redux actions, reducers and middlewares are located at `./src/application/{actions, middlewares, reducers}/`.
* Reducers are combined in `./src/application/reducers/mainReducer.tsx`. They handle independent parts of the state.

I personally read this course so as to understand what Redux is and how it works: [https://github.com/happypoulp/redux-tutorial](https://github.com/happypoulp/redux-tutorial)

### React
React routes are defined in `./src/application/routes.tsx`. Links between React and Redux are made in `./src/application/app.tsx`.

* All reusable React components are stored under `./src/application/components`.
* All views of this application are React components and are stored under `./src/application/views`.

### Mock data
Fake data is used to populate this web app. All mock data is present in `./src/application/mockdata/`.

Generating mock data can easily be done using javascript libraries such as Faker.js. An example is given in `./src/application/mockdata/generator.js`.

In order to run this script, one needs to have `node` and `faker` installed globally on their local machine (you might have to run `npm install faker -g` to install faker). Then, one can simply run `node src/application/mockdata/generator.js` in order to generate mock data in the terminal.

For Linux users, the output can easily be copied to the clipboard using `xclip` :
```
node src/application/mockdata/generator.js | xclip
```
