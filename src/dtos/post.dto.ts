export type CreatePostDto = {
  content: string;
  visibility?: "public" | "friends" | "private";
};

export type UpdatePostDto = {
  content?: string;
  visibility?: "public" | "friends" | "private";
};