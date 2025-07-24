import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Box, Typography } from '@mui/material';

export default function Logo() {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<AttachMoneyIcon />
			<Typography
				variant="h6"
				sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}
			>
				Stock Management
			</Typography>
		</Box>
	);
}
