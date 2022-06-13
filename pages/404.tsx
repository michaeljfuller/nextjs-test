import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from "@components/layout";

export default function Custom404() {
    const router = useRouter()
    return <Layout>
        <Head>
            <title>404 - Page Not Found</title>
        </Head>
        <h1>404 - Page Not Found</h1>
        <p>Failed to find page for &quot;{router.asPath}&quot;</p>
    </Layout>;
}