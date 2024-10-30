import { SERVER_URL } from "@/consts/env";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListUsers } from "./useListUsers";
import { User } from "@/types/user";
import { useGetUser } from "./useGetUser";

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (user: User) => {
			const response = await fetch(`${SERVER_URL}/users/${user.email}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
		},
		onSuccess: (_res, user) => {
			queryClient.invalidateQueries({ queryKey: useListUsers.getKey() });
			queryClient.invalidateQueries({
				queryKey: useGetUser.getKey(user.email),
			});
		},
	});
};
