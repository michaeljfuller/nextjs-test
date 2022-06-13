import { GetStaticPaths } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router'
import Layout from '@components/layout';
import DateField from '@components/date';
import {getAllPostIds, getPostData, PostItem} from '@lib/posts';
import utilStyles from '@styles/utils';

export const getStaticProps = async (
    req: { params: { id: string } }
) => {
    const { id } = req.params
    try {
        const postData = await getPostData(id);
        return { props: { postData } };
    } catch (e) {
        return {
            props: { postData: {
                id,
                title: '404',
                contentHtml: 'This article does not exist',
                date: ''
            } as PostItem}
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    return { paths, fallback: true };
}

type PostProps = Awaited<ReturnType<typeof getStaticProps>>['props']

export default function Post({ postData }: PostProps) {
    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Fetching post data...</div>
    }

    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <DateField dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}