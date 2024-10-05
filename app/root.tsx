import { Box, Container, Flex, Heading, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

export default function App() {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="data:image/x-icon;base64,AA" />
				<Meta />
				<Links />
			</head>
			<body>
				<Theme>
					<Box pt="50">
						<Container size="3" align={"center"}>
							<Flex direction="column" gap="3">
								<Heading size="9">Indie Map</Heading>
								<Heading size="5">
									Find fantastic independent products made all over the UK
								</Heading>
							</Flex>

							<Outlet />

							<Scripts />
						</Container>
					</Box>
				</Theme>
			</body>
		</html>
	);
}
