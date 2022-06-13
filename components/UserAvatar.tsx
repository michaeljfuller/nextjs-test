import { useSession } from "next-auth/react"
import utilStyles from "@styles/utils.module.scss";
import {Session} from "next-auth";

export interface UserAvatarProps {
    user?: Pick<Session['user'], 'image'|'name'>
    default?: string
    size?: number
}
export default function UserAvatar(props: UserAvatarProps) {
    const { data: session } = useSession()
    const user = props.user || session?.user
    const size = props.size || 40
    return <img
        src={user?.image || props.default || '/img.png'}
        alt={`${user?.name || 'user'}'s avatar`}
        title={user?.name}
        className={utilStyles.borderCircle}
        height={size}
        width={size}
    />
}