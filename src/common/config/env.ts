export const env = {
    keyAcess: process.env.KEY_ACESS || "",
    keyRefresh: process.env.KEY_REFRESH || "",
}

if (!env.keyAcess) throw new Error("KEY_ACESS env var is required")
if (!env.keyRefresh) throw new Error("KEY_REFRESH env var is required")