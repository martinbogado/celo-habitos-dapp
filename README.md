# Celominder - HabitTracker Dapp

Este proyecto se construyó para presentar en el Celo Solidity Dev Program.
Fue creado por Martín Bogado y Federico Rascón en junio de 2022.

## Sobre que trata

Es un HabitTracker basado en [Beeminder](https://www.beeminder.com/) pero respaldado por la seguridad y transparencia de los contratos inteligentes.

La idea es generar un incentivo economico propio para que el usuario este mas motivado a adquirir nuevos habitos. El usuario tiene la garantia que si cumple los habitos en tiempo y forma recibira su dinero otra vez junto con un premio 🎁


# Pagina

## Home
![image](https://user-images.githubusercontent.com/85038226/173673659-d98ef6c0-3c11-4bf1-ab7e-a34a5682fed2.png)

## Nuevo Reto en Curso
![image](https://user-images.githubusercontent.com/85038226/173674133-7d86d989-ef84-4d72-9c5d-27e7841ec66f.png)

## Completa tu reto y reclama el premio 🏆
![image](https://user-images.githubusercontent.com/85038226/173674700-d95bab45-a0e5-4663-89fb-4c2e18e46fdd.png)

<br>

# Agradecimientos

Muchas gracias a Plazti 💚 y a Celo Foundation que hicieron todo esto posible

- [Platzi](https://platzi.com/) - Website
- [Celo](https://celo.org/) - Website

<br>

# Celo Progressive Dapp Starter

A starter pack to get started with building dapps on Celo.

You can view a live version of the template deployed at https://celo-progressive-dapp-starter.netlify.app/.

This repo is heavily inspired by [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth).

Prerequisites:

1. Node (v12), [NVM](https://github.com/nvm-sh/nvm)
2. Yarn
3. Git

```shell
git clone https://github.com/celo-org/celo-progressive-dapp-starter
```

## Intro Video

[![Intro Video](https://img.youtube.com/vi/MQg2sta0lr8/0.jpg)](https://youtu.be/MQg2sta0lr8)

## Using the Dapp Starter

### Set the correct node version (several Celo packages require using node version 12.x):

```shell
cd celo-progressive-dapp-starter
nvm use # uses node v12 as specified in .nvmrc
```

### Get testnet funds and install dependencies

```shell
cd packages/hardhat
yarn install
npx hardhat create-account # prints a private key + account
```

Paste the private key in `packages/hardhat/.env` and fund the account from the faucet [here](https://celo.org/developers/faucet). Once the account is funded, deploy the contracts with:

```shell
yarn deploy
```

Read more details about [the hardhat package here](packages/hardhat/README.md).

### In another terminal, start the frontend (React app using [Next.js](https://nextjs.org/))

```shell
cd packages/react-app
yarn install
yarn dev
```

### Testing on Mobile

- Get the Alfajores Testnet mobile wallet for Android and iOS [here](https://celo.org/developers/wallet).
- Serve your React app to your mobile device for testing via a tunnel.

Next.js defaults to serving your app on port 3000, so point the tunnel there:

```shell
npx localtunnel --port 3000
```

Read more about localtunnel [here](https://www.npmjs.com/package/localtunnel).

### Review

- Edit smart contracts in `packages/hardhat/contracts`.
- Edit deployment scripts in `packages/hardhat/deploy`.
- Edit frontend in `packages/react-app/pages/index.tsx`.
- Open http://localhost:3000 to see the app.

You can run `yarn deploy --reset` to force re-deploy your contracts to your local development chain.

## Deploy Your DApp

This repo comes with a `netlify.toml` file that makes it easy to deploy your front end using [Netlify](https://www.netlify.com/). The `toml` file contains instructions for Netlify to build and serve the site, so all you need to do is create an account and connect your GitHub repo to Netlify.

## Developing with local devchain

You can [import account account keys](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) for the local development chain into Metamask. To print the private keys of the local chain accounts `cd /packages/hardhat` and run

```shell
npx hardhat devchain-keys
```

If you are working on a local development blockchain, you may see errors about `the tx doesn't have the correct nonce.` This is because wallets often cache the account nonce to reduce the number of RPC calls and can get out of sync when you restart your development chain. You can [reset the account nonce in Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015488891-How-to-reset-your-account) by going to `Settings > Advanced > Reset Account`. This will clear the tx history and force Metamask to query the appropriate nonce from your development chain.

**Note:** You can get a local copy of mainnet by forking with Ganache. Learn more about [forking mainnet with Ganache here.](https://trufflesuite.com/blog/introducing-ganache-7/index.html#1-zero-config-mainnet-forking)
