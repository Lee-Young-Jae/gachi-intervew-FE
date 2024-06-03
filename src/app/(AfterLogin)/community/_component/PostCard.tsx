import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/model/Post";
import { formatRelativeTime } from "@/lib/utills/days";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PostCard({
  post,
  tabParams,
}: {
  post: Post;
  tabParams: string | undefined;
}) {
  const router = useRouter();
  const [showAllTags, setShowAllTags] = useState(false);
  const MAX_TAGS_TO_SHOW = 3;

  const toggleShowAllTags = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowAllTags(!showAllTags);
  };

  const handleCardClick = () => {
    router.push(`/community/${tabParams}/${post.postId}`);
  };

  return (
    <Card onClick={handleCardClick} className="cursor-pointer">
      <CardHeader>
        <CardTitle className="truncate overflow-hidden">{post.postTitle}</CardTitle>
        <hr />
        <CardDescription className="h-24 whitespace-pre truncate overflow-hidden">
          {post.content}
        </CardDescription>
      </CardHeader>
      <div className="pl-4">
        {(showAllTags ? post.tag : post.tag?.slice(0, MAX_TAGS_TO_SHOW))?.map((tag, index) => (
          <Badge key={index} className="px-3 py-1 text-sm mx-1 mt-2" variant="secondary">
            #{tag}
          </Badge>
        ))}
        {post.tag?.length > MAX_TAGS_TO_SHOW && (
          <button onClick={toggleShowAllTags} className="text-blue-500 text-sm ml-2 mt-2">
            {showAllTags ? "접기" : `+${post.tag.length - MAX_TAGS_TO_SHOW} 더보기`}
          </button>
        )}
      </div>
      <div className="px-6 py-4">
        <div className="flex">
          <div className="flex items-center flex-1">
            {post.image ? (
              <img src={post.image} alt="프로필이미지" className="w-5 h-5 rounded-full" />
            ) : (
              <Image
                src="data:image/jpeg;base64,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"
                alt="프로필이미지"
                className="rounded-full"
                width={16}
                height={16}
              />
            )}
            <p className="text-gray-600 text-sm ml-2">
              <span className="font-semibold">{post.userName}</span> •{" "}
              {formatRelativeTime(post.time.toLocaleString())}
            </p>
          </div>
          <div className="flex items-center">
            <AiOutlineLike className="text-gray-500 mr-1" />
            <span className="text-gray-700 text-sm">{post.numOfLike}</span>
          </div>
          <div className="flex items-center ml-3">
            <FaRegComment className="text-gray-500 mr-1" />
            <span className="text-gray-700 text-sm">{post.numOfComment}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
