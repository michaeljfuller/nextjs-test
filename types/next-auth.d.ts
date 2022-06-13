// https://next-auth.js.org/getting-started/typescript#extend-default-interface-properties
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            provider: string
            username?: string
            locale?: string
        } & DefaultSession["user"]
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {}

    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    interface Account {}

    /** The OAuth profile returned from your provider */
    interface Profile {}
}

// https://next-auth.js.org/getting-started/typescript#submodules
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        github?: {
            username: string
        }
        discord?: {
            username: string
            discriminator: string
            locale: string
            avatar: string
        }
    }
}