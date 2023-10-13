import Post from "../models/postModel";
import User from "../models/userModel";

async function createPost(postTitle: string, userId: number): Promise<any> {
    try {
        const post = await Post.create({
            post_title: postTitle,
            user_id: userId
        });

        return post;
    } catch (error: any) {
        console.log('Error creating post DAO: ' + error.message);
        throw new Error('Error creating post DAO: ' + error.message);
    }
}

async function getPosts(): Promise<any> {
    try {
        const posts = await Post.findAll({
            where: {
                is_deleted: 0,
            },
            attributes: ['post_id', 'post_title', 'user_id'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_name'],
                },
            ]
        });

        return posts.map(post => ({
            post_id: post.post_id,
            post_title: post.post_title,
            user_id: post.user_id,
            user_name: post.user.user_name,
        }));
    } catch (error: any) {
        console.log('Error getting posts: ' + error.message);
        throw new Error('Error getting posts: ' + error.message);
    }
}

async function getUserPostList(username: string): Promise<any> {
    try {
        const posts = await Post.findAll({
            where: {
                is_deleted: 0,
            },
            attributes: ['post_id', 'post_title', 'user_id'],
            include: [
                {
                    model: User,
                    as: 'user',
                    where: {
                        user_name: username
                    },
                    attributes: ['user_name'],
                },
            ]
        });

        return posts.map(post => ({
            post_id: post.post_id,
            post_title: post.post_title,
            user_id: post.user_id,
            user_name: post.user.user_name,
        }));
    } catch (error: any) {
        console.log('Error getting posts: ' + error.message);
        throw new Error('Error getting posts: ' + error.message);
    }
}

async function getUserIdByPost(postId: number): Promise<any> {
    try {
        const post = await Post.findOne({
          where: { post_id: postId },
        });
    
        if (post) {
          return post.user_id;
        }
    
        return null;
      } catch (error: any) {
        throw new Error('Error retrieving user ID for post:' + error.message);
      }
}


async function updatePost(postTitle: string, userId: number, postId: number): Promise<any> {
    try {
        console.log('Inside updatePost DAO'); // Add this line
        const post = await Post.update({
            post_title: postTitle,
            user_id: userId
        }, {
            where: {
                post_id: postId
            }
        })

        return post;
    } catch (error: any) {
        console.log('Error updating post DAO: ' + error.message);
        throw new Error('Error updating post DAO: ' + error.message);
    }
}

async function deletePost(postId: number): Promise<any> {
    try {
        const post = await Post.update(
            { is_deleted: 1 },
            {
                where: {
                    post_id: postId
                }
            }
        )

        return post;
    } catch (error: any) {
        console.log('Error creating post DAO: ' + error.message);
        throw new Error('Error creating post DAO: ' + error.message);
    }
}

export { createPost, getPosts, getUserIdByPost, updatePost, deletePost, getUserPostList };