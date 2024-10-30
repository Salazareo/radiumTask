import { useDeleteUser } from "@/dataHooks/users/useDeleteUser";
import { User } from "@/types/user";
import { ActionIcon, Group, Loader, Table, Text } from "@mantine/core";
import { useInViewport } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import React from "react";
import { EditMemberModal } from "./EditMemberModal";

export const TableRow: React.FC<{ user: User }> = ({ user }) => {
	const { mutate } = useDeleteUser();
	const [editOpened, setEditOpened] = React.useState(false);
	return (
		<>
			<Table.Td>{user.email}</Table.Td>
			<Table.Td>
				<Group>
					<Text>{user.name}</Text>
					<ActionIcon
						onClick={() => {
							setEditOpened(true);
						}}
					>
						<IconPencil />
					</ActionIcon>
				</Group>
				<EditMemberModal
					opened={editOpened}
					onClose={() => setEditOpened(false)}
					user={user}
				/>
			</Table.Td>
			<Table.Td>{user.createdOn}</Table.Td>
			<Table.Td>
				<ActionIcon
					onClick={() => {
						mutate(user.email);
					}}
					color="red"
					variant="filled"
				>
					<IconTrash />
				</ActionIcon>
			</Table.Td>
		</>
	);
};

export const UsersTable: React.FC<{
	users: User[];
	isLoading?: boolean;
	fetchMore?: () => void;
}> = ({ users, fetchMore, isLoading }) => {
	const { ref, inViewport } = useInViewport();
	React.useEffect(() => {
		if (inViewport && fetchMore) {
			fetchMore();
		}
	}, [inViewport, fetchMore]);
	return (
		<Table.ScrollContainer minWidth="60vw">
			<Table striped highlightOnHover withTableBorder verticalSpacing="sm">
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Email</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Created on</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{users.map((element, index) => (
						<Table.Tr
							ref={index === users.length - 1 ? ref : undefined}
							key={element.email}
						>
							<TableRow user={element} />
						</Table.Tr>
					))}
				</Table.Tbody>
				{isLoading && <Loader />}
			</Table>
		</Table.ScrollContainer>
	);
};
