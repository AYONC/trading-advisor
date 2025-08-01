import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

interface HeaderProps {
	onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
	return (
		<Stack
			direction="row"
			sx={{
				display: 'flex',
				width: '100%',
				alignItems: { xs: 'flex-start', md: 'center' },
				justifyContent: 'space-between',
				maxWidth: { sm: '100%', md: '1700px' },
				pt: 1.5,
			}}
			spacing={2}
		>
			{/* Menu toggle button for desktop only */}
			{isDesktop && onMenuToggle && (
				<Stack direction="row" sx={{ gap: 1 }}>
					<IconButton
						onClick={onMenuToggle}
						sx={{
							color: 'text.secondary',
						}}
					>
						<MenuIcon />
					</IconButton>
				</Stack>
			)}

			<Stack direction="row" sx={{ gap: 1 }}>
				<ColorModeIconDropdown />
			</Stack>
		</Stack>
	);
}
