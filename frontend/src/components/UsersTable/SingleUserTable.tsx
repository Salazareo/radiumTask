import { useGetUser } from "@/dataHooks/users/useGetUser";
import { UsersTable } from "./UsersTable";

export const SingleUserTable: React.FC<{ email: string }> = ({ email }) => {
	const { data, isLoading } = useGetUser(email);
	return <UsersTable isLoading={isLoading} users={data ? [data] : []} />;
};
