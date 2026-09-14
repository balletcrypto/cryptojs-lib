# crypto-lib

Pure address / WIF / BIP38 derivations for the Ballet wallet. No network, no key
storage, no persistence — inputs and outputs are hex strings, base58/bech32
strings, or Buffers.

## Install

Install as a git dependency:

```json
"crypto-lib": "https://github.com/balletcrypto/cryptojs-lib"
```

## Usage

This package ships **untranspiled ES-module source** and has no package entry
point — there is deliberately no `main`. Import the modules under `src/`
directly and let your own bundler transpile them:

```js
import { getBitcoinAddress, getEthAddress } from 'crypto-lib/src/CryptoAddress'
import { getBitcoinWif } from 'crypto-lib/src/wif'
import { decryptEpkVcode } from 'crypto-lib/src/bip38'
import { validateConfirmation } from 'crypto-lib/src/confirmation'
import { genIntermediate } from 'crypto-lib/src/Intermediate'
import { calculateUTXOSize, signer } from 'crypto-lib/src/btc/signer'
```

`require('crypto-lib')` and bare `import 'crypto-lib'` are not supported.

## Development

```bash
yarn install
npm test
```
