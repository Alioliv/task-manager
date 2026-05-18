const saltRound = 10;
import bcrypt from "bcrypt"

export async function createHash(password: string) {
    const passwordWithHash = await bcrypt.hash(password, saltRound)
    return passwordWithHash
}

export async function compareHash(password: string, hash: string){
    return bcrypt.compare(password, hash)
}