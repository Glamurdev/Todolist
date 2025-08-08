# Todo List App

A modern, responsive todo list application built with vanilla HTML, CSS, and JavaScript. Features a clean, intuitive interface with smooth animations and local storage persistence.

## Features

### ✨ Core Functionality
- **Add Todos**: Create new todo items with a clean input interface
- **Mark Complete**: Click checkboxes to mark todos as complete/incomplete
- **Delete Todos**: Remove individual todos with the trash icon
- **Filter Views**: Switch between All, Active, and Completed todos
- **Clear Completed**: Bulk remove all completed todos
- **Item Counter**: See how many active items remain

### 🎨 Design Features
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects and visual feedback
- **Empty States**: Helpful messages when no todos exist
- **Smooth Animations**: Slide-in effects and transitions

### 💾 Data Persistence
- **Local Storage**: Todos are automatically saved to browser storage
- **Session Persistence**: Data survives page refreshes and browser restarts
- **Cross-Tab Sync**: Changes are reflected across multiple browser tabs

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or installations required

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start adding your todos!

### File Structure
```
todo-list-app/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Usage

### Adding Todos
1. Type your todo text in the input field
2. Press Enter or click the "+" button
3. Your todo will appear at the top of the list

### Managing Todos
- **Complete**: Click the circular checkbox next to any todo
- **Delete**: Click the trash icon to remove a todo
- **Filter**: Use the filter buttons to view different todo states
- **Clear Completed**: Click "Clear completed" to remove all finished todos

### Keyboard Shortcuts
- **Enter**: Add a new todo (when input is focused)
- **Click**: Toggle todo completion status

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Local Storage

The app uses browser localStorage to persist your todos. Data is stored as JSON and includes:
- Todo text content
- Completion status
- Creation timestamp
- Unique ID

## Customization

### Styling
The app uses CSS custom properties and can be easily customized by modifying `styles.css`:
- Change colors in the gradient variables
- Adjust spacing and sizing
- Modify animations and transitions

### Functionality
The JavaScript is organized in a class-based structure for easy extension:
- Add new features by extending the `TodoApp` class
- Modify existing behavior by overriding methods
- Add new event handlers as needed

## Sample Data

On first load, the app includes sample todos to demonstrate functionality:
- Welcome message
- Example completed todo
- Instructions for using filters

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

This project is open source and available under the MIT License.
