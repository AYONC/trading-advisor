import AddBoxIcon from '@mui/icons-material/AddBox';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Collapse from '@mui/material/Collapse';
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
	{ text: 'Market', icon: <TimelineIcon />, href: '/market' },
	{ text: 'Clients', icon: <PeopleRoundedIcon />, href: '/clients' },
	{ text: 'Tasks', icon: <AssignmentRoundedIcon />, href: '/tasks' },
];

const basicDataItems = [
	{ text: 'Sectors', icon: <BusinessIcon />, href: '/basic-data/sectors' },
	{ text: 'Stocks', icon: <ShowChartIcon />, href: '/basic-data/stocks' },
];

const analysisItems = [
	{ text: 'Add Sector', icon: <BusinessIcon />, href: '/analysis/add-sector' },
	{ text: 'Add Stock', icon: <AddBoxIcon />, href: '/analysis/add-stock' },
	{
		text: 'Add Earning Analysis',
		icon: <TrendingUpIcon />,
		href: '/analysis/earning/add',
	},
	{
		text: 'Add Analysis',
		icon: <TrendingUpIcon />,
		href: '/analysis/add-analysis',
	},
];

const secondaryListItems = [
	{ text: 'Settings', icon: <SettingsRoundedIcon />, href: '/settings' },
	{ text: 'About', icon: <InfoRoundedIcon />, href: '/about' },
	{ text: 'Feedback', icon: <HelpRoundedIcon />, href: '/feedback' },
];

export default function MenuContent() {
	const router = useRouter();
	const pathname = usePathname();
	const [analysisOpen, setAnalysisOpen] = React.useState(
		pathname.startsWith('/analysis'),
	);
	const [basicDataOpen, setBasicDataOpen] = React.useState(
		pathname.startsWith('/basic-data'),
	);

	const handleAnalysisClick = () => {
		setAnalysisOpen(!analysisOpen);
	};

	const handleBasicDataClick = () => {
		setBasicDataOpen(!basicDataOpen);
	};

	const handleNavigation = (href: string) => {
		router.push(href);
	};

	return (
		<Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
			<List dense>
				{mainListItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
						<ListItemButton
							selected={item.href === pathname}
							onClick={() => handleNavigation(item.href)}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}

				{/* Basic Data Section */}
				<ListItem disablePadding sx={{ display: 'block' }}>
					<ListItemButton onClick={handleBasicDataClick}>
						<ListItemIcon>
							<InfoRoundedIcon />
						</ListItemIcon>
						<ListItemText primary="Basic Data" />
						{analysisOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
				</ListItem>
				<Collapse in={basicDataOpen} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{basicDataItems.map((item) => (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
									sx={{ ml: 4 }}
									selected={item.href === pathname}
									onClick={() => handleNavigation(item.href)}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Collapse>

				{/* Analysis Section */}
				<ListItem disablePadding sx={{ display: 'block' }}>
					<ListItemButton onClick={handleAnalysisClick}>
						<ListItemIcon>
							<AnalyticsRoundedIcon />
						</ListItemIcon>
						<ListItemText primary="Analysis" />
						{analysisOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
				</ListItem>
				<Collapse in={analysisOpen} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{analysisItems.map((item) => (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
									sx={{ ml: 4 }}
									selected={item.href === pathname}
									onClick={() => handleNavigation(item.href)}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Collapse>
			</List>

			<List dense>
				{secondaryListItems.map((item) => (
					<ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
						<ListItemButton onClick={() => handleNavigation(item.href)}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Stack>
	);
}
