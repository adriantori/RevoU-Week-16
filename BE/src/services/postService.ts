import { createPost, deletePost, getPosts, getUserPostList, updatePost } from "../dao/postDao";

async function createPostService(postTitle: string, user_id: number) {
    try {

        const post = await createPost(postTitle, user_id);
        return post;
    } catch (error: any) {
        throw new Error('Error registering user service: ' + error.message);
    }
}
async function getPostsService() {
    try {
        const post = await getPosts();
        return post;
    } catch (error: any) {
        throw new Error('Error registering user service: ' + error.message);
    }
}


async function getUserPostListService(username: string) {
    try {
        const post = await getUserPostList(username);
        return post;
    } catch (error: any) {
        throw new Error('Error registering user service: ' + error.message);
    }
}

async function updatePostService(postTitle: string, user_id: number, post_id: number) {
    try {
        const post = await updatePost(postTitle, user_id, post_id)
        return post;
    } catch (error: any) {
        throw new Error('Error registering user service: ' + error.message);
    }
}

async function deletePostService(post_id: number) {
    try {
        const post = await deletePost(post_id)
        return post;
    } catch (error: any) {
        throw new Error('Error registering user service: ' + error.message);
    }
}
export { createPostService, getPostsService, updatePostService, deletePostService, getUserPostListService };