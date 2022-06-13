import { useSession } from "next-auth/react"

export interface UserNameProps {
    guestName?: string
}
export default function UserName(props: UserNameProps) {
    const { data: session } = useSession()
    const user = session?.user
    return user
        ? <>{user.name || user.username || user.email || 'unknown'}</>
        : <>{props.guestName || 'guest'}</>
}