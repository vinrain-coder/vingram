"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import formatRelativeDate from "@/lib/utils";
import { Media } from "@prisma/client";
// import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";
// import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import UserTooltip from "../UserToolTip";
import Slider from "react-slick";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  // const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          {/* <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          /> */}
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id
            ),
          }}
        />
      </div>
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <div className="slick-next"></div>,
    prevArrow: <div className="slick-prev"></div>,

    centerMode: false,
    centerPadding: "20px",
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {attachments.map((media) => (
          <div key={media.id} className="pl-3">
            <MediaPreview media={media} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={600} // Customize size
        height={600}
        className="object-cover rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="object-cover w-full h-full rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

// interface CommentButtonProps {
//   post: PostData;
//   onClick: () => void;
// }

// function CommentButton({ post, onClick }: CommentButtonProps) {
//   return (
//     <button onClick={onClick} className="flex items-center gap-2">
//       <MessageSquare className="size-5" />
//       <span className="text-sm font-medium tabular-nums">
//         {post._count.comments}{" "}
//         <span className="hidden sm:inline">comments</span>
//       </span>
//     </button>
//   );
// }
