import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { rem, Switch, useMantineColorScheme } from "@mantine/core";

export const ColorSchemeToggle = () => {
	const { setColorScheme, colorScheme } = useMantineColorScheme({
		keepTransitions: true,
	});

	const sunIcon = (
		<IconSun
			style={{ width: rem(16), height: rem(16) }}
			stroke={2.5}
			color="LemonChiffon"
		/>
	);

	const moonIcon = (
		<IconMoonStars
			style={{ width: rem(16), height: rem(16) }}
			stroke={2.5}
			color="cyan"
		/>
	);

	return (
		<Switch
			size="lg"
			onLabel={sunIcon}
			offLabel={moonIcon}
			checked={colorScheme === "light"}
			onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
		/>
	);
};
