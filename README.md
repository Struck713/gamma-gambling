# Gamma Gambling

This repository contains all of the files for our project in CS33007. This project is written in Typescript, using [Next.js](https://nextjs.org/) as the base framework. [Socket.io](https://socket.io) is used for real-time communication through websockets, it is the backbone of the game management system.

## Description

Gamma Gambling is a gambling site where users can enjoy the thrill of gambling without taking any real risks. Gamma is targeted toward people of any age and skill level that are interested in gambling. Our target audience is large since our site doesn’t use real currency to participate in our games so there is no age requirement and less skilled players can play without the worry of losing money. This is because Gamma uses a virtual currency referred to as Gamma Coins. Gamma Coins cannot be bought with real currency and can only be earned by playing games and receiving gifts. Gamma currently only features one game, Rocket Ride, the user can put their coins at stake to earn a multiple of their bet or lose it all if they don’t eject in time. Users can connect to other users by joining game lobbies where they can see each other's bets. In order for users to be able to participate in games they need to create a Gamma account. Gamma uses [Bcrypt](https://www.npmjs.com/package/bcrypt), a password hashing algorithm, to securely store user passwords. All data for this project is stored in a MySQL database.

## Getting Started

This project has two parts: the Next.js server (in `website/`) and a socket server (in `socket-server/`). Both of them need to be running for the application to function correctly. **Please make sure** you are in the correct directory before using `npm`!

To run the Next.js server:
```bash
npm run dev
```

To run the socket-server:
```bash
npm run start
```

If you encounter errors, please attempt to reinstall all packages (`npm install`) before submitting an issue.



