import { Request } from 'express';
export declare class CharacterController {
    findAll(): string;
    create(request: Request): Promise<string>;
}
