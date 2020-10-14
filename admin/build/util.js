"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItem = exports.skillBlock = exports.attr = void 0;
const ulid_1 = require("ulid");
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
function skillBlock(base, { inept, proficient, trained, expert }) {
    return base.map((skill) => {
        if (inept.includes(skill.skillId)) {
            return { ...skill, level: 'inept' };
        }
        else if (proficient.includes(skill.skillId)) {
            return { ...skill, level: 'proficient' };
        }
        else if (trained.includes(skill.skillId)) {
            return { ...skill, level: 'trained' };
        }
        else if (expert.includes(skill.skillId)) {
            return { ...skill, level: 'expert' };
        }
        return { ...skill, level: 'unskilled' };
    });
}
exports.skillBlock = skillBlock;
function addItem(c, i) {
    const owner = {
        characterId: c.characterId,
        campaignId: c.campaignId,
        itemId: ulid_1.ulid(),
    };
    c.equipment[owner.itemId] = JSON.parse(JSON.stringify({ ...i, owner }));
}
exports.addItem = addItem;
