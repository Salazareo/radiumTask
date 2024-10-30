import { useQuery } from "@tanstack/react-query";
import { SERVER_URL } from "@/consts/env";
import { User } from "@/types/user";

export const useGetUser = (userId: string) => {
	return useQuery({
		queryKey: useGetUser.getKey(userId),
		queryFn: async () => {
			const response = await fetch(`${SERVER_URL}/users/${userId}`);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return (await response.json()) as User;
		},
	});
};

useGetUser.getKey = (userId: string) => ["users", userId] as const;
