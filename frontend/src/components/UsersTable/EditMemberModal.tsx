import { useUpdateUser } from "@/dataHooks/users/useUpdateUser";
import { User } from "@/types/user";
import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export const EditMemberModal: React.FC<{
	user: User;
	opened: boolean;
	onClose: () => void;
}> = ({ user, opened, onClose }) => {
	const { mutate } = useUpdateUser();
	const form = useForm({
		initialValues: user,
	});
	const onSubmit = (values: User) => {
		mutate(values);
		onClose();
	};
	return (
		<Modal
			withinPortal
			opened={opened}
			centered
			onClose={onClose}
			title={`Update ${user.email}`}
		>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<TextInput {...form.getInputProps("email")} disabled />
					<TextInput {...form.getInputProps("name")} />
					<TextInput {...form.getInputProps("createdOn")} disabled />
					<Button type="submit">Update</Button>
				</Stack>
			</form>
		</Modal>
	);
};
