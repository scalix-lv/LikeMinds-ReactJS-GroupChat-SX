<h1 align="center">
  Official JavaScript SDK for LikeMinds App 👨🏼‍💻
</h1>

## About LikeMinds

> Businesses are increasingly investing in building communities as they enable P2P value creation, retention, product stickiness and referrals. However, building in-app communities takes years of engineering efforts resulting in most brands either not building a community or building it from scratch on 3rd party platforms.

> LikeMinds is a simple plug and play, highly customisable community infra platform that helps brands build in-app communities in 15 mins. Brands can leverage the platform to build community features like group chats, 1-1 chats, activity feed, event management, resource library quickly without any engineering effort.

## 🔖 Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#Prerequisites)
- [VS Code Plugins](#vs-code-plugins)
- [Available Scripts](#project-setup)
- [File Structure](#file-structure)

## Clone this repo

```shell
git clone git@github.com:NateshR/LikeMinds-Web-GroupChat-SX.git
```

## NPM

```shell
npm install likeminds-apis-sdk
```

Run `npm install` and then `npm start`.

## 🤔 Prerequisites

NodeJS
https://nodejs.org/en/

## 🙌 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run build` fails to minify

https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## 😎 File Structure

Folder structure is based on productivity and some personal preferences:

```text
src
├── assets                  * Assets that are imported into your components(images, custom svg, etc).
├── App.css                 * Main app styles.
├── App.jsx                 * Main app component.
├── api                     * Abstractions for making API requests
│   └── ...
├── components              * Components of the projects that are not the main views.
│   └── ui                  * Generic and reusable across the whole app. Presentational components eg. Buttons, Inputs, Checkboxes.
│   └── layout              * Unique and one time use components that will help with app structure.
│   └── <domain component>  * Belong to a specific domain. Reusable in different pages.
│   └── ...
├── plugins                 * Init and config plugins(moment, material-ui, adal, etc).
│   └── ...
├── index.jsx               * Entry point of the application.
├── services                * All the common services. e.g. Authentication, hubs, etc.
├── store                   * The Redux action types in action-type.js, reducers, selectors and main store in the sub-folders.
│   ├── index.js
│   └── middlewares         * Store middlewares.
│   └── sagas               * Saga files in case of redux-saga.
│   └── modules             * Store modules/ducks structure.
│       └── smallModule.js  * Small modules can contain actions, action types, reducers and selectors in the same file.
│       └── bigModule       * Big modules should be composed by separated files for actions, action types, reducer and selectors.
│           └── index.js
│           └── actions.js
│           └── ...
├── styles/theme            * All common styles (css) or theme (sass, styled-components).
├── utils                   * Functions (for tests, for regex value testing, constants or filters.)
│   └── ...
├── pages                   * Routed components that represents pages(Presentational Components Only).
│   └── ...
└── .vscode                 * VS Code workspace settings to work with ESLint rules and formatting
                              (you can also lint or fix on save 😉).
```

**Some important root files**

```text
.
├── .editorconfig           * Coding styles (also by programming language).
├── .env                    * Environment variables (env.production, env.local, env.uat, etc).
├── .eslintrc.json          * ESLint configuration and rules.
├── .prettierrc             * Formatting Prettier options.
└── jsconfig.json           * JS compiler configurations (eg. set the root folder for roots when import files).
```
