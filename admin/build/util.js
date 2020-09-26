"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillBlock = exports.attr = void 0;
function attr(v, e, n) {
    return {
        name: n,
        edge: e,
        current: v,
        pool: v,
        wound: false,
    };
}
exports.attr = attr;
function skillBlock(base, _a) {
    var inept = _a.inept, proficient = _a.proficient, trained = _a.trained, expert = _a.expert;
    return base.map(function (skill) {
        if (inept.includes(skill.skillId)) {
            return __assign(__assign({}, skill), { level: 'inept' });
        }
        else if (proficient.includes(skill.skillId)) {
            return __assign(__assign({}, skill), { level: 'proficient' });
        }
        else if (trained.includes(skill.skillId)) {
            return __assign(__assign({}, skill), { level: 'trained' });
        }
        else if (expert.includes(skill.skillId)) {
            return __assign(__assign({}, skill), { level: 'expert' });
        }
        return __assign(__assign({}, skill), { level: 'unskilled' });
    });
}
exports.skillBlock = skillBlock;
