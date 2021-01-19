import * as admin from 'firebase-admin';

export interface AuthenticatedRequest {
  user: admin.auth.DecodedIdToken;
}

export async function firebaseAuthMiddleware(
  req: any,
  res: any,
  next: () => void
) {
  if (!req.headers?.authorization?.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  } else {
    try {
      const idToken = req.headers.authorization.slice(7);
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch (error) {
      res.status(403).send('Unauthorized');
      return;
    }
  }
}
