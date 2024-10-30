import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { AppShell, Container, Group } from "@mantine/core";
import { IconMusicQuestion } from "@tabler/icons-react";
import React from "react";
import { Outlet } from "react-router-dom";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { CreateUserModal } from "@/components/CreateUser/CreateUserModal";

export const Layout: React.FC = () => {
	return (
		<AppShell
			header={{
				height: "5rem",
			}}
		>
			<AppShell.Header>
				<Group
					h="100%"
					align="center"
					justify="space-between"
					w="100%"
					wrap="nowrap"
					p="xl"
				>
					<IconMusicQuestion />
					<SearchBar />
					<Group justify="end" wrap="nowrap">
						<CreateUserModal />
						<ColorSchemeToggle />
					</Group>
				</Group>
			</AppShell.Header>
			<AppShell.Main>
				<Container p="xl" size="lg">
					<Outlet />
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
