import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import DiscordProvider, {DiscordProfile} from "next-auth/providers/discord";
import {
    discordAuthorizationUrl,
    discordProfileCallback,
    getDiscordTokenData,
    getDiscordUserData
} from "@lib/auth/discord/discordAuth";

/**
 * @link https://next-auth.js.org/getting-started/example
 */
export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: discordAuthorizationUrl,
            profile: discordProfileCallback,
        }),
    ],
    // https://next-auth.js.org/configuration/options#events
    // https://next-auth.js.org/configuration/events
    events: {
        async signIn({user}) { console.log(`Event signIn("${user.name || user.email}")`) },
        async signOut({token}) { console.log(`Event signOut("${token.name || token.email}")`) },
        async createUser({user}) { console.log(`Event createUser("${user.name || user.email}")`) },
        async updateUser({user}) { console.log(`Event updateUser("${user.name || user.email}")`) },
        async linkAccount({account, user}) { console.log(`Event linkAccount("${account.provider}", "${user.name || user.email}")`) },
        async session({session}) { console.log(`Event session("${session.user.name || session.user.email}", "Expires: ${new Date(session.expires).toLocaleString()}")`) },
    },
    callbacks: {

        async jwt(params) {
            switch (params.account?.provider) {
                case 'github':
                    params.token.github = { username: params.profile.login as string }
                    break;
                case 'discord':
                    params.token.discord = getDiscordTokenData(params.profile as DiscordProfile, params.account)
                    break;
            }
            return params.token
        },

        async session({session, token, user}) {
            const {github, discord} = token

            if (github) {
                session.user.username = github.username
            }
            if (discord) {
                session.user = getDiscordUserData(token, session.user)
            }

            return session
        },

        // async signIn(params) {
        //     return true
        // },

        // async redirect(params) {
        //     return params.url
        // },

    },
})