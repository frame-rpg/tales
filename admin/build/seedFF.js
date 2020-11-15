"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const fantasyFights_1 = require("./fantasyFights");
const util_1 = require("./util");
const users_1 = require("./users");
(async () => {
    const flagArgs = {};
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i = i + 2) {
        flagArgs[args[i].slice(2)] = args[i + 1];
    }
    if (!flagArgs.gm) {
        throw new TypeError('required argument --gm uid');
    }
    const app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://framesystem-rpg.firebaseio.com',
        projectId: 'framesystem-rpg',
    });
    const fullAcl = { [flagArgs.gm]: 'gm' };
    if (flagArgs.player) {
        fullAcl[flagArgs.player] = 'player';
    }
    const gmOnlyAcl = { [flagArgs.gm]: 'gm' };
    const ffc = await app
        .firestore()
        .doc(`/campaigns/${fantasyFights_1.campaign.campaignId}`)
        .set({ ...fantasyFights_1.campaign, acl: fullAcl });
    await app
        .firestore()
        .doc('/pages/rules')
        .set({
        authors: [flagArgs.gm],
    });
    await Promise.all([
        Promise.all(fantasyFights_1.characters
            .map((c) => {
            if (flagArgs.player && c.characterId === 'stu') {
                return { ...c, acl: fullAcl };
            }
            else {
                return { ...c, acl: gmOnlyAcl };
            }
        })
            .map((c) => {
            fantasyFights_1.inventory[c.characterId].forEach((item) => util_1.addItem(c, item));
            return c;
        })
            .map((p) => app
            .firestore()
            .doc(`/campaigns/${fantasyFights_1.campaign.campaignId}/characters/${p.characterId}`)
            .set({ ...p, campaignId: fantasyFights_1.campaign.campaignId }))),
        Promise.all(users_1.users.map((user) => app.firestore().doc(`/users/${user.userId}`).set(user))),
    ]);
})();
