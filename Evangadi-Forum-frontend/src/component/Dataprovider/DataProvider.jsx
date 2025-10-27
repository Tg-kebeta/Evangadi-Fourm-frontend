import React, { createContext, useState } from 'react';

// Core context used across the app
export const DataContext = createContext();
// Compatibility alias expected by other files
export const UserContext = DataContext;

// Core provider used across the app
export const DataProvider = ({ children, value }) => {
	// Allow initialization from an optional `value` prop (e.g., from main.jsx)
	const [userData, setUserData] = useState(() => {
		if (value && (value.user !== undefined || value.token !== undefined)) {
			return { user: value.user, token: value.token };
		}
		const storedToken = localStorage.getItem('token') || localStorage.getItem('authtoken');
		return {
			user: undefined,
			token: storedToken || undefined,
		};
	});

	return (
		<DataContext.Provider value={[userData, setUserData]}>
			{children}
		</DataContext.Provider>
	);
};

// Compatibility alias expected by other files
export const UserProvider = DataProvider;

export default DataProvider;
