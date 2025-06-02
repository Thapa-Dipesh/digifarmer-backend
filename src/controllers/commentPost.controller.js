import prisma from "../config/db.config.js";

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    console.log(postId);

    // Validate the content
    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Comment content cannot be empty",
      });
    }

    // Check if the post exists
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        userId,
      },
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

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the post exists
    const post = await prisma.posts.findUnique({
      where: { id: parseInt(postId) },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Fetch comments for the post
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
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
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    // Validate the content
    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Comment content cannot be empty",
      });
    }

    // Check if the comment exists and belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment || comment.userId !== userId) {
      return res.status(404).json({
        message: "Comment not found or you do not have permission to update it",
      });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
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

    return res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update comment",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Check if the comment exists and belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment || comment.userId !== userId) {
      return res.status(404).json({
        message: "Comment not found or you do not have permission to delete it",
      });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};
