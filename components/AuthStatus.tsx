import { useSession, signIn, signOut } from "next-auth/react"
import UserName from "@components/UserName";
import UserAvatar from "@components/UserAvatar";

export function AuthStatus() {
    const { data: session, status } = useSession()
    console.log('AuthStatus', status, session)
    if (status === 'loading') {
        return <>Loading...</>
    }

    return <div style={{
        display: 'flex',
        flexDirection: 'row'
    }}>
        <UserAvatar user={session?.user} />

        <div style={{ margin: 'auto 0.5em' }}>{
            session
            ? <>Signed in as <UserName /></>
            : <>Not signed in</>
        }</div>

        <div style={{
            margin: 'auto 0'
        }}>{session
            ? <button onClick={() => signOut()}>Sign out</button>
            : <button onClick={() => signIn()}>Sign in</button>
        }</div>
    </div>
}