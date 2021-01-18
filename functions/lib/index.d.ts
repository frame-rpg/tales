import * as functions from 'firebase-functions';
export declare const onSignup: functions.CloudFunction<import("firebase-admin/lib/auth").admin.auth.UserRecord>;
export declare const onUserStatusChanged: functions.CloudFunction<functions.Change<functions.database.DataSnapshot>>;
export declare const api: functions.HttpsFunction;
