import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

const mainListItems = [
	{ text: 'Home', icon: <HomeRoundedIcon />, href: '/' },
	{ text: 'Analytics', icon: <AnalyticsRoundedIcon />, href: '/analytics' },
	{ text: 'Clients', icon: <PeopleRoundedIcon />, href: '/clients' },
	{ text: 'Tasks', icon: <AssignmentRoundedIcon />, href: '/tasks' },
];

const secondaryListItems = [
	{ text: 'Settings', icon: <SettingsRoundedIcon />, href: '/settings' },
	{ text: 'About', icon: <InfoRoundedIcon />, href: '/about' },
	{ text: 'Feedback', icon: <HelpRoundedIcon />, href: '/feedback' },
];

export default function MenuContent() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
			<List dense>
				{mainListItems.map((item) => (
					<ListItem
						key={item.text}
						disablePadding
						sx={{ display: 'block' }}
						onClick={() => router.push(item.href)}
					>
						<ListItemButton selected={item.href === pathname}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<List dense>
				{secondaryListItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
						<ListItemButton>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Stack>
	);
}
