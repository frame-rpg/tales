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
exports.firebaseAuthMiddleware = void 0;
const admin = __importStar(require("firebase-admin"));
async function firebaseAuthMiddleware(req, res, next) {
    if ((!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.', 'Make sure you authorize your request by providing the following HTTP header:', 'Authorization: Bearer <Firebase ID Token>', 'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }
    let idToken;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else if (req.cookies) {
        console.log('Found "__session" cookie');
        idToken = req.cookies.__session;
    }
    else {
        res.status(403).send('Unauthorized');
        return;
    }
    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
        return;
    }
    catch (error) {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
        return;
    }
}
exports.firebaseAuthMiddleware = firebaseAuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map