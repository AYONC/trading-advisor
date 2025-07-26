import { GlobalStyles } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { gray } from './themePrimitives';

export default function GlobalVariables() {
	const { mode } = useColorScheme();

	const styles = useMemo(
		() => ({
			'* > .MuiDataGrid-main': {},
			'* > .MuiDataGrid-row, * > .MuiDataGrid-columnHeaders, * > .MuiDataGrid-cell':
				{
					display: 'flex',
					alignItems: 'center',
					'--DataGrid-rowBorderColor': mode === 'light' ? gray[200] : gray[700],
				},
		}),
		[mode],
	);

	return <GlobalStyles styles={styles} />;
}
