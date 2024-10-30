import { SERVER_URL } from "@/consts/env";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListUsers } from "./useListUsers";

export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (email: string) => {
			const response = await fetch(`${SERVER_URL}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: useListUsers.getKey() });
		},
	});
};
