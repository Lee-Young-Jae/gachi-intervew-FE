import { useQuery } from "@tanstack/react-query";
import getMyReviews from "../_lib/getMyReviews";
import { Post } from "@/model/Post";
import PostCard from "../../community/_component/PostCard";
import { useRecoilValue } from "recoil";
import { accessTokenState, userIdState } from "@/store/auth";

export default function MyInterviewReviewPosts({ tabParams }: { tabParams: string | undefined }) {
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(userIdState);

  const { data } = useQuery<Post[], Object, Post[], [_1: string, _2: string, _3: string]>({
    queryKey: ["community", "reviews", "my"],
    queryFn: ({ queryKey }) => getMyReviews({ queryKey, userId, accessToken }),
  });

  return data?.map((post) => <PostCard key={post.postId} post={post} tabParams={tabParams} />);
}
