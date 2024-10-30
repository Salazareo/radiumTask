import React from "react";
import { IconSearch } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { ActionIcon, Box, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { searchAtom } from "@/atoms/searchAtom";

export const SearchBar = React.forwardRef<HTMLFormElement>((_props, ref) => {
	const [search, setSearch] = useAtom(searchAtom);

	const onSubmit = ({ search }: { search: string }) => {
		setSearch(search);
	};
	const form = useForm({
		initialValues: { search },
	});

	return (
		<Box ref={ref} component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
			<Group align="center" justify="center" wrap="nowrap" p="xl">
				<TextInput
					{...form.getInputProps("search")}
					placeholder="Get user by email"
					w="min(80%, 60rem)"
					size="md"
				/>
				<ActionIcon size="42px" type="submit">
					<IconSearch />
				</ActionIcon>
			</Group>
		</Box>
	);
});
