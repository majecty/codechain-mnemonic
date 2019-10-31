#!/usr/bin/env node

import { CCKey } from "codechain-keystore";
import { PlatformAddress } from "codechain-primitives";
import { Command } from "commander";
const prompt = require("prompt");

let commandStarted = false;

const program = new Command("codechain-mnemonic");
program.version("1.0.4");

program.command("import-seed").action(importSeed);

program.command("get-private-key <seed-hash>").action(getPrivateKey);
program.command("get-public-key <seed-hash>").action(getPublicKey);
program.command("get-platform-address <seed-hash>").action(getCodeChainAddress);

program.parse(process.argv);

if (!commandStarted) {
  program.outputHelp();
}

async function importSeed() {
  try {
    commandStarted = true;
    const mnemonic = await getMnemonic();

    const cckey = await CCKey.create();
    const seedHash = await cckey.hdwseed.importMnemonic({
      mnemonic
    });
    console.log(`Seed hash extracted ${seedHash}`);
  } catch (err) {
    console.error(err);
  }
}

async function getPrivateKey(seedHash: string) {
  try {
    commandStarted = true;
    const cckey = await CCKey.create();
    const privKey = await cckey.hdwseed.getPrivateKeyFromSeed({
      seedHash,
      path: getPlatformAddressPath(0),
      passphrase: ""
    });

    console.log(`private key: ${privKey.toString()}`);
  } catch (err) {
    console.error(err);
  }
}

async function getPublicKey(seedHash: string) {
  try {
    commandStarted = true;
    const cckey = await CCKey.create();
    const publicKey = await cckey.hdwseed.getPublicKeyFromSeed({
      seedHash,
      path: getPlatformAddressPath(0),
      passphrase: ""
    });

    console.log(`public key ${publicKey.toString()}`);
  } catch (err) {
    console.error(err);
  }
}

async function getCodeChainAddress(seedHash: string) {
  try {
    commandStarted = true;
    const cckey = await CCKey.create();
    const publicKey = await cckey.hdwseed.getPublicKeyFromSeed({
      seedHash,
      path: getPlatformAddressPath(0),
      passphrase: ""
    });
    const platformAddress = PlatformAddress.fromPublic(publicKey, {
      networkId: "cc"
    });
    console.log(`platform address ${platformAddress.toString()}`);
  } catch (err) {
    console.error(err);
  }
}

function getMnemonic(): Promise<string> {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.get({ properties: { password: { hidden: true } } }, function(
      err: any,
      result: any
    ) {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.password);
    });
  });
}

// m / purpose' / coin_type' / account' / change / address_index
const platformAddressPath = "m/44'/3276/0'/0/";

function getPlatformAddressPath(index: number) {
  return platformAddressPath + index;
}
