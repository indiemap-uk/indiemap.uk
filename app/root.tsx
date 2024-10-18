import { Box, Container, Flex, Heading, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";
import { pool } from "../db/pool";
import { IndieRepository } from "../repository/IndieRepository";

export const loader = async () => {
	const repo = new IndieRepository(pool);
	const indies = await repo.getAll();

	return { indies };
};

export default function App() {
	const { indies } = useLoaderData<typeof loader>();

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

							<div>
								{indies.map((indie) => {
									return <div key={indie.id}>{indie.name}</div>;
								})}
							</div>

							<Outlet />

							<Scripts />
						</Container>
					</Box>
				</Theme>
			</body>
		</html>
	);
}
