import Head from 'next/head';
import Link from 'next/link';
import Layout, {siteTitle} from '@components/layout';
import utilStyles from '@styles/utils';
import {getSortedPostsData} from '@lib/posts';
import Date from '@components/date';
import {AuthStatus} from "@components/AuthStatus";

export async function getStaticProps() {
    const allPostsData = await getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}

type HomeProps = Awaited<ReturnType<typeof getStaticProps>>['props']

export default function Home({allPostsData}: HomeProps) {
    return (
        <Layout home>

            <Head>
                <title>{siteTitle}</title>
            </Head>

            <AuthStatus/>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Misc</h2>
                <ul className={utilStyles.list}>
                    <li><Link href={`/api/hello`}><a>Hello API</a></Link></li>
                </ul>
            </section>

            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Blog</h2>
                <ul className={utilStyles.list}>
                    {allPostsData.map(({id, date, title}) => (
                        <li className={utilStyles.listItem} key={id}>
                            <Link href={`/posts/${id}`}>
                                <a>{title}</a>
                            </Link>
                            <br/>
                            <small className={utilStyles.lightText}>
                                <Date dateString={date}/>
                            </small>
                        </li>
                    ))}
                </ul>
            </section>

        </Layout>
    );
}