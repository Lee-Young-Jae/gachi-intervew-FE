"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { accessTokenState, userIdState } from "@/store/auth";
import { Post } from "@/model/Post";
import patchPost from "../_lib/patchPost";

export default function EditPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.postTitle);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState<string[]>(post.tag);
  const [newTag, setNewTag] = useState("");
  const category = useSearchParams().get("tab");
  const queryClient = useQueryClient();
  const { openDialogWithBack, closeModal } = useModal();
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(userIdState);

  const postData = useMutation({
    mutationKey: ["community", post.postId.toString()],
    mutationFn: (updatedPost: {
      title: string;
      content: string;
      tags: string[];
      category: string;
      accessToken: string;
      userId: number;
      postId: string;
    }) => patchPost(updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", post?.postId.toString()],
      });
      openDialogWithBack("게시글이 수정되었습니다.");
    },
  });

  if (!category) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData.mutate({
      title,
      content,
      tags,
      category,
      accessToken,
      userId,
      postId: post.postId,
    });
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false && newTag.trim() !== "") {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleBadgeClick = (clickedTag: string) => {
    setTags(tags.filter((tag) => tag !== clickedTag));
  };

  return (
    <>
      <p className="text-3xl font-bold mt-8">
        {post.category === "reviews" ? "면접 후기 수정" : "스터디 모집 수정"}
      </p>
      <form onSubmit={onSubmit} className="flex flex-col w-full mt-2">
        <input
          type="text"
          placeholder="제목에 핵심 내용을 요약해 보세요"
          onChange={handleTitle}
          value={title}
          required
          className="p-2 border border-gray-300 rounded-md mb-4 text-lg focus:outline-none"
        />
        <div className="mb-4">
          {tags?.map((tag, index) => (
            <Badge
              key={index}
              className="mr-1 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => handleBadgeClick(tag)}
            >
              #{tag}
            </Badge>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={handleNewTagChange}
            onKeyDown={handleNewTagKeyDown}
            placeholder="태그 작성 후 엔터키를 눌러주세요 (태그 클릭 시 삭제)"
            className="w-2/3 border-none focus:outline-none"
          />
        </div>
        <textarea
          placeholder={`[면접 후기 내용 작성 가이드]\n\n - 면접 질문\n - 면접 답변 혹은 면접 느낌\n - 발표 시기`}
          onChange={handleContent}
          value={content}
          required
          className="p-2 resize-none border border-gray-300 rounded-md mb-4 h-80 focus:outline-none"
        />
        <button type="submit" className="bg-black text-white font-bold py-2 px-4 rounded">
          수정 완료
        </button>
      </form>
    </>
  );
}
