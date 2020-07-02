# Tales of Foo and Bar

# Setting up

It looks like you need the secret key to seed the local database even though the
local database doesn't connect to the cloud. Talk to Eric about getting a copy of
the key file, which should be put in src/admin/keys.

You'll need a recent version of the jre (`apt install default-jdk`) to run the
emulators. You also need node and the angular cli. Install [nvm](https://github.com/nvm-sh/nvm)
and then use that to install node via `nvm i node stable`.

Then in the root directory, `npm i -g @angular/cli firebase-tools` to install
CLI tools.

Then `npm i` in the root directory. Then in the admin script directory... `cd src/admin && npm i`.

That's all you need.

# Running

Usually: run the emulator locally
`firebase emulators:start`

Then seed the local emulators:

```
cd src/admin
npm run-script clean
npm run-script build
FIRESTORE_EMULATOR_HOST=localhost:8080 npm run-script seed
```

Then run anuglar
`ng serve`
