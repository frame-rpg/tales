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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.onUserStatusChanged = exports.onSignup = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const core_1 = require("@nestjs/core");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("./auth.middleware");
admin.initializeApp();
const db = admin.firestore();
exports.onSignup = functions.auth.user().onCreate((user) => {
    return db.doc(`/users/${user.uid}`).set({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
    });
});
exports.onUserStatusChanged = functions.database
    .ref('/status/{uid}')
    .onUpdate(async (change, context) => {
    const eventStatus = change.after.val();
    const userStatusFirestoreRef = db.doc(`status/${context.params.uid}`);
    const statusSnapshot = await change.after.ref.once('value');
    const status = statusSnapshot.val();
    if (status.last_changed > eventStatus.last_changed) {
        return null;
    }
    eventStatus.last_changed = new Date(eventStatus.last_changed);
    return userStatusFirestoreRef.set(eventStatus);
});
const server = express_1.default();
async function createNestServer(expressInstance) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
    app.use(auth_middleware_1.firebaseAuthMiddleware);
    return app.init();
}
createNestServer(server)
    .then((v) => console.log('Nest Ready'))
    .catch((err) => console.error('Nest broken', err));
exports.api = functions.https.onRequest(server);
//# sourceMappingURL=index.js.map