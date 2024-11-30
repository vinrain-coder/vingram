"user client";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserToolTip from "./UserToolTip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: String;
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link href={`/user/${username}`} className="text-primary hover:underline">
        {children}
      </Link>
    );
  }
  return (
    <UserToolTip user={data}>
      <Link href={`/user/${username}`} className="text-primary hover:underline">
        {children}
      </Link>
    </UserToolTip>
  );
}
