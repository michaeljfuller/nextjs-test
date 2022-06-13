// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
import {OAuthConfig} from "next-auth/providers/oauth";
import {DiscordProfile} from "next-auth/providers/discord";
import {Account, Session} from "next-auth";
import {JWT} from "next-auth/jwt";

export const discordAuthorizationUrl = `https://discord.com/api/oauth2/authorize?scope=${[
    'identify',
    'email', 
].join('%20')}`

export const discordProfileCallback: OAuthConfig<DiscordProfile>['profile'] = async (profile, tokens) => {
    return profile
}

export function getDiscordTokenData(profile: DiscordProfile, account: Account): JWT['discord'] | undefined {
    if (account.provider === 'discord') {
        return {
            username: profile.username,
            discriminator: profile.discriminator,
            locale: profile.locale,
            avatar: profile.avatar,
        }
    }
}

export function getDiscordUserData(token: JWT, user: Session['user']): Session['user'] {
    const discord = token.discord
    return {
        ...user,
        provider: 'discord',
        name: discord.username,
        username: `${discord.username}#${discord.discriminator}`,
        locale: discord.locale,
        // https://discord.com/developers/docs/reference#image-formatting
        image: `https://cdn.discordapp.com/avatars/${token.sub}/${discord.avatar}.png`,
    }
}