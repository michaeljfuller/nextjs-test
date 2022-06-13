import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostItem = {
    id: string
    title: string
    date: string
    contentHtml: string
}
type PostMatter = Pick<PostItem, 'date' | 'title'>

export async function getPostData(id): Promise<PostItem> {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const data = matterResult.data as PostMatter

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...data,
    } as PostItem;
}

export async function getSortedPostsData(): Promise<PostItem[]> {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(
        fileNames.map<Promise<PostItem>>((fileName) => {
            // Remove ".md" from file name to get id
            const id = fileName.replace(/\.md$/, '');
            return getPostData(id)
        })
    );
    // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) return 1;
        else if (a > b) return -1;
        else return 0;
    });
}

/**
 * Returns an array that looks like this:
 *  [
 *      { params: { id: 'ssg-ssr' } },
 *      { params: { id: 'pre-rendering' } }
 *  ]
 */
export function getAllPostIds(): Array<{
    params: { id: string }
}> {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}