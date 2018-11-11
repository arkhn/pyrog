[![GitHub license](https://img.shields.io/github/license/arkhn/fhir-pipe.svg)](https://github.com/arkhn/fhir-pipe/blob/master/LICENSE)
[![Website arkhn.org](https://img.shields.io/website-up-down-green-red/https/arkhn.org.svg)](http://arkhn.org/)

# Fhirball client

Fhirball is a web application meant to help people build and share database mappings.

## Introduction

This is a react-redux-based client for Fhirball. It is built using Webpack.

## Installation

The first thing to do after cloning this repository is to install all needed node modules:
```
npm install
```
All commands listed in the coming sections can be tweaked in `./package.json`.

### Running the app locally
Hitting the following command will run a `webpack-dev-server` which serves a _development_ version of the app under _http://0.0.0.0:3000_:
```
npm start
```

### Building production files
A _production_ version of the application can be built using the following command:
```
npm run build-prod
```
This will create bundles and output them in `./dist/`. These files can then be exported to a distant production server running the application.

## Code organisation

### Webpack

The webpack config file is located at `./webpack.config.js`. It mainly calls two files: `./src/index.html` and `./src/application/app.tsx` which are the root files to all other files of the application.

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

## Start contributing

We have reported several issues with the label `Good first issue` which can be a good way to start! Also of course, feel free to contact us on Slack in you have trouble with the project.

If you're enthusiastic about our project, :star: it to show your support! :heart:
