import { SERVER_URL } from "@/consts/env";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListUsers } from "./useListUsers";
import { useSetAtom } from "jotai";
import { searchAtom } from "@/atoms/searchAtom";

export const useDeleteUser = () => {
	const setSearchValue = useSetAtom(searchAtom);
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["deleteUser"],
		mutationFn: async (email: string) => {
			const response = await fetch(`${SERVER_URL}/users/${email}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: useListUsers.getKey() });
			setSearchValue("");
		},
	});
};
