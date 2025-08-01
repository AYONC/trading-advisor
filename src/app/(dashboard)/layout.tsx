'use client';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import * as React from 'react';
import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sideMenuOpen, setSideMenuOpen] = React.useState(true);

	const handleSideMenuToggle = () => {
		setSideMenuOpen(!sideMenuOpen);
	};
	return (
		<AppTheme>
			<CssBaseline enableColorScheme />
			<Box sx={{ display: 'flex' }}>
				<SideMenu
					desktopOpen={sideMenuOpen}
					onDesktopToggle={handleSideMenuToggle}
				/>
				{/* Main content */}
				<Box
					component="main"
					sx={(theme) => ({
						flexGrow: 1,
						backgroundColor: theme.vars
							? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
							: alpha(theme.palette.background.default, 1),
						overflow: 'auto',
						transition: theme.transitions.create('margin', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
						marginLeft: sideMenuOpen ? 0 : '-240px',
						...(sideMenuOpen && {
							transition: theme.transitions.create('margin', {
								easing: theme.transitions.easing.easeOut,
								duration: theme.transitions.duration.enteringScreen,
							}),
							marginLeft: 0,
						}),
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
						<Header onMenuToggle={handleSideMenuToggle} />
						{children}
					</Stack>
				</Box>
			</Box>
		</AppTheme>
	);
}
