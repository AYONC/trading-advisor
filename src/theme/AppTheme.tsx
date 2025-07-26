import type { ThemeOptions } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { chartsCustomizations } from '@/theme/customizations/charts';
import { dataDisplayCustomizations } from '@/theme/customizations/dataDisplay';
import { datePickersCustomizations } from '@/theme/customizations/datePickers';
import { feedbackCustomizations } from '@/theme/customizations/feedback';
import { inputsCustomizations } from '@/theme/customizations/inputs';
import { navigationCustomizations } from '@/theme/customizations/navigation';
import { surfacesCustomizations } from '@/theme/customizations/surfaces';
import { treeViewCustomizations } from '@/theme/customizations/treeView';
import {
	colorSchemes,
	shadows,
	shape,
	typography,
} from '@/theme/themePrimitives';
import GlobalVariables from './GlobalVariables';

interface AppThemeProps {
	children: React.ReactNode;
	/**
	 * This is for the docs site. You can ignore it or remove it.
	 */
	disableCustomTheme?: boolean;
	themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
	const { children, disableCustomTheme, themeComponents } = props;
	const theme = React.useMemo(() => {
		return disableCustomTheme
			? {}
			: createTheme({
					// For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
					cssVariables: {
						colorSchemeSelector: 'data-mui-color-scheme',
						cssVarPrefix: 'template',
					},
					colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
					typography,
					shadows,
					shape,
					components: {
						...inputsCustomizations,
						...dataDisplayCustomizations,
						...feedbackCustomizations,
						...navigationCustomizations,
						...surfacesCustomizations,
						...chartsCustomizations,
						...datePickersCustomizations,
						...treeViewCustomizations,
						...themeComponents,
					},
				});
	}, [disableCustomTheme, themeComponents]);

	if (disableCustomTheme) {
		return <React.Fragment>{children}</React.Fragment>;
	}
	return (
		<ThemeProvider theme={theme} disableTransitionOnChange>
			<GlobalVariables />
			{children}
		</ThemeProvider>
	);
}
