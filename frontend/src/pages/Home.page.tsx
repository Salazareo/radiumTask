import { searchAtom } from "@/atoms/searchAtom";
import { AllUsersTable } from "@/components/UsersTable/AllUsersTable";
import { SingleUserTable } from "@/components/UsersTable/SingleUserTable";
import { Center } from "@mantine/core";
import { useAtomValue } from "jotai";

export const HomePage: React.FC = () => {
	const queryInput = useAtomValue(searchAtom);
	return (
		<Center>
			{!queryInput ? <AllUsersTable /> : <SingleUserTable email={queryInput} />}
		</Center>
	);
};
