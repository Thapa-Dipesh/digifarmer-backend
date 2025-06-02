import prisma from "../config/db.config.js";

export const createPost = async (req, res) => {
  const user = req.user;
  const file = req.files;

  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const image = file && file.length > 0 ? file[0].filename : null;
    const post = await prisma.posts.create({
      data: {
        title,
        content,
        image,
        userId: user.id,
      },
    });

    return res.status(201).json({
      message: "Post created successfully",
      post: {
        id: post.id,
        title,
        content,
        image,
        userId: post.userId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const file = req.files;
  const { title, content } = req.body;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this post",
      });
    }

    const image = file && file.length > 0 ? file[0].filename : post.image;
    const updatedPost = await prisma.posts.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        image,
      },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId !== user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
      });
    }

    await prisma.posts.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
