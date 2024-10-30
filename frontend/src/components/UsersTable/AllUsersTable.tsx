import { useListUsers } from "@/dataHooks/users/useListUsers";
import React from "react";
import { UsersTable } from "./UsersTable";

export const AllUsersTable: React.FC = () => {
	const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
		useListUsers();
	return (
		<UsersTable
			isLoading={isLoading || isFetchingNextPage}
			fetchMore={hasNextPage ? fetchNextPage : undefined}
			users={data?.pages.flatMap((user) => user.users) ?? []}
		/>
	);
};
