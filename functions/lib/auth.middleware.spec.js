"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("./auth.middleware");
describe('AuthMiddleware', () => {
    it('should be defined', () => {
        expect(new auth_middleware_1.AuthMiddleware()).toBeDefined();
    });
});
//# sourceMappingURL=auth.middleware.spec.js.map