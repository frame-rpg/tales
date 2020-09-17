# talesadmin

To seed a campaign, first build the code:

- `npm i`
- `npx tsc`

Then run the seed in build/

- `node build/seedFF.js --gm someuid --player otheruid`
  - gm is required, and is the uid for your logged-in user (get it from the firebase console)
  - player is not required, but if provided is another uid that can see the campaign as a player.
- alternativly `seedDino.js` will seed the dino campaign, but the seed characters in there are less well-developed.

To seed the emulator database, set `FIRESTORE_EMULATOR_HOST=localhost:8080` while the emulators are running.
To seed the prod database, you first need a prod certificate, then you can set `GOOGLE_APPLICATION_CREDENTIALS=~/secret/tales.json`
(or wherever the credentials are stored, outside of git.)

If you're running a local instance of tales, you'll have to switch out the actual firebase ids.
