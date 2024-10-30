import { useCreateUser } from "@/dataHooks/users/useCreateUser";
import { ActionIcon, Button, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPlus } from "@tabler/icons-react";
import React from "react";

export const CreateUserModal = () => {
	const [opened, setOpened] = React.useState(false);
	const form = useForm({ initialValues: { email: "" } });
	const { mutate } = useCreateUser();
	const onSubmit = (values: { email: string }) => {
		mutate(values.email);
		form.reset();
		setOpened(false);
	};
	return (
		<>
			<ActionIcon size="lg" onClick={() => setOpened(true)}>
				<IconUserPlus />
			</ActionIcon>
			<Modal
				withinPortal
				centered
				title="Create User"
				opened={opened}
				onClose={() => setOpened(false)}
			>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Stack>
						<TextInput {...form.getInputProps("email")} />
						<Button type="submit">Create</Button>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
