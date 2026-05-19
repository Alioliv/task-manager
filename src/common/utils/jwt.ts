import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { RoleType } from '../../prisma/generated/prisma/client'

export interface TokenPayload {
    id: number
    email: string
    name?: string | null
    role: RoleType[]
}

interface Token extends TokenPayload{
    iat: number,
    exp: number,
}

export function signTokenAcess(payload: TokenPayload){
    return jwt.sign(payload, env.keyAcess, {
        expiresIn: '1h'
    })
}

export function signTokenRefresh(payload: TokenPayload){
    return jwt.sign(payload, env.keyRefresh, {
        expiresIn: '30d'
    })
}

export function verifyTokenAcess(token: string){
    return jwt.verify(token, env.keyAcess)
}

export function verifyTokenRefresh(token: string){
    return jwt.verify(token, env.keyRefresh)
}

export function getToken(token: string) : Token {
    return jwt.decode(token) as Token
}