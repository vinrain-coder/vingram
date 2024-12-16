//@ts-nocheck
"use client";

import { Post as PostData } from "@prisma/client";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import formatRelativeDate from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserToolTip";
import Image from "next/image";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatar} />
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
              className="block text-sm text-muted-foreground hover-underline"
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
    </article>
  );
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "grid gap-2",
        attachments.length === 1 && "grid-cols-1",
        attachments.length === 2 && "grid-cols-2",
        attachments.length >= 3 && "grid-cols-2 md:grid-cols-3"
      )}
    >
      {attachments.slice(0, 5).map((media, index) => (
        <MediaPreview
          key={media.id}
          media={media}
          isLast={index === 4 && attachments.length > 5}
        />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
  isLast?: boolean;
}

function MediaPreview({ media, isLast }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <div className="relative">
        <Image
          src={media.url}
          alt="Attachment"
          layout="fill"
          className="rounded-2xl object-cover"
        />
        {isLast && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-bold rounded-2xl">
            +{media.attachments.length - 5} more
          </div>
        )}
      </div>
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div className="relative">
        <video
          src={media.url}
          controls
          className="w-full h-full max-h-[15rem] object-cover rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
