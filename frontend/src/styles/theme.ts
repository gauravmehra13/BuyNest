export const theme = {
  button: {
    primary: "bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2.5 px-4 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-md flex items-center justify-center space-x-2",
    secondary: "bg-white text-primary-600 border border-primary-600 py-2.5 px-4 rounded-lg hover:bg-primary-50 transition-all duration-300 flex items-center justify-center space-x-2",
    outline: "border-2 border-white text-white py-2.5 px-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 flex items-center justify-center space-x-2",
  },
  card: {
    base: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300",
    hover: "transform hover:scale-[1.02] transition-transform duration-300",
  },
  input: {
    base: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent",
    withIcon: "pl-10 pr-4",
  },
  gradients: {
    primary: "bg-gradient-to-r from-primary-600 to-secondary-600",
    hover: "hover:from-primary-700 hover:to-secondary-700",
  },
  text: {
    heading: "font-semibold text-gray-900",
    body: "text-gray-600",
    link: "text-primary-600 hover:text-primary-700 transition-colors",
  },
  layout: {
    section: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  },
} as const;

// Common class combinations
export const commonClasses = {
  pageContainer: "min-h-screen bg-gray-50",
  sectionContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
  cardGrid: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexVerticalCenter: "flex items-center",
  gradientText: "bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600",
} as const;

// Animation variants
export const animations = {
  fadeIn: "transition-opacity duration-300 ease-in-out",
  slideIn: "transition-transform duration-300 ease-in-out",
  scaleIn: "transition-transform duration-300 ease-in-out transform hover:scale-105",
} as const; 