import prisma from "../config/db.config.js";

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: parseInt(postId),
        userId: userId,
      },
    });
    if (existingLike) {
      // If the like already exists, remove it
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return res.status(200).json({
        message: "Post unliked successfully",
      });
    } else {
      // If the like does not exist, create it
      await prisma.like.create({
        data: {
          postId: parseInt(postId),
          userId: userId,
        },
      });
      return res.status(201).json({
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
