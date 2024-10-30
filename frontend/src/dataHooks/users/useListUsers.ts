import { SERVER_URL } from "@/consts/env";
import { User } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useListUsers = () => {
	return useInfiniteQuery({
		queryKey: useListUsers.getKey(),
		queryFn: async ({ pageParam }) => {
			const response = await fetch(
				`${SERVER_URL}/users?count=${10}&lastPageToken=${encodeURIComponent(pageParam)}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const res = await response.json();
			return {
				users: res.users as User[],
				pageParam: res.nextPageToken as string,
			};
		},
		getNextPageParam: (lastPage) => lastPage.pageParam || null,
		initialPageParam: "",
	});
};

useListUsers.getKey = () => ["users"] as const;
