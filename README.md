# Pyrog Client

[![Arkhn](https://img.shields.io/badge/ARKHN-PRODUCT-000000.svg?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAj0AAAI9CAMAAADmTzkzAAAAM1BMVEX////////////////////////////////////////////////////////////////////lEOhHAAAAEHRSTlMAECAwQFBgcICQoLDA0ODwVOCoyAAADCRJREFUeAHs1EFy00AABMC1EI4iHHn+/1rucKBqAmy23P2IHvwtAAAAAAAAAAAAAAAAwG204NpGB+45RweupM0H9aTPB/XU+aCeMh94JF0+sCd9Pqinzgf19Pmgnjof1NPng3rqfFBPnw/qqfNBPX0+qKfOB/X0+aCeOh/U0+eDen53G9DVkxwDynryLPJBPUU+qKfIB/XU+aCeLh/4lpT5wJl0+cCW9Pmgnjof1NPng3r6fFBPnw/q6fNBPX0+qKfPB/X0+aCePh/U0+eDevp8UM+fvY0O6kmuUUI9yX38AvXU+aCePh/UU+eDevp8UE+XD9yeKfOBI+nzQT19Pqinzwf19Pmgnj4f1NPng3r6fFBPnw/q6fNBPX0+qKfPB/XIh74e+dDX0/k+UE/rMVBPbR+oRz4U9czJB/XIRz3yofCWlny4UpIP9/Tko56efNQzIR/UIx/1TMgH9chHPRPyQT3yUc+EfFCPfNQzMR/UIx/1zM8H9STbQD2tc6Cef5UP6pGPeubkg3rkox75UNjTkg+P9OSjngn5oB75qGdCPqhHPuqZkA/qkY965uWDeuSjnvn5oB75qGd+PqhHPur5vPeBelrP20A9rWOgns/ng3rko57/nQ/qkQ8/UpIPW1ry4UxPPuqZlw/qkY965ENRz0r5oB75qEc+6lkqH9QjH/XIRz0L5YN65KMe+ahnrvtAPa1roB75qGeFfFCPfNQjH/XIh8J7SvLh9kxJPhyJfFi7HvmoRz7qkQ+L1SMf9chHPfJhtXrkox75qEc+LFaPfNQjH/VM8jFQT20fqKf1GKhHPur5KvmgHvmoRz7U9ciHe1ry4UpPPuqRD+vXIx/1yEc98mH5euSjHvmoRz6sVI981CMf9czPB/XIRz3yUc8qzoF6attAPZGPeuSjnoXIRz3yUY98+EhJPuxpyYdHliIf9chHPfJRzyvlg3rkox75qEc+6pEPC9UjH/WcaZ2vno96rj2t43zxfNRz7Gkdm3x+snOHt4pcURCED5jFvDEG8o92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)](https://arkhn.org/)
[![GitHub license](https://img.shields.io/badge/LiCENSE-APACHE 2-blue.svg?style=for-the-badge)](https://github.com/arkhn/fhir-pipe/blob/master/LICENSE)

Pyrog is a web application meant to help people build and share mappings from healthcare softwares / data sources to FHIR.

## Introduction

This is a react-redux-based client for Pyrog. It is built using Webpack.

## Installation

The first thing to do after cloning this repository is to install all needed node modules:
```
yarn install
```
All commands listed in the coming sections can be tweaked in `./package.json`.

### Running the app locally
Hitting the following command will run a `webpack-dev-server` which serves a _development_ version of the app under _http://0.0.0.0:3000_:
```
yarn start
```

### Building production files
A _production_ version of the application can be built using the following command:
```
yarn run build-prod
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

## Start contributing

We have reported several issues with the label `Good first issue` which can be a good way to start! Also of course, feel free to contact us on Slack in you have trouble with the project.

If you're enthusiastic about our project, :star: it to show your support! :heart:
