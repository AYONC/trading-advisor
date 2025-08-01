import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import Logo from './Logo';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
	width: drawerWidth,
	flexShrink: 0,
	boxSizing: 'border-box',
	mt: 10,
	[`& .${drawerClasses.paper}`]: {
		width: drawerWidth,
		boxSizing: 'border-box',
	},
});

interface SideMenuProps {
	desktopOpen?: boolean;
	onDesktopToggle?: () => void;
}

export default function SideMenu({
	desktopOpen = true,
	onDesktopToggle: _onDesktopToggle,
}: SideMenuProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleMobileDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const getDrawerContent = () => (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					mt: 'calc(var(--template-frame-height, 0px) + 4px)',
					p: 1.5,
				}}
			>
				<Logo />
			</Box>
			<Divider />
			<Box
				sx={{
					overflow: 'auto',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<MenuContent />
			</Box>
			<Stack
				direction="row"
				sx={{
					p: 2,
					gap: 1,
					alignItems: 'center',
					borderTop: '1px solid',
					borderColor: 'divider',
				}}
			>
				<Avatar
					sizes="small"
					alt="Ayon Choi"
					src="/static/images/avatar/7.jpg"
					sx={{ width: 36, height: 36 }}
				/>
				<Box sx={{ mr: 'auto' }}>
					<Typography
						variant="body2"
						sx={{ fontWeight: 500, lineHeight: '16px' }}
					>
						Ayon Choi
					</Typography>
					<Typography variant="caption" sx={{ color: 'text.secondary' }}>
						aychoi07@gmail.com
					</Typography>
				</Box>
				<OptionsMenu />
			</Stack>
		</>
	);

	return (
		<>
			{/* Desktop drawer */}
			<Drawer
				variant="persistent"
				open={desktopOpen}
				sx={{
					display: { xs: 'none', md: 'block' },
					[`& .${drawerClasses.paper}`]: {
						backgroundColor: 'background.paper',
					},
				}}
			>
				{getDrawerContent()}
			</Drawer>

			{/* Mobile drawer */}
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleMobileDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', md: 'none' },
					[`& .${drawerClasses.paper}`]: {
						backgroundColor: 'background.paper',
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
			>
				{getDrawerContent()}
			</Drawer>

			{/* Floating Action Button for mobile */}
			{isMobile && (
				<Fab
					color="primary"
					aria-label="menu"
					onClick={handleMobileDrawerToggle}
					sx={{
						position: 'fixed',
						bottom: 24,
						right: 24,
						zIndex: theme.zIndex.speedDial,
					}}
				>
					<MenuIcon />
				</Fab>
			)}
		</>
	);
}
