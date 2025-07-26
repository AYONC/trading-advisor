'use client';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import type * as React from 'react';
import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppTheme>
			<CssBaseline enableColorScheme />
			<Box sx={{ display: 'flex' }}>
				<SideMenu />
				{/* <AppNavbar /> */}
				{/* Main content */}
				<Box
					component="main"
					sx={(theme) => ({
						flexGrow: 1,
						backgroundColor: theme.vars
							? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
							: alpha(theme.palette.background.default, 1),
						overflow: 'auto',
					})}
				>
					<Stack
						spacing={2}
						sx={{
							alignItems: 'center',
							mx: 3,
							pb: 5,
							mt: { xs: 8, md: 0 },
						}}
					>
						<Header />
						{children}
					</Stack>
				</Box>
			</Box>
		</AppTheme>
	);
}
